import mongoose, { Schema, Document } from "mongoose";
import { QuizLevel } from "./Quiz";

export interface IUserStats extends Document {
  userId: string;
  score: number;
  level: QuizLevel;
  attempts: number;
}

const UserStatsSchema = new Schema<IUserStats>(
  {
    userId: { type: String, required: true, unique: true },
    score: { type: Number, default: 0 },
    level: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    attempts: { type: Number, default: 0 },
  }
);

export default mongoose.models.UserStats || mongoose.model<IUserStats>("UserStats", UserStatsSchema);