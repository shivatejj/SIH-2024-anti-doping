import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz from "@/models/Quiz";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {

    await connectDB();
    const user = isAuthenticated(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const quizzes = await Quiz.find();

    if (quizzes.length === 0) {
      return res.status(404).json({ message: "Quizzes not found" });
    }

    const categories = [...new Set(quizzes.map((data: { category: string }) => data.category))];

    return res.status(200).json({ categories })
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}