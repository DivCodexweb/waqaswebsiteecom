import { NextResponse } from 'next/server';
import { db } from '@/db'; // Apne db path ke mutabiq adjust karein
import { sociallink } from '@/db/schema'; // Apne schema path ke mutabiq adjust karein
import { eq } from 'drizzle-orm';

// GET: Sabhi social links fetch karein
export async function GET() {
  try {
    const links = await db.select().from(sociallink);
    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch social links' }, { status: 500 });
  }
}

// POST: Naya link add karein ya existing update karein
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, link } = body;

    if (!title || !link) {
      return NextResponse.json({ success: false, message: 'Title and link are required!' }, { status: 400 });
    }

    if (id) {
      // UPDATE Link
      await db.update(sociallink)
        .set({ title, link })
        .where(eq(sociallink.id, Number(id)));

      return NextResponse.json({ success: true, message: 'Social link updated successfully!' });
    } else {
      // INSERT New Link
      await db.insert(sociallink).values({
        title,
        link,
      });

      return NextResponse.json({ success: true, message: 'Social link added successfully!' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Operation failed' }, { status: 500 });
  }
}

// DELETE: Social link delete karein
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    await db.delete(sociallink).where(eq(sociallink.id, Number(id)));

    return NextResponse.json({ success: true, message: 'Social link deleted successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 });
  }
}