import React from "react";
import Image from "next/image";
import { db } from "@/db"; 
import { images } from "@/db/schema"; 
import { or, eq } from "drizzle-orm";

const PromoBanner = async () => {
  // Database se banners fetch karein
  const promoImagesData = await db
    .select()
    .from(images)
    .where(
      or(
        eq(images.locationid, 'promotionbanner'), 
        eq(images.locationid, 'pro1'), 
        eq(images.locationid, 'pro2')
      )
    );

  const promotionbanner = promoImagesData.find((item) => item.locationid === 'promotionbanner');
  const pro1 = promoImagesData.find((item) => item.locationid === 'pro1');
  const pro2 = promoImagesData.find((item) => item.locationid === 'pro2');

  return (
    <section className="overflow-hidden py-10 lg:py-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* Upar Wala Bada Promo Banner (Width: 757px | Height: 520px ratio) */}
        <div className="w-full relative rounded-lg overflow-hidden bg-white shadow-sm mb-7.5">
          <a 
  href={promotionbanner?.link || "#"} 
  className="block relative w-full h-[280px] sm:h-[420px] lg:h-[500px]"
>
            <Image
              src={promotionbanner?.img || "/images/promo/promo-01.png"}
              alt="promotion banner big"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </a>
        </div>

        {/* Niche Wale 2 Small Banners (600x300 / 2:1 Ratio) */}
        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          
          {/* Promo 1 Box */}
          <div className="w-full relative rounded-lg overflow-hidden bg-white shadow-sm">
            <a 
              href={pro1?.link || "#"} 
              className="block relative w-full h-[180px] sm:h-[240px] lg:h-[280px]"
            >
              <Image
                src={pro1?.img || "/images/promo/promo-02.png"}
                alt="promo banner 1"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Promo 2 Box */}
          <div className="w-full relative rounded-lg overflow-hidden bg-white shadow-sm">
            <a 
              href={pro2?.link || "#"} 
              className="block relative w-full h-[180px] sm:h-[240px] lg:h-[280px]"
            >
              <Image
                src={pro2?.img || "/images/promo/promo-03.png"}
                alt="promo banner 2"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PromoBanner;