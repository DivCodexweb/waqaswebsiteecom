import { NextResponse } from 'next/server';
import { db } from '@/db'; // Apne db path ke mutabiq adjust karein
import { feedbacks } from '@/db/schema'; // Apne schema path ke mutabiq adjust karein
import { eq } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Sabhi feedbacks fetch karein
export async function GET() {
  try {
    const allFeedbacks = await db.select().from(feedbacks);
    return NextResponse.json({ success: true, data: allFeedbacks });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}

// POST: Naya feedback add karein ya existing update karein
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get('id'); // Agar ID hogi toh update hoga
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File | null;

    if (!name || !description) {
      return NextResponse.json({ success: false, message: 'Name and description are required!' }, { status: 400 });
    }

    let imageUrl = formData.get('existingImg') as string || '';

    // Agar nayi file upload ki gai hai
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'feedbacks' }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        }).end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    if (!imageUrl) {
      return NextResponse.json({ success: false, message: 'Image is required!' }, { status: 400 });
    }

    if (id) {
      // UPDATE Feedback
      await db.update(feedbacks)
        .set({ name, description, img: imageUrl })
        .where(eq(feedbacks.id, Number(id)));

      return NextResponse.json({ success: true, message: 'Feedback updated successfully!' });
    } else {
      // INSERT New Feedback
      await db.insert(feedbacks).values({
        name,
        description,
        img: imageUrl,
      });

      return NextResponse.json({ success: true, message: 'Feedback added successfully!' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Operation failed' }, { status: 500 });
  }
}

// DELETE: Feedback delete karein
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    await db.delete(feedbacks).where(eq(feedbacks.id, Number(id)));

    return NextResponse.json({ success: true, message: 'Feedback deleted successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 });
  }
}