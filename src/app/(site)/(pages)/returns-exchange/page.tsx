import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchange Policy | GetToHunt - 7-Day Easy Exchange",
  description:
    "Review GetToHunt's Returns & Exchange Policy. Request a size or product exchange within 7 calendar days of delivery across Pakistan.",
  keywords: [
    "GetToHunt Returns Policy",
    "GetToHunt Exchange Policy",
    "Size exchange GetToHunt",
    "7 day exchange policy Pakistan",
  ],
  openGraph: {
    title: "Returns & Exchange Policy | GetToHunt",
    description:
      "Learn about our transparent 7-day size and product exchange policy at GetToHunt.",
    url: "https://gettohunt.com/returns-exchange",
    siteName: "GetToHunt",
    type: "website",
  },
};

const ReturnsExchangePage = () => {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-8 xl:px-0 text-dark mt-[150px]">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          RETURNS & EXCHANGE POLICY
        </h1>
        <p className="text-gray-500 text-base font-medium">
          Your Satisfaction Matters to Us.
        </p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
        {/* Intro */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <p>
            At <strong className="text-dark">GetToHunt</strong>, we want you to feel confident and satisfied with every purchase. We understand that selecting the right product size and style is important, and we aim to make the exchange process as simple and transparent as possible.
          </p>
          <p>
            If you experience an issue with your order or need a different size, please review the following policy before submitting an exchange request.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">
            1. EXCHANGE REQUEST PERIOD
          </h2>
          <p>
            Customers may request an exchange within <strong>7 calendar days of receiving their order</strong>, provided they supply their original order number, contact details, and a clear explanation. Requests submitted after 7 days may not be accepted.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">2. PRODUCT ELIGIBILITY CONDITIONS</h2>
          <p>To qualify for an exchange, products must be:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unused, unworn, and in their original condition.</li>
            <li>Free from signs of outdoor use, stains, scratches, or physical damage.</li>
            <li>Returned in original packaging with tags and accessories intact.</li>
          </ul>
        </section>

        {/* Section 3 & 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">3. SIZE EXCHANGES & WRONG PRODUCTS</h2>
          <p>
            Size exchanges are subject to inventory availability and inspection. If you receive an incorrect product, please notify us within <strong>48 hours</strong> of delivery with clear photographs, and GetToHunt will cover the courier charges for fulfilment errors.
          </p>
        </section>

        {/* Section 5 & 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">4. DAMAGED, DEFECTIVE PRODUCTS & SHIPPING CHARGES</h2>
          <p>
            Damaged or defective item claims must be reported within <strong>48 hours</strong> with supporting photos or videos. Customer-requested size exchanges require the customer to bear courier costs, whereas verified store errors or transit damages are fully covered by GetToHunt.
          </p>
        </section>

        {/* Section 7 & 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">5. EXCHANGE PROCESS & INSPECTION</h2>
          <p>
            Our exchange process involves contacting support, sharing evidence, getting return approval, physical inspection of the item upon arrival, and dispatching the replacement subject to stock availability.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">6. REFUND POLICY</h2>
          <p>
            GetToHunt primarily follows an exchange-based resolution. We do not offer change-of-mind refunds. Refunds are only issued if a replacement cannot be provided for verified wrong, damaged, or defective products.
          </p>
        </section>

        {/* Section 10, 11, 12 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">7. NON-ELIGIBLE REQUESTS & CANCELLATIONS</h2>
          <p>
            Requests sent without prior approval, missing tags, or after 7 days will be declined. Order cancellations are accepted before the order is dispatched.
          </p>
        </section>

        {/* Section 13: Contact */}
        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
          <h2 className="text-xl font-bold text-dark">8. HOW TO CONTACT US</h2>
          <p>For exchange requests or enquiries, please reach out to our team:</p>
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

export default ReturnsExchangePage;