import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import Quiz from "@/models/Quiz";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const user = isAuthenticated(req);
    if (!user) res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin") res.status(403).json({ message: "Forbidden: Admins only" });

    await connectDB();
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (req.method === 'PATCH') {
      const { content, addQuestions, updateQuestions } = req.body;

      if (!content && !addQuestions && !updateQuestions) return res.status(400).json({ message: "Nothing to update" });

      let updatedQuiz;

      if (content) {
        updatedQuiz = await Quiz.findByIdAndUpdate(
          id,
          { content },
          { new: true, runValidators: true }
        );
      }

      if (addQuestions) {
        updatedQuiz = await Quiz.findByIdAndUpdate(
          id,
          { $push: { questions: { $each: addQuestions } } },
          { new: true, runValidators: true }
        );
      }

      if (updateQuestions) {
        const { questionId, text, options } = updateQuestions;

        updatedQuiz = await Quiz.findOneAndUpdate(
          { _id: id, "questions._id": questionId },
          {
            $set: {
              "questions.$.text": text,
              "questions.$.options": options,
            },
          },
          { new: true, runValidators: true }
        );
      }

      if (!updatedQuiz) res.status(404).json({ message: "Quiz or question not found" });

      return res.status(200).json({ message: "Quiz updated successfully", quiz: updatedQuiz });
    } else if (req.method === 'DELETE') {
      await Quiz.findByIdAndDelete(id);
      return res.status(200).json({ message: "Quiz deleted successfully" });
    }
    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }

}