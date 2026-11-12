import { NextResponse } from "next/server";
import { db } from "@/db"; // Apne project ke mutabiq db import path check kar lein
import { orders, orderItems } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerDetails, items, totalAmount, createdAt } = body;

    if (!customerDetails || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order data or empty cart" },
        { status: 400 }
      );
    }

    // 1. Order insert karein
    const newOrderResult = await db.insert(orders).values({
      firstName: customerDetails.firstName,
      lastName: customerDetails.lastName,
      companyName: customerDetails.companyName || "",
      country: customerDetails.country,
      address: customerDetails.address,
      addressTwo: customerDetails.addressTwo || "",
      town: customerDetails.town,
      phone: customerDetails.phone,
      email: customerDetails.email,
      notes: customerDetails.notes || "",
      totalAmount: Number(totalAmount),
      status: "pending",
      createdAt: createdAt || new Date().toISOString(),
    });

    const insertedOrderId = Number(newOrderResult.lastInsertRowid);

    // 2. Order items insert karein (Attributes aur Image ke sath)
    for (const item of items) {
      // Image resolve karne ka logic (agar string hai ya object)
      let imageUrl = "";
      if (typeof item.imgs === "string") {
        imageUrl = item.imgs;
      } else if (typeof item.imgs === "object" && item.imgs !== null) {
        imageUrl = item.imgs.previews?.[0] || item.imgs.thumbnails?.[0] || item.imgs[0] || "";
      }

      await db.insert(orderItems).values({
        orderId: insertedOrderId,
        productId: Number(item.id),
        title: item.title,
        price: Number(item.discountedPrice || item.price),
        quantity: Number(item.quantity),
        image: imageUrl,
        // Selected attributes ko JSON string mein convert karke save kar rahe hain
        selectedAttributes: item.selectedAttributes 
          ? JSON.stringify(item.selectedAttributes) 
          : null,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully!",
        orderId: insertedOrderId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}