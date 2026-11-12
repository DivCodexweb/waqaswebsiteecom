import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs"; // Make sure bcryptjs is used (or bcrypt)

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, name, phone, oldPassword, newPassword } = body;

    // 1. Update Profile Details (Name & Phone)
    if (action === "updateProfile") {
      await db.update(users)
        .set({ 
          name: name || "", 
          phone: phone || null 
        })
        .where(eq(users.email, token.email as string));

      return NextResponse.json({ success: true, message: "Profile updated successfully!" });
    }

    // 2. Change Password
    if (action === "changePassword") {
      if (!oldPassword || !newPassword) {
        return NextResponse.json({ success: false, message: "All password fields are required" }, { status: 400 });
      }

      // User find karein
      const userRecord = await db.select().from(users).where(eq(users.email, token.email as string));
      if (!userRecord || userRecord.length === 0) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }

      const currentUser = userRecord[0];

      // Old password verify karein
      const isMatch = await bcrypt.compare(oldPassword, currentUser.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: "Incorrect old password" }, { status: 400 });
      }

      // New password hash karein
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.email, token.email as string));

      return NextResponse.json({ success: true, message: "Password changed successfully!" });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}