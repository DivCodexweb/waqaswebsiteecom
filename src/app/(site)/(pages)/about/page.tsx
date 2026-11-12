import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | GetToHunt - Step Into Style & Confidence",
  description: "Discover the story behind GetToHunt. Learn about our commitment to premium quality footwear, comfort, and fast nationwide delivery across Pakistan.",
  keywords: ["GetToHunt", "About Us GetToHunt", "Footwear brand Pakistan", "GetToHunt story"],
  openGraph: {
    title: "About Us | GetToHunt",
    description: "Discover the story behind GetToHunt and our passion for premium footwear and exceptional customer satisfaction.",
    url: "https://gettohunt.com/about",
    siteName: "GetToHunt",
    type: "website",
  },
};

const AboutUsPage = () => {
  return (
    <div className="mx-auto max-w-[1170px] px-4 py-12 sm:px-8 xl:px-0 text-dark mt-[150px]">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="bg-blue-light-6 text-blue text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
          Welcome to GetToHunt
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-dark leading-tight">
          Step Into Style. <br />
          <span className="text-blue">Walk With Confidence.</span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          At <strong className="text-dark">GetToHunt</strong>, we believe that the right pair of footwear does more than just complete an outfit—it empowers your journey, defines your persona, and brings unmatched comfort to every step you take.
        </p>
      </div>

      {/* Brand Story / Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 bg-gray-50 border border-gray-200 p-8 sm:p-12 rounded-3xl">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark">
            Our Story & Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Founded with a passion for quality craftsmanship and modern trends, GetToHunt emerged to bridge the gap between premium durability and accessible everyday style. Whether you are chasing adventures outdoors or stepping out for a casual day in the city, our collections are curated to keep you at the top of your game.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We are deeply committed to ensuring that every product meets rigorous standards of comfort, resilience, and style, backed by a seamless shopping experience across Pakistan.
          </p>
        </div>
        <div className="relative h-[300px] sm:h-[350px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-tr from-dark/60 to-transparent z-10 flex items-end p-6">
            <p className="text-white font-medium text-lg">Crafted for Excellence & Durability</p>
          </div>
          <Image
            src="/images/product/product-01.png" 
            alt="GetToHunt Mission"
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-2">Why Choose GetToHunt?</h2>
          <p className="text-gray-500 text-sm sm:text-base">We stand by principles that put our customers first.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xs transition hover:shadow-xl hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-light-6 text-blue flex items-center justify-center font-bold text-xl mb-4">
              ✨
            </div>
            <h3 className="font-bold text-lg text-dark mb-2">Uncompromising Quality</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every item in our store goes through stringent checks to ensure premium quality finishes and long-lasting material strength.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xs transition hover:shadow-xl hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-xl bg-green-light-6 text-green flex items-center justify-center font-bold text-xl mb-4">
              🛡️
            </div>
            <h3 className="font-bold text-lg text-dark mb-2">Customer Satisfaction</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              From hassle-free sizing exchanges to dedicated customer support, your satisfaction remains our ultimate goal.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xs transition hover:shadow-xl hover:-translate-y-1 duration-300 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-yellow-light-4 text-yellow-700 flex items-center justify-center font-bold text-xl mb-4">
              🚀
            </div>
            <h3 className="font-bold text-lg text-dark mb-2">Fast Nationwide Delivery</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We partner with leading reliable couriers across Pakistan to ensure your packages arrive securely and right on schedule.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-dark text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Upgrade Your Collection?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Explore our latest arrivals and experience footwear designed for modern confidence.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="bg-blue text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-dark transition duration-200 shadow-md"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition duration-200 border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUsPage;