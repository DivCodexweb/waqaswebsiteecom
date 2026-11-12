"use client";
import React from "react";

const TermsConditionsPage = () => {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-8 xl:px-0 text-dark mt-[150px]">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          TERMS & CONDITIONS
        </h1>
        <p className="text-gray-500 text-base font-medium">
          Clear Terms. Confident Shopping.
        </p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
        {/* Intro */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <p>
            Welcome to <strong className="text-dark">GetToHunt</strong>. These Terms & Conditions govern your access to and use of our website, products, and online shopping services.
          </p>
          <p>
            By accessing our website, browsing our products, or placing an order, you acknowledge that you have read and understood these Terms & Conditions and agree to comply with the applicable provisions.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">1. ABOUT GETTOHUNT</h2>
          <p>
            <strong className="text-dark">GetToHunt</strong> is an online retail brand operating in Pakistan, providing customers with the opportunity to explore products and place orders through our online shopping platform.
          </p>
          <p>
            Throughout these Terms & Conditions, "we", "us", and "our" refer to GetToHunt, while "you", "your", and "customer" refer to any individual using our website or purchasing our products.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">2. WEBSITE USE & CUSTOMER RESPONSIBILITIES</h2>
          <p>By using this website, you agree to use it only for lawful purposes, provide accurate information during checkout, maintain account confidentiality, and avoid interfering with website functionality or security.</p>
        </section>

        {/* Section 3, 4, 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">3. PRODUCT INFORMATION, STOCK & PRICING</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Products & Images:</strong> Minor variations in color, appearance, or texture may occur depending on screen settings.</li>
            <li><strong>Stock Availability:</strong> Products are subject to availability. Adding items to a cart does not reserve them.</li>
            <li><strong>Pricing:</strong> All prices are listed in Pakistani Rupees (PKR). We reserve the right to correct genuine pricing errors.</li>
          </ul>
        </section>

        {/* Section 6 & 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">4. ORDER PLACEMENT, CONFIRMATION & CANCELLATION</h2>
          <p>Orders are subject to verification and product availability. GetToHunt reserves the right to refuse, hold, or cancel orders due to incorrect information, suspected fraud, stock unavailability, or pricing errors.</p>
        </section>

        {/* Section 8 & 9 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">5. PAYMENT & DELIVERY</h2>
          <p>We offer secure payment options, including Cash on Delivery (COD) and available online payment methods. Deliveries are handled across Pakistan through our trusted courier partners within standard processing and delivery timeframes.</p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">6. RETURNS & EXCHANGES</h2>
          <p>Eligible customers may request an exchange within 7 calendar days of receiving their order, subject to our Returns & Exchange Policy. Products must be unused, unworn, and in their original packaging.</p>
        </section>

        {/* Section 11 & 12 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">7. INTELLECTUAL PROPERTY</h2>
          <p>All original content, brand identity, logos, product photographs, and text on the GetToHunt website are protected by applicable intellectual property laws and cannot be used without prior written permission.</p>
        </section>

        {/* Section 13, 14, 15 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">8. LIMITATION OF LIABILITY & SECURITY</h2>
          <p>GetToHunt makes reasonable efforts to ensure smooth website operation and secure shopping, but cannot guarantee uninterrupted availability or liability for external third-party courier delays.</p>
        </section>

        {/* Section 16, 17, 18 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-dark">9. GOVERNING LAW</h2>
          <p>These Terms & Conditions shall be governed by and interpreted in accordance with the applicable laws of Pakistan.</p>
        </section>

        {/* Section 19: Contact */}
        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
          <h2 className="text-xl font-bold text-dark">10. CONTACT INFORMATION</h2>
          <p>If you have any questions or concerns regarding these Terms & Conditions, please contact us:</p>
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

export default TermsConditionsPage;