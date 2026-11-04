"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

interface SliderItem {
  id: number;
  link: string;
  img: string;
}

interface HeroCarouselProps {
  sliders: SliderItem[];
}

const HeroCarousel = ({ sliders }: HeroCarouselProps) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {sliders && sliders.length > 0 ? (
        sliders.map((slider) => (
          <SwiperSlide key={slider.id}>
            {/* Mobile friendly height: chote screens par 250px, tablet par 350px aur large screens par 450px */}
            <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[450px] flex items-center justify-center overflow-hidden rounded-[10px]">
            <a href={slider.link || "#"}  rel="noopener noreferrer">
              <Image
                src={slider.img || "/images/hero/hero-01.png"}
                alt="slider image"
                fill
                className="object-cover"
                priority
              />
            </a>
              {/* Bottom Center Button (Mobile par size thoda chota aur neat rakha hai) */}
            </div>
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          <div className="p-10 text-center">No slider items found.</div>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default HeroCarousel; // Ya export default HeroCarousel;