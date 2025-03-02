import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import User from "../../models/User";
import UserStats from "../../models/UserStats";
import { connectDB } from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    // Step 1: Find all users who don't have a userId and generate UUIDs for them
    const usersWithoutUserId = await User.find({ userId: { $exists: false } });

    if (usersWithoutUserId.length > 0) {
      const bulkUpdateOps = usersWithoutUserId.map(user => ({
        updateOne: {
          filter: { _id: user._id },
          update: { $set: { userId: uuidv4() } }
        }
      }));

      // Perform bulk update
      await User.bulkWrite(bulkUpdateOps);
    }

    // Step 2: Find all users who now have a userId
    const allUsers = await User.find({}, "userId");

    // Step 3: Check which users don't have a corresponding UserStats entry
    const existingUserStats = await UserStats.find({}, "userId");
    const existingUserStatsSet = new Set(existingUserStats.map(stat => stat.userId));

    const newUserStats = allUsers
      .filter(user => !existingUserStatsSet.has(user.userId))
      .map(user => ({
        userId: user.userId,
        score: 0,
        level: "easy",
        attempts: 0
      }));

    // Step 4: Insert missing UserStats in bulk
    if (newUserStats.length > 0) {
      await UserStats.insertMany(newUserStats);
    }

    return res.status(200).json({
      message: "Backfill complete",
      updatedUsers: usersWithoutUserId.length,
      createdStats: newUserStats.length,
    });
  } catch (error) {
    console.error("Backfill error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
