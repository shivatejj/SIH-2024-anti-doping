import mongoose, { Document, Schema } from "mongoose";
import { IQuestions, QuizLevel } from "./Quiz";

export type StatusType = 'in-progress' | 'complete';

export enum StatusEnum {
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'complete',
}

export interface IExam extends Document {
  userId: string;
  category: string;
  content: string;
  questions: Omit<IQuestions, 'answer'>[];
  level: QuizLevel;
  status: StatusType;
}

const QuestionSchema = new Schema<IQuestions>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
});

const ExamSchema = new Schema<IExam>({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
  level: { type: String, enum: ["easy", "medium", "hard"], required: true },
  status: { type: String, enum: ['in-progress', 'completed'], required: true, default: 'in-progress' },
});

export default mongoose.models.Exam || mongoose.model<IExam>("exam", ExamSchema);