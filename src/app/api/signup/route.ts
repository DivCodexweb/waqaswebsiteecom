import { NextResponse } from "next/server";
import { db } from "@/db"; // Apna Drizzle DB instance import karein
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Duplicate Check (Email or Phone)
    const existingUser = await db
      .select()
      .from(users)
      .where(
        phone
          ? or(eq(users.email, email.toLowerCase()), eq(users.phone, phone))
          : eq(users.email, email.toLowerCase())
      )
      .get();

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or phone already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if registering email is admin@store.com
    const role = email.toLowerCase() === "admin@store.com" ? "admin" : "user";

    await db.insert(users).values({
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}