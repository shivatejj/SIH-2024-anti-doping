import mongoose, { Schema, Document } from "mongoose";
import { QuizLevel } from "./Quiz";

export interface IUserStats extends Document {
  userId: string;
  category: string;
  score: number;
  level: QuizLevel;
  attempts: number;
}

const UserStatsSchema = new Schema<IUserStats>(
  {
    userId: { type: String, required: true },
    category: { type: String, required: true },
    score: { type: Number, default: 0 },
    level: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    attempts: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.models.UserStats || mongoose.model<IUserStats>("UserStats", UserStatsSchema);