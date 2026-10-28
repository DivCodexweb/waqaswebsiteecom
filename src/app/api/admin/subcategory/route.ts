import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/db';
import { subcategories, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to handle Cloudinary stream uploads
const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'subcategories' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
};

// GET: All Subcategories with Category Title
export async function GET() {
  try {
    const list = await db
      .select({
        id: subcategories.id,
        title: subcategories.title,
        img: subcategories.img,
        categoryId: subcategories.categoryId,
        categoryTitle: categories.title,
      })
      .from(subcategories)
      .leftJoin(categories, eq(subcategories.categoryId, categories.id));

    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Upload Image to Cloudinary & Save Subcategory
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const file = formData.get('image') as File;

    if (!title || !categoryId || !file) {
      return NextResponse.json(
        { error: 'Title, Category, and Image are required' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await uploadToCloudinary(buffer);

    const inserted = await db
      .insert(subcategories)
      .values({
        title,
        img: uploadResult.secure_url,
        categoryId: parseInt(categoryId),
      })
      .returning();

    return NextResponse.json(
      { message: 'Subcategory created successfully', data: inserted[0] },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update Subcategory (Title, Category ID, and optional New Image)
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const file = formData.get('image') as File | null;

    if (!id || !title || !categoryId) {
      return NextResponse.json(
        { error: 'ID, Title, and Category are required' },
        { status: 400 }
      );
    }

    const subcategoryNumId = parseInt(id);

    // Prepare update data object
    const updateData: { title: string; categoryId: number; img?: string } = {
      title,
      categoryId: parseInt(categoryId),
    };

    // Agar new image file select ki gayi hai to Cloudinary par upload karein
    if (file && typeof file === 'object' && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer);
      updateData.img = uploadResult.secure_url;
    }

    const updated = await db
      .update(subcategories)
      .set(updateData)
      .where(eq(subcategories.id, subcategoryNumId))
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Subcategory updated successfully',
      data: updated[0],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete Subcategory by ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subcategory ID is required' },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(subcategories)
      .where(eq(subcategories.id, parseInt(id)))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Subcategory deleted successfully',
      data: deleted[0],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}