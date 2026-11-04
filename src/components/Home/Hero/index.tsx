import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import { db } from "@/db"; 
import { sliders, images } from "@/db/schema"; 
import { or, eq } from "drizzle-orm";

const Hero = async () => {
  // 1. Sliders table se data fetch karein carousel ke liye
  const sliderItems = await db.select().from(sliders);

  // 2. Images table se hero1 aur hero2 fetch karein right side banners ke liye
  const heroImagesData = await db
    .select()
    .from(images)
    .where(or(eq(images.locationid, 'hero1'), eq(images.locationid, 'hero2')));

  const hero1 = heroImagesData.find((item) => item.locationid === 'hero1');
  const hero2 = heroImagesData.find((item) => item.locationid === 'hero2');

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          
          {/* Main Slider Section */}
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel sliders={sliderItems} />
            </div>
          </div>

          {/* Right Side Banners (Hero1 & Hero2) - Responsive Mobile & Desktop View */}
          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              
              {/* Hero 1 Banner Box */}
              <div className="w-full relative rounded-[10px] overflow-hidden bg-white shadow-sm">
                <a href={hero1?.link || "#"} className="block relative w-full h-[160px] sm:h-[190px] xl:h-[210px]">
                  <Image
                    src={hero1?.img || "/images/hero/hero-02.png"}
                    alt="hero banner 1"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </a>
              </div>

              {/* Hero 2 Banner Box */}
              <div className="w-full relative rounded-[10px] overflow-hidden bg-white shadow-sm">
                <a href={hero2?.link || "#"} className="block relative w-full h-[160px] sm:h-[190px] xl:h-[210px]">
                  <Image
                    src={hero2?.img || "/images/hero/hero-01.png"}
                    alt="hero banner 2"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;