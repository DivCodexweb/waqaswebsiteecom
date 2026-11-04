import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { desc } from 'drizzle-orm'; // desc import karna zaroori hai

export async function GET() {
  try {
    // Database level par sorting (latest first) aur limit 8 lagadi
    const latestProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.id))
      .limit(8);

    return NextResponse.json({ success: true, data: latestProducts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}