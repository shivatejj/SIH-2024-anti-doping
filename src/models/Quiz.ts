import mongoose, { Schema, Document } from "mongoose";

export interface IQuestions {
  question: string;
  options: string[];
  answer: string;
}

export type QuizLevel = "easy" | "medium" | "hard";

export enum QuizLevelEnum {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  COMPLETED = "completed"
}

export interface IQuiz extends Document {
  category: string;
  content: string;
  questions: IQuestions[];
  level: QuizLevel;
}

const QuestionSchema = new Schema<IQuestions>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

const QuizSchema = new Schema<IQuiz>(
  {
    category: { type: String, required: true },
    content: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    level: { type: String, enum: ["easy", "medium", "hard"], required: true },
  }
);

export default mongoose.models.Quiz || mongoose.model<IQuiz>("quiz", QuizSchema);
