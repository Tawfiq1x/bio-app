import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";  // তোমার authOptions যেখানেই থাকুক ঠিক মত ইমপোর্ট করবে

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // এখানে তোমার analytics data ফেচ করার লজিক দিবে
  const analyticsData = {
    totalUsers: 100,
    activeUsers: 80,
    // ... আরও ডাটা এখানে
  };

  return NextResponse.json({ analytics: analyticsData });
}
