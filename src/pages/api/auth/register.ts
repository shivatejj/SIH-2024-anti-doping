import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import UserStats from "@/models/UserStats";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, email, password, role } = req.body;

  await connectDB();
  const existingUser = await User.findOne({ email });

  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (newUser) {
    await UserStats.create({
      userId: newUser.userId,
      score: 0,
      level: "easy",
      attempts: 0,
    });
  }
  return res.status(201).json({ message: "User registered successfully", user: newUser });
}