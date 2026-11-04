import React from "react";
import Image from "next/image";
import SingleItem from "./SingleItem";
import { db } from "@/db"; // Apne db path ke mutabiq check kar len
import { feedbacks } from "@/db/schema"; // Apne schema path ke mutabiq check kar len

// Agar aap component ko Client Component rakh kar data fetch karna chahte hain 
// ya Server Component rakhna chahte hain, toh Next.js mein Server Component ziada behtar hai.
// Lekin Swiper ke slider ref ke liye hum isko Server Component bana kar inner content ko handle kar sakte hain,
// ya phir ek chota client wrapper bana sakte hain. Ye raha direct Server Component version:

const Testimonials = async () => {
  // Database se feedbacks fetch karein
  const testimonialsData = await db.select().from(feedbacks);

  return (
    <section className="overflow-hidden pb-16.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div>
          <div className="swiper testimonial-carousel common-carousel p-5">
            {/* <!-- section title --> */}
            <div className="mb-10 flex items-center justify-between">
              <div>
                <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                  <Image
                    src="/images/icons/icon-08.svg"
                    alt="icon"
                    width={17}
                    height={17}
                  />
                  Testimonials
                </span>
                <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                  User Feedbacks
                </h2>
              </div>
            </div>

            {/* Agar database mein feedback na ho toh message show ho */}
            {testimonialsData.length === 0 ? (
              <p className="text-gray-500 text-sm">No feedbacks available yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonialsData.map((item) => (
                  <div key={item.id}>
                    <SingleItem testimonial={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;