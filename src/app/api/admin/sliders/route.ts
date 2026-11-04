import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/db'; // Apne db instance ka path adjust kar lein
import { sliders } from '@/db/schema'; // Apne schema ka path adjust kar lein
import { eq } from 'drizzle-orm';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch all sliders
export async function GET() {
  try {
    const data = await db.select().from(sliders);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch sliders' }, { status: 500 });
  }
}

// POST: Upload image to Cloudinary & Save link/img in DB
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const link = formData.get('link') as string;

    if (!file || !link) {
      return NextResponse.json({ success: false, message: 'File and Link are required' }, { status: 400 });
    }

    // Convert File buffer to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'hero_sliders',
    });

    // Save to SQLite via Drizzle ORM
    const [inserted] = await db
      .insert(sliders)
      .values({
        img: uploadResponse.secure_url,
        link: link,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}

// DELETE: Delete slider from DB
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    await db.delete(sliders).where(eq(sliders.id, Number(id)));

    return NextResponse.json({ success: true, message: 'Slider deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete slider' }, { status: 500 });
  }
}