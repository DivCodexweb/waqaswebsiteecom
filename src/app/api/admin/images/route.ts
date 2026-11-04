import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/db'; // Apne db path ke mutabiq adjust karein
import { images } from '@/db/schema'; // Apne schema path ke mutabiq adjust karein
import { eq } from 'drizzle-orm';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch all saved images/banners
export async function GET() {
  try {
    const data = await db.select().from(images);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST: Upload image to Cloudinary and insert record into DB
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const link = formData.get('link') as string;
    const locationid = formData.get('locationid') as string;

    if (!file || !link || !locationid) {
      return NextResponse.json({ success: false, message: 'All fields (file, link, locationid) are required' }, { status: 400 });
    }

    // Convert file to base64 buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary under folder "banners"
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'site_banners',
    });

    // Insert into SQLite
    const [inserted] = await db
      .insert(images)
      .values({
        locationid,
        link,
        img: uploadResponse.secure_url,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}

// DELETE: Remove item by ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    await db.delete(images).where(eq(images.id, Number(id)));

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 });
  }
}