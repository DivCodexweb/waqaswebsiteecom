import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | GetToHunt - Your Privacy, Our Responsibility",
  description:
    "Read the Privacy Policy of GetToHunt. Learn how we collect, use, protect, and safeguard your personal information when you shop online in Pakistan.",
  keywords: [
    "GetToHunt Privacy Policy",
    "Data protection GetToHunt",
    "Customer privacy Pakistan",
    "GetToHunt online store policy",
  ],
  openGraph: {
    title: "Privacy Policy | GetToHunt",
    description:
      "Learn how GetToHunt collects, uses, and protects your personal information when you visit our website or place an order.",
    url: "https://gettohunt.com/privacy-policy",
    siteName: "GetToHunt",
    type: "website",
  },
};

const PrivacyPolicyPage = () => {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-8 xl:px-0 text-dark mt-[150px]">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          PRIVACY POLICY
        </h1>
        <p className="text-gray-500 text-base font-medium">
          Your Privacy. Our Responsibility.
        </p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
        {/* Intro */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <p>
            At <strong className="text-dark">GetToHunt</strong>, we respect your privacy and are committed to handling your personal information responsibly. This Privacy Policy explains what information we collect, how we use it, when we share it, and the measures we take to protect it when you visit our website or purchase our products.
          </p>
          <p>
            By accessing or using our website, you acknowledge that you have read this Privacy Policy. Where applicable, we will obtain any consent required for specific data collection or processing activities.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-dark">
            1. INFORMATION WE COLLECT
          </h2>
          <p>When you visit our website, create an account, place an order, or contact our customer support team, we may collect certain personal and technical information.</p>
          
          <h3 className="font-semibold text-dark mt-2">A. Personal Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full name.</li>
            <li>Mobile or telephone number.</li>
            <li>Email address.</li>
            <li>Billing address.</li>
            <li>Delivery or shipping address.</li>
            <li>Order details and purchase history.</li>
            <li>Selected products, sizes, and quantities.</li>
            <li>Payment method and transaction-related information.</li>
            <li>Information provided during customer support or exchange requests.</li>
          </ul>

          <h3 className="font-semibold text-dark mt-2">B. Account Information</h3>
          <p>If you create an account on our website, we may collect login credentials (stored in protected form), saved billing/delivery addresses, and account preferences.</p>

          <h3 className="font-semibold text-dark mt-2">C. Technical & Website Information</h3>
          <p>Includes IP address, browser type, device info, pages visited, access times, and cookie identifiers to help us understand performance and security.</p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-dark">2. HOW WE USE YOUR INFORMATION</h2>
          <p>We use your information for order processing and fulfilment, customer communication and support, website improvement, and promotional communications (where consented).</p>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-dark">3. SHARING INFORMATION WITH THIRD PARTIES</h2>
          <p>We do not sell customers' personal information. However, we share necessary data with trusted service providers:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Courier & Delivery Partners:</strong> For parcel dispatch, delivery, and tracking.</li>
            <li><strong>Payment Service Providers:</strong> To process secure transactions.</li>
            <li><strong>Website Hosting & Tech Providers:</strong> For hosting, security, and maintenance.</li>
            <li><strong>Legal & Regulatory:</strong> To comply with applicable laws and protect legal rights.</li>
          </ul>
        </section>

        {/* Section 4 & 5 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-dark">4. COOKIES & ANALYTICS</h2>
          <p>Our website uses cookies and technologies like Google Analytics and Meta Pixel to improve browsing functionality, maintain sessions, and measure marketing performance.</p>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-dark">6. DATA SECURITY & PROTECTION</h2>
          <p>We implement technical and organizational measures (such as SSL encryption, restricted access, and password protection) to secure your information against unauthorized access.</p>
        </section>

        {/* Section 7 & 8 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-dark">7. CUSTOMER PRIVACY RIGHTS & RETENTION</h2>
          <p>You have the right to access, correct, or request deletion of your personal information. We retain personal data only as long as necessary for legal, accounting, and operational purposes.</p>
        </section>

        {/* Section 9 to 12 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-dark">9. ADDITIONAL TERMS</h2>
          <p>Our website may contain links to third-party services. This policy is not responsible for external practices. Our site is intended for general shopping, and updates to this policy will be posted directly on this page.</p>
        </section>

        {/* Section 13: Contact */}
        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
          <h2 className="text-xl font-bold text-dark">13. CONTACT US — PRIVACY ENQUIRIES</h2>
          <p>If you have questions or requests regarding this Privacy Policy, please contact us:</p>
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

export default PrivacyPolicyPage;