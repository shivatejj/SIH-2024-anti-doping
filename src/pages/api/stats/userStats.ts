import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import UserStats from "@/models/UserStats";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const { category } = req.query;
    await connectDB();
    const user = isAuthenticated(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const searchQuery: Record<string, string> = { userId: user.userId };

    if (category) searchQuery.category = category as string;
    const userStat = await UserStats.find(searchQuery);

    if (!userStat) {
      return res.status(404).json({ message: "No stats found" });
    }

    return res.status(200).json({ userStat });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
