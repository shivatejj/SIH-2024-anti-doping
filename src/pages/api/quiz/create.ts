import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz from "@/models/Quiz";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { category, content, questions, level } = req.body;

  await connectDB();
  try {
    const user = isAuthenticated(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    if (questions.length < 5) {
      return res.status(500).json({ message: "At least 5 questions are needed" });
    }

    const quiz = await Quiz.findOne({ category: category, level: level });

    if (quiz) {
      return res.status(409).json({ message: "Quiz with same combination already exists" });
    }

    const newQuiz = new Quiz({ category, content, questions, level });

    await newQuiz.save();
    return res.status(201).json({ message: "New quiz created successfully" });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}