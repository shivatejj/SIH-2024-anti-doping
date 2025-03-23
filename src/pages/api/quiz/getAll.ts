import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz from "@/models/Quiz";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const user = isAuthenticated(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin") res.status(403).json({ message: "Forbidden: Admins only" });

    await connectDB();

    const { page = "1", limit = "10" } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;

    const quizzes = await Quiz.find().sort({ _id: -1 }).skip(skip).limit(pageSize);
    const totalQuizzes = await Quiz.countDocuments();

    const responseQuizzes = quizzes.map(quiz => {
      return {
        id: quiz._id,
        category: quiz.category,
        level: quiz.level
      }
    })

    return res.status(200).json({
      success: true,
      data: responseQuizzes,
      pagination: {
        total: totalQuizzes,
        pageIndex: pageNumber,
        pageSize: Math.ceil(totalQuizzes / pageSize),
      },
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}