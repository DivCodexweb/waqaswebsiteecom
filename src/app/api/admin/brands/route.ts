import { NextResponse } from 'next/server';
import { db } from '@/db'; // Apna drizzle db instance import karein
import { brands } from '@/db/schema'; // Schema import karein

// Fetch all brands
export async function GET() {
  try {
    const data = await db.select().from(brands);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

// Create new brand
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, img } = body;

    if (!title || !img) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const newBrand = await db.insert(brands).values({ title, img }).returning();
    return NextResponse.json(newBrand[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}