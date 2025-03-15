import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz, { QuizLevelEnum } from "@/models/Quiz";
import UserStats from "@/models/UserStats";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { quizId, answers, category } = req.body;

  try {
    await connectDB();

    const user = isAuthenticated(req);
    const userStat = await UserStats.findOne({ userId: user.userId, category });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!userStat) {
      return res.status(403).json({ message: `Not registered for ${category} category yet` });
    } else if (userStat && userStat.level === QuizLevelEnum.COMPLETED) {
      return res.status(403).json({ message: `Course with ${category} category is completed` });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz with given ID not found" });

    const correctAnswersMap = new Map(quiz.questions.map((q: { _id: string, answer: string }) => [q._id.toString(), q.answer]));

    let score = 0;
    answers.forEach(({ questionId, selectedOption }: { questionId: string; selectedOption: string }) => {
      if (correctAnswersMap.get(questionId) === selectedOption) {
        score++;
      }
    });

    let newLevel = userStat.level;
    let finalScore = 0;

    if (score >= 3) {
      if (userStat.level === QuizLevelEnum.EASY) newLevel = QuizLevelEnum.MEDIUM;
      else if (userStat.level === QuizLevelEnum.MEDIUM) newLevel = QuizLevelEnum.HARD;
      else newLevel = QuizLevelEnum.COMPLETED;
      finalScore = score;
    }

    const updatedStats = await UserStats.findOneAndUpdate(
      { userId: user.userId, category },
      {
        $inc: { score: finalScore },
        level: newLevel,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Quiz evaluated successfully",
      score,
      attempts: updatedStats?.attempts,
      level: updatedStats?.level,
    });

  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}