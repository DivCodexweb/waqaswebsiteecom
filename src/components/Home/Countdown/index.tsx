import React from "react";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer"; // Path apne folder ke mutabiq check kar len
import { db } from "@/db"; // Apne db path ke mutabiq adjust karein
import { offerimages } from "@/db/schema"; // Apne schema path ke mutabiq adjust karein
import { desc } from "drizzle-orm";

const CounDown = async () => {
  // Database se sabse latest offer fetch karein (id ke descending order mein)
  const offers = await db
    .select()
    .from(offerimages)
    .orderBy(desc(offerimages.id))
    .limit(1);

  const currentOffer = offers[0];

  // Agar database mein data mojood ho toh wahan ki date/link/img use ho, warna default
  const targetDate = currentOffer?.date || "2026-12-31";
  const offerLink = currentOffer?.link || "#";
  const offerImg = currentOffer?.img || "/images/countdown/countdown-01.png";

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative overflow-hidden z-1 rounded-lg bg-[#D0E9F3] p-4 sm:p-7.5 lg:p-10 xl:p-15">
          <div className="max-w-[422px] w-full">
            <span className="block font-medium text-custom-1 text-blue mb-2.5">
              Don’t Miss!!
            </span>

            <h2 className="font-bold text-dark text-xl lg:text-heading-4 xl:text-heading-3 mb-3">
              Enhance Your Music Experience
            </h2>

            <p>The Havit H206d is a wired PC headphone.</p>

            {/* Countdown Timer Component (Jo expiry par "Offer Closed" dikhayega) */}
            <CountdownTimer targetDate={targetDate} />

            <a
              href={offerLink}
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Check it Out!
            </a>
          </div>

          {/* Background Shapes */}
          <Image
            src="/images/countdown/countdown-bg.png"
            alt="bg shapes"
            className="hidden sm:block absolute right-0 bottom-0 -z-1"
            width={737}
            height={482}
          />

          {/* Database se aane wali Dynamic Product Image */}
          <div className="hidden lg:block absolute right-4 xl:right-33 bottom-4 xl:bottom-10 -z-1 w-[411px] h-[376px]">
            <Image
              src={offerImg}
              alt="product offer image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounDown;