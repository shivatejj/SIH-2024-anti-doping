import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz from "@/models/Quiz";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { quizId, answers } = req.body;

  try {
    await connectDB();

    const user = isAuthenticated(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
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

    let newLevel = user.level;
    let finalScore = 0;

    if (score >= 3) {
      if (user.level === "easy") newLevel = "medium";
      else if (user.level === "medium") newLevel = "hard";
      finalScore = score;
    }

    const updatedStats = await User.findOneAndUpdate(
      { userId: user.userId },
      {
        $inc: { finalScore, attempts: 1 },
        level: newLevel,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Quiz evaluated successfully",
      score,
      attempts: updatedStats?.attempts || 0,
      level: updatedStats?.level || "easy",
    });

  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}