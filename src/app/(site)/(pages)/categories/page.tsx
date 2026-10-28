import { db } from "@/db";
import { categories } from "@/db/schema";
import Breadcrumb from "@/components/Common/Breadcrumb";
import CategoryViewWrapper from "@/components/Shop/CategoryViewWrapper";

export default async function CategoriesPage() {
  const allCategories = await db.select().from(categories);

  return (
    <>
      <Breadcrumb title={"Categories"} pages={["Home", "/", "Categories"]} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <CategoryViewWrapper
            items={allCategories}
            type="category"
            basePath="/categories"
          />
        </div>
      </section>
    </>
  );
}