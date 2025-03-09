import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import User from "../../../models/User";
import { connectDB } from "../../../lib/mongodb";
import Activity from "@/models/Activity";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  await connectDB();

  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    {
      userId: user.userId,
      role: user.role,
      name: user.name,
      email: user.email,
      level: user.level
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400,
      path: "/",
    })
  );

  await Activity.create({ name: user.name, email: user.email, loginTime: new Date() });

  res.status(200).json({
    message: "Login successful",
    userId: user.userId,
    role: user.role,
    name: user.name,
    email: user.email,
    level: user.level,
    score: user.score,
    attempts: user.attempts,
    token
  });
}