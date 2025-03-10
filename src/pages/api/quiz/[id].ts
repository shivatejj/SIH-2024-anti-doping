import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz from "@/models/Quiz";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ message: "Method not allowed" });

  const { id } = req.query;
  const { content, questions } = req.body;

  try {
    if (!content && !questions) return res.status(400).json({ message: "Either content or questions has to be updated" });
    await connectDB();
    const user = isAuthenticated(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (content) quiz.content = content;

    if (questions && Array.isArray(questions)) {
      quiz.questions = [...quiz.questions, ...questions];
    }

    await quiz.save();

    return res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }

}