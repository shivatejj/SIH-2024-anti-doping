import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type UserRole = "user" | "admin";

export enum UserRoleEnum {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("Users", UserSchema);
