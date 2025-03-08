import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz from "@/models/Quiz";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  try {
    const user = isAuthenticated(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { category, level } = req.query;

    if (user.level !== level) {
      return res.status(401).json({ message: "Cannot access data" });
    }

    if (!category) {
      return res.status(500).json({ message: "category is required" });
    }

    if (!level) {
      return res.status(500).json({ message: "level is required" });
    }

    const quiz = await Quiz.findOne({ category: category, level: level });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const shuffledQuestions = quiz.questions
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((data: { question: string, options: string[], _id: string }) =>
        ({ id: data._id, question: data.question, options: data.options }));

    if (user.role === 'user') {
      await User.findOneAndUpdate(
        { userId: user.userId },
        { $inc: { attempts: 1 } }
      );
    }

    return res.status(200).json({ id: quiz._id, content: quiz.content, questions: shuffledQuestions });

  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}