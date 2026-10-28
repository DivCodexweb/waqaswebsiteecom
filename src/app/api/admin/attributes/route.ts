import { NextResponse } from 'next/server';
import { db } from '@/db';
import { attributes } from '@/db/schema';

// Fetch all attributes
export async function GET() {
  try {
    const data = await db.select().from(attributes);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attributes' }, { status: 500 });
  }
}

// Create new attribute
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, list } = body;

    if (!title || !list) {
      return NextResponse.json({ error: 'Title and list are required' }, { status: 400 });
    }

    // Convert array/list or string into string for DB
    const listString = Array.isArray(list) ? JSON.stringify(list) : list;

    const newAttr = await db
      .insert(attributes)
      .values({ title, list: listString })
      .returning();

    return NextResponse.json(newAttr[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create attribute' }, { status: 500 });
  }
}