import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | GetToHunt - Fast Nationwide Delivery in Pakistan",
  description:
    "Read GetToHunt's Shipping Policy. Learn about our 1–2 business days order processing, 3–5 business days standard delivery across Pakistan, Cash on Delivery (COD), and parcel tracking.",
  keywords: [
    "GetToHunt Shipping Policy",
    "Delivery time GetToHunt",
    "Cash on Delivery Pakistan",
    "Nationwide shipping GetToHunt",
  ],
  openGraph: {
    title: "Shipping Policy | GetToHunt",
    description:
      "Fast, reliable, and transparent nationwide delivery across Pakistan with GetToHunt.",
    url: "https://gettohunt.com/shipping-policy",
    siteName: "GetToHunt",
    type: "website",
  },
};

const ShippingPolicyPage = () => {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-8 xl:px-0 text-dark mt-[150px]">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          SHIPPING POLICY
        </h1>
        <p className="text-gray-500 text-base font-medium">
          Reliable Delivery. A Better Shopping Experience.
        </p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
        {/* Intro */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <p>
            At <strong className="text-dark">GetToHunt</strong>, we aim to make your shopping experience simple, convenient, and reliable. We deliver orders across Pakistan and work to ensure that your purchases reach you safely and within the estimated delivery timeframe.
          </p>
          <p>
            Please read our Shipping Policy carefully to understand how we process, dispatch, and deliver your orders.
          </p>
        </div>

        {/* Section 1 & 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">
            1. DELIVERY COVERAGE & ORDER PROCESSING
          </h2>
          <p>
            GetToHunt offers delivery services across Pakistan, subject to courier service availability. Orders are generally processed within <strong>1–2 business days</strong> after successful placement and verification.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">2. ESTIMATED DELIVERY TIME</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Order Processing:</strong> 1–2 business days.</li>
            <li><strong>Estimated Delivery:</strong> 3–5 business days after dispatch.</li>
          </ul>
          <p className="text-xs text-gray-500 mt-1">Delivery times may vary based on weather, location, courier operations, or public holidays.</p>
        </section>

        {/* Section 4, 5, 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">3. SHIPPING CHARGES & CASH ON DELIVERY (COD)</h2>
          <p>
            Applicable shipping charges are displayed during checkout. Where Cash on Delivery (COD) is available, customers pay the confirmed amount to the courier representative upon receipt. Verified mobile numbers and order confirmation may be required.
          </p>
        </section>

        {/* Section 7, 8, 9 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">4. TRACKING & CUSTOMER RESPONSIBILITIES</h2>
          <p>
            Once dispatched, tracking details will be shared where available. Customers must provide accurate and complete delivery addresses, reachable phone numbers, and ensure someone is present to receive the parcel.
          </p>
        </section>

        {/* Section 10, 11, 12 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">5. FAILED DELIVERIES, DELAYS & DAMAGED PARCELS</h2>
          <p>
            In case of failed delivery attempts or external transit delays, our support team coordinates with courier partners. Visible parcel damage must be reported immediately with photographs for review under our Returns & Exchange Policy.
          </p>
        </section>

        {/* Section 14: Contact */}
        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
          <h2 className="text-xl font-bold text-dark">6. CONTACT & DELIVERY SUPPORT</h2>
          <p>For questions regarding shipping or tracking, please contact our support team:</p>
          <div className="space-y-1 text-dark font-medium">
            <p><strong>Brand:</strong> GetToHunt</p>
            <p><strong>Email:</strong> support@gettohunt.com</p>
            <p><strong>WhatsApp / Phone:</strong> [Insert verified business contact number]</p>
            <p><strong>Business Location:</strong> Pakistan</p>
          </div>
          <p className="text-xs text-gray-400 pt-2">Last Updated: November 2026</p>
        </section>

        {/* Brand Tagline */}
        <div className="text-center pt-8 border-t border-gray-200">
          <h3 className="font-extrabold text-lg text-dark">GETTOHUNT</h3>
          <p className="text-xs text-gray-400 mt-1">Step Into Style. Walk With Confidence.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;