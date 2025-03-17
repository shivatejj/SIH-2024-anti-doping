import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz, { QuizLevelEnum } from "@/models/Quiz";
import UserStats from "@/models/UserStats";
import Exam, { StatusEnum } from "@/models/Exam";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectDB();
    const { category } = req.query;
    const user = isAuthenticated(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!category) return res.status(400).json({ message: "category is required" });

    const exam = await Exam.findOne({ userId: user.userId, category, status: StatusEnum.IN_PROGRESS });

    if (exam) return res.status(403).json({ message: "You have an exam in progress. Please complete it before starting a new one." });

    let userStat = await UserStats.findOne({ userId: user.userId, category });

    if (userStat) {

      if (userStat.level === QuizLevelEnum.COMPLETED) return res.status(403).json({
        message: `Quiz with ${category} category is completed`,
        level: QuizLevelEnum.COMPLETED
      });

      userStat = await UserStats.findOneAndUpdate(
        { userId: user.userId, category },
        { $inc: { attempts: 1 } }
      )
    } else {
      userStat = await UserStats.create({
        userId: user.userId,
        category,
      });
    }

    const quiz = await Quiz.findOne({ category: category, level: userStat.level });

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const shuffledQuestions = quiz.questions
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((data: { question: string, options: string[], _id: string }) =>
        ({ id: data._id, question: data.question, options: data.options }));

    await Exam.create({
      userId: user.userId,
      category,
      content: quiz.content,
      questions: shuffledQuestions,
      level: userStat.level
    });

    return res.status(200).json({
      id: quiz._id,
      content: quiz.content,
      questions: shuffledQuestions,
      level: userStat.level
    });

  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}