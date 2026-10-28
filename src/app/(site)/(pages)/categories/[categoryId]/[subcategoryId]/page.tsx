import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductListing from "@/components/Shop/ProductListing";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ categoryId: string; subcategoryId: string }>;
};

export default async function SubcategoryProductsPage({ params }: PageProps) {
  const { categoryId, subcategoryId: subcategoryIdParam } = await params;
  const subcategoryId = Number(subcategoryIdParam);

  if (isNaN(subcategoryId)) {
    return notFound();
  }

  // Database se is subcategory ki sari products nikalain
  const rawProducts = await db
    .select()
    .from(products)
    .where(eq(products.subcategoryId, subcategoryId));

  return (
    <>
      <Breadcrumb
        title="Products"
        pages={["Home", "/", "Categories", `/categories/${categoryId}`, "Products"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {rawProducts.length > 0 ? (
            <ProductListing initialItems={rawProducts} />
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700">
                No products found in this subcategory.
              </h3>
            </div>
          )}
        </div>
      </section>
    </>
  );
}