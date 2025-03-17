import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz, { QuizLevelEnum } from "@/models/Quiz";
import UserStats from "@/models/UserStats";
import mongoose from "mongoose";
import Exam, { StatusEnum } from "@/models/Exam";

const scoreBasedMessage = (score: number): string => {
  switch (score) {
    case 0:
      return "It looks like you struggled with this exam. Don't be discouraged! Start by reviewing the basics, seeking guidance, and practicing regularly. Small steps will lead to improvement—keep going!";
    case 1:
      return "You need significant improvement. Focus on understanding the concepts, practicing regularly, and reviewing your mistakes carefully. Don't hesitate to ask for help!";
    case 2:
      return "You have some understanding, but there's a lot of room for improvement. Try to revisit key topics, work on weaker areas, and practice more to build confidence.";
    case 3:
      return "You're on the right track but need to strengthen your understanding. Keep practicing, focus on accuracy, and aim for more consistent performance";
    case 4:
      return "Well done! You have a strong grasp of the material. A little more effort in refining your skills and avoiding small mistakes will take you to the next level.";
    default:
      return "Outstanding performance! Keep up the great work, maintain your consistency, and continue challenging yourself to achieve even greater success!";
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { quizId, answers, category, isAutoSubmitted } = req.body;

  try {
    await connectDB();

    const user = isAuthenticated(req);
    const userStat = await UserStats.findOne({ userId: user.userId, category });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!userStat) {
      return res
        .status(403)
        .json({ message: `Not registered for ${category} category yet` });
    } else if (userStat && userStat.level === QuizLevelEnum.COMPLETED) {
      return res
        .status(403)
        .json({ message: `Course with ${category} category is completed` });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz)
      return res.status(404).json({ message: "Quiz with given ID not found" });

    const correctAnswersMap = new Map(
      quiz.questions.map((q: { _id: string; answer: string }) => [
        q._id.toString(),
        q.answer,
      ])
    );

    let score = 0;
    answers.forEach(
      ({
        questionId,
        selectedOption,
      }: {
        questionId: string;
        selectedOption: string;
      }) => {
        if (correctAnswersMap.get(questionId) === selectedOption) {
          score++;
        }
      }
    );

    let newLevel = userStat.level;
    let finalScore = 0;

    if (score >= 3) {
      if (userStat.level === QuizLevelEnum.EASY)
        newLevel = QuizLevelEnum.MEDIUM;
      else if (userStat.level === QuizLevelEnum.MEDIUM)
        newLevel = QuizLevelEnum.HARD;
      else newLevel = QuizLevelEnum.COMPLETED;
      finalScore = score;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedStats = await UserStats.findOneAndUpdate(
        { userId: user.userId, category },
        {
          $inc: { score: finalScore },
          level: newLevel,
        },
        { new: true, session }
      );

      const updatedExam = await Exam.findOneAndUpdate(
        { userId: user.userId, category, status: StatusEnum.IN_PROGRESS },
        { status: StatusEnum.COMPLETED },
        { new: true, session }
      );

      if (!updatedExam)
        return res
          .status(400)
          .json({ message: "There is no exam in-progress for submission." });

      if (!updatedStats)
        return res
          .status(403)
          .json({ message: `Not registered for ${category} category yet` });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message:
          updatedStats?.level === QuizLevelEnum.COMPLETED && score >= 3
            ? "Congratulations! You have successfully completed all levels of the exam. You've mastered the challenge and reached the top! Keep pushing your limits, and try other sports as well!"
            : scoreBasedMessage(score),
        score,
        attempts: updatedStats?.attempts,
        level: updatedStats?.level,
        isCleared: score >= 3,
        isCategoryCompleted:
          score >= 3 && updatedStats?.level === QuizLevelEnum.COMPLETED,
        isAutoSubmitted,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as { message: string; status?: number };
        return res.status(err.status || 500).json({ message: err.message });
      }

      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
