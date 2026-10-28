import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subcategories } from "@/db/schema";
import Breadcrumb from "@/components/Common/Breadcrumb";
import CategoryViewWrapper from "@/components/Shop/CategoryViewWrapper";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function SubcategoriesPage({ params }: PageProps) {
  const { categoryId: categoryIdParam } = await params;
  const categoryId = Number(categoryIdParam);

  if (isNaN(categoryId)) {
    return notFound();
  }

  const subCats = await db
    .select()
    .from(subcategories)
    .where(eq(subcategories.categoryId, categoryId));

  return (
    <>
      <Breadcrumb title={"Subcategories"} pages={["Categories", "/categories", "Subcategories"]} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <CategoryViewWrapper
            items={subCats}
            type="subcategory"
            basePath={`/categories/${categoryId}`}
          />
        </div>
      </section>
    </>
  );
}