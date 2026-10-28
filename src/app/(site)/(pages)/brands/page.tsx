import { db } from "@/db";
import { brands } from "@/db/schema";
import { sql } from "drizzle-orm";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BrandViewWrapper from "@/components/Shop/BrandViewWrapper";
import Link from "next/link";

interface BrandsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === "string" ? Number(resolvedParams.page) || 1 : 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  // 1. Total brands count for pagination
  const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(brands);
  const totalItems = Number(totalCountResult[0]?.count) || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // 2. Fetch paginated brands (20 per page)
  const paginatedBrands = await db
    .select()
    .from(brands)
    .limit(pageSize)
    .offset(offset);

  return (
    <>
      <Breadcrumb title={"Brands"} pages={["Home", "/", "Brands"]} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <BrandViewWrapper
            items={paginatedBrands}
            type="category"
            basePath="/brands"
          />

          {/* Pagination Buttons (20 items ke baad pages) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/brands?page=${p}`}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer ${
                    p === page
                      ? "bg-blue text-white"
                      : "bg-white text-dark border border-gray-3 hover:bg-gray-1"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}