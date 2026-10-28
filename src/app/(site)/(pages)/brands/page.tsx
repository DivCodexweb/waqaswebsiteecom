import { db } from "@/db";
import { brands, categories } from "@/db/schema";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BrandViewWrapper from "@/components/Shop/BrandViewWrapper";

export default async function BrandsPage() {
  const allbrandss = await db.select().from(brands);

  return (
    <>
      <Breadcrumb title={"Brands"} pages={["Home", "/", "Brands"]} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <BrandViewWrapper
            items={allbrandss}
            type="category"
            basePath="/brands"
          />
        </div>
      </section>
    </>
  );
}