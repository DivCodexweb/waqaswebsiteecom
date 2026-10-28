import { NextResponse } from 'next/server';
import { db } from '@/db';
import { attributes } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Update attribute
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    
    const body = await req.json();
    const { title, list } = body;

    const listString = Array.isArray(list) ? JSON.stringify(list) : list;

    const updated = await db
      .update(attributes)
      .set({ title, list: listString })
      .where(eq(attributes.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update attribute' }, { status: 500 });
  }
}

// Delete attribute
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    
    await db.delete(attributes).where(eq(attributes.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete attribute' }, { status: 500 });
  }
}