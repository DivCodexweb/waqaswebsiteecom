import React from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";

export default async function BestSeller() {
  const allProducts = await db.select().from(products);
  const bestSellerProducts = allProducts.slice(0, 6);

  return (
    <section className="overflow-hidden py-10">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              This Month
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Best Sellers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {bestSellerProducts.map((item: any) => {
            // Safe and strict image parsing matching Product type
            let parsedImgs: { previews: string[]; thumbnails: string[] } = { previews: [], thumbnails: [] };
            try {
              if (item.imgs) {
                let data = typeof item.imgs === "string" ? JSON.parse(item.imgs) : item.imgs;
                if (Array.isArray(data)) {
                  parsedImgs = { previews: data, thumbnails: data };
                } else if (typeof data === "object" && data !== null) {
                  parsedImgs = {
                    previews: data.previews || data.thumbnails || Object.values(data) || [],
                    thumbnails: data.thumbnails || data.previews || Object.values(data) || [],
                  };
                }
              }
            } catch {
              parsedImgs = { previews: ["/images/placeholder.jpg"], thumbnails: ["/images/placeholder.jpg"] };
            }

            const formattedItem = { ...item, imgs: parsedImgs };

            return <SingleItem item={formattedItem} key={item.id} />;
          })}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}