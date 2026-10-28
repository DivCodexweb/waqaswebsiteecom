import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Update brand
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params; // <-- Yahan await karna zaroori hai
    const id = parseInt(rawId);
    
    const body = await req.json();
    const { title, img } = body;

    const updated = await db
      .update(brands)
      .set({ title, img })
      .where(eq(brands.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

// Delete brand
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params; // <-- Yahan bhi await karein
    const id = parseInt(rawId);
    
    await db.delete(brands).where(eq(brands.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}