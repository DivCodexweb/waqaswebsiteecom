import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductListing from "@/components/Shop/ProductListing";

export default async function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js asynchronous params handling
  const resolvedParams = await params;
  const brandId = Number(resolvedParams?.id);

  if (!brandId || isNaN(brandId)) {
    return (
      <div className="text-center py-20 text-xl font-bold text-red-500">
        Invalid Brand ID!
      </div>
    );
  }

  // Specific brand ko find karna
  const brandList = await db.select().from(brands).where(eq(brands.id, brandId));
  const brand: any = brandList[0];

  if (!brand) {
    return (
      <div className="text-center py-20 text-xl font-bold text-red-500">
        Brand not found!
      </div>
    );
  }

  // Us brand ke saare products fetch karna
  const brandProducts = await db.select().from(products).where(eq(products.brandId, brandId));

  return (
    <>
      <Breadcrumb title={brand.title || "Brand Details"} pages={["Home", "/", "Brands", "/", brand.title || "Details"]} />
      
      <section className="overflow-hidden py-15 lg:py-20 bg-gray-50">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          
          {/* Brand Header / Info */}
          <div className="bg-white p-8 rounded-2xl shadow-sm mb-10 flex flex-col sm:flex-row items-center gap-6">
            {(brand.img || brand.imgs) ? (
              <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border">
                <img src={brand.img || brand.imgs} alt={brand.title} className="object-contain w-full h-full p-2" />
              </div>
            ) : null}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{brand.title}</h1>
              <p className="text-gray-500 mt-2 text-sm">
                Explore all products available under {brand.title}.
              </p>
            </div>
          </div>

          {/* Products List with Search, Grid/List view & Pagination */}
          <h2 className="text-xl font-bold text-dark mb-6">Products by {brand.title}</h2>
          
          {brandProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No products found under this brand yet.</p>
            </div>
          ) : (
            <ProductListing initialItems={brandProducts} />
          )}

        </div>
      </section>
    </>
  );
}