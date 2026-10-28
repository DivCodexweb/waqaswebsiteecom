import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/db'; // Aap ka Drizzle DB instance
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper Function: Buffer se Cloudinary upload
const uploadToCloudinary = (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'categories' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || '');
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// 1. CREATE Category (POST)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const imageFile = formData.get('image') as File;

    if (!title || !imageFile) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageUrl = await uploadToCloudinary(buffer);

    const [newCategory] = await db.insert(categories).values({
      title,
      img: imageUrl,
    }).returning();

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. UPDATE Category (PUT)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get('id'));
    const title = formData.get('title') as string;
    const imageFile = formData.get('image') as File | null;

    if (!id || !title) {
      return NextResponse.json({ error: 'ID and title are required' }, { status: 400 });
    }

    let updateData: { title: string; img?: string } = { title };

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      updateData.img = await uploadToCloudinary(buffer);
    }

    const [updatedCategory] = await db.update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. DELETE Category (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await db.delete(categories).where(eq(categories.id, id));

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// 4. GET Categories (Fetch All or Single)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Agar single category chahiye by ID: /api/admin/category?id=1
    if (id) {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, Number(id)));

      if (!category.length) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: category[0] });
    }

    // Direct all categories fetch karne ke liye: /api/admin/category
    const allCategories = await db.select().from(categories);

    return NextResponse.json({ success: true, data: allCategories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
