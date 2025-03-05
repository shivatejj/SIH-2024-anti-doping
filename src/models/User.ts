import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  score: number;
  attempts: number;
  level: "easy" | "medium" | "hard";
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    score: { type: Number, required: true, default: 0 },
    attempts: { type: Number, required: true, default: 0 },
    level: { type: String, required: true, default: "easy" }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("Users", UserSchema);
