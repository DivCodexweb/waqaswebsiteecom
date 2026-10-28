import { NextResponse } from 'next/server';
import { db } from '@/db'; // Aap ki db config file ka path
import { products } from '@/db/schema'; // Aap ki schema file ka path
import { eq } from 'drizzle-orm';

// GET: Sab products fetch karne ke liye
export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json({ success: true, data: allProducts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST: Naya product add karne ke liye (CategoriesId ke sath)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newProduct = await db.insert(products).values({
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
      attributesList: body.attributesList || null, // JSON string
      imgs: body.imgs || null, // JSON string
      
      // Yahan categoriesId aur subcategoryId dono handle kar liye hain
      categoriesId: body.categoriesId ? parseInt(body.categoriesId) : null,
      subcategoryId: body.subcategoryId ? parseInt(body.subcategoryId) : null,
      
      metaTags: body.metaTags || null,
      metaDescription: body.metaDescription || null,
    }).returning();

    return NextResponse.json({ success: true, data: newProduct[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding product:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to add product' }, { status: 500 });
  }
}