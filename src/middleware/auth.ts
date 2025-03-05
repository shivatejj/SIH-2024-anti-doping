import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const isAuthenticated = (req: NextApiRequest) => {
  let token: string | undefined;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new Error("Unauthorized");

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string, level: "easy" | "medium" | "hard" };
  } catch (error) {
    console.error(error)
    throw { status: 403, message: "Invalid token" };
  }
};

export const isAdmin = (req: NextApiRequest) => {
  const user = isAuthenticated(req);
  if (typeof user === "object" && user.role !== "admin") throw { status: 403, message: "Access Denied" };

  return user;
};
