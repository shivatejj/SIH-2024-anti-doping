import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export const authenticateJWT = (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string; email: string; role: string };
    return decoded;
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: "Invalid token" });
  }
};
