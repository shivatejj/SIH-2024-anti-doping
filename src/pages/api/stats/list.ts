import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { isAuthenticated } from "@/middleware/auth";
import UserStats from "@/models/UserStats";
import User from "@/models/User";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { category } = req.query;
    await connectDB();
    const user = isAuthenticated(req);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!category) return res.status(400).json({ message: 'Category is required' });

    const userStat = await UserStats.find({ category })
      .sort({
        score: -1,
        attempts: 1,
        updatedAt: 1,
      })
      .limit(10);

    if (!userStat) return res.status(404).json({ message: `No stats found for ${category} category` });

    const result = await Promise.all(
      userStat.map(async (stat: { userId: string; score: number }) => {
        const userData = await User.findOne({ userId: stat.userId });
        return {
          userName: userData?.name,
          score: stat.score,
        };
      })
    );

    return res.status(200).json({ result });

  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
