import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 1. User ke sare orders fetch karein
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.email, token.email as string));

    // 2. Har order ke mukablay uske items fetch karke order object ke andar 'items' array mein lagayein
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items: items || [], // Har order ke sath uske items attach ho jayenge
        };
      })
    );

    return NextResponse.json({ success: true, orders: ordersWithItems }, { status: 200 });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}