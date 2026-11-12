import { NextResponse } from "next/server";
import { db } from "@/db"; 
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // 'id' ya 'phone'
    const value = searchParams.get("value"); // search term

    if (!type || !value) {
      return NextResponse.json(
        { success: false, message: "Search type and value are required" },
        { status: 400 }
      );
    }

    // Explicitly typing foundOrders using typeof orders.$inferSelect[]
    let foundOrders: (typeof orders.$inferSelect)[] = [];

    if (type === "id") {
      const orderIdNum = Number(value);
      if (isNaN(orderIdNum)) {
        return NextResponse.json(
          { success: false, message: "Invalid Order ID format" },
          { status: 400 }
        );
      }
      foundOrders = await db.select().from(orders).where(eq(orders.id, orderIdNum));
    } else if (type === "phone") {
      foundOrders = await db.select().from(orders).where(eq(orders.phone, value));
    }

    if (!foundOrders || foundOrders.length === 0) {
      return NextResponse.json(
        { success: false, message: "No order found matching your details." },
        { status: 404 }
      );
    }

    const targetOrder = foundOrders[0];

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, targetOrder.id));

    return NextResponse.json(
      {
        success: true,
        order: {
          ...targetOrder,
          items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}