import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { isAuthenticated } from "@/middleware/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await connectDB();

  try {
    const user = isAuthenticated(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Fetch all users with proper date conversion
    const logs = await Activity.find()
      .sort({ loginTime: -1 })
      .lean()
      .select("name email loginTime");

    // ✅ Convert loginTime to proper Date object before sending response
    const formattedLogs = logs.map(log => ({
      ...log,
      loginTime: log.loginTime ? new Date(log.loginTime).toISOString() : null,
    }));

    return res.status(200).json({ success: true, data: formattedLogs });
  } catch (error) {
    console.error("Error fetching user logs:", error);
    return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
  }
}
