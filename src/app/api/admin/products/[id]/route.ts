import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

// PUT: Product update karne ke liye
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js requirement: await params
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
    }

    const body = await request.json();

    const updatedProduct = await db.update(products)
      .set({
        title: body.title,
        description: body.description,
        price: parseFloat(body.price) || 0,
        discountedPrice: parseFloat(body.discountedPrice) || 0,
        discountType: body.discountType || 'percent',
        discountExpiry: body.discountExpiry || null,
        purchasePrice: parseFloat(body.purchasePrice) || 0,
        stock: parseInt(body.stock) || 0,
        minPurchaseQty: parseInt(body.minPurchaseQty) || 1,
        sku: body.sku || null,
        brandId: body.brandId ? parseInt(body.brandId) : null,
        brandName: body.brandName || null,
        isRefundable: body.isRefundable || 'yes',
        videoLink: body.videoLink || null,
        attributesList: body.attributesList || null,
        imgs: body.imgs || null,
        subcategoryId: body.subcategoryId ? parseInt(body.subcategoryId) : null,
        metaTags: body.metaTags || null,
        metaDescription: body.metaDescription || null,
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedProduct[0] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

// DELETE: Product delete karne ke liye
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET: Single product fetch karne ke liye
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
    }

    const product = await db.select().from(products).where(eq(products.id, id));

    if (!product || product.length === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}