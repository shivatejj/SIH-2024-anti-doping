import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, email, password, role } = req.body;

  await connectDB();
  const existingUser = await User.findOne({ email });

  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role: role || "user", });

  await newUser.save();
  return res.status(201).json({ message: "User registered successfully", user: newUser });
}