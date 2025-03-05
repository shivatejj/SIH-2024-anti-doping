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

    // Get user session
    const user = isAuthenticated(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    // Pagination (default page = 1, limit = 10)
    const { page = "1", limit = "10" } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Fetch logs
    const logs = await Activity.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize);
    const totalLogs = await Activity.countDocuments();

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total: totalLogs,
        page: pageNumber,
        pages: Math.ceil(totalLogs / pageSize),
      },
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
