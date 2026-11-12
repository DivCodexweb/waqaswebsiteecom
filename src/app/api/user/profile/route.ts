import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Database se real user data fetch karein
    const userRecord = await db.select().from(users).where(eq(users.email, token.email as string));

    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: userRecord[0] }, { status: 200 });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}