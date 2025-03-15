import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as IUser;

    return res.status(200).json({
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
