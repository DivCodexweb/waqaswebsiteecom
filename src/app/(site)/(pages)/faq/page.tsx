"use client";
import React, { useState } from "react";

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    { id: "all", label: "All Questions" },
    { id: "orders", label: "Orders & Shopping" },
    { id: "payment", label: "Payment & Pricing" },
    { id: "shipping", label: "Shipping & Delivery" },
    { id: "returns", label: "Size, Exchange & Returns" },
    { id: "support", label: "Products & Support" },
  ];

  const faqs = [
    {
      category: "orders",
      question: "How can I place an order?",
      answer: "Shopping with GetToHunt is simple: Browse our collection, select your preferred product, choose your required size/quantity, click 'Add to Cart' or 'Buy Now', fill in your delivery details, and submit your order."
    },
    {
      category: "orders",
      question: "Can I place an order without creating an account?",
      answer: "Yes, you can place an order using guest checkout by simply providing your contact and delivery information."
    },
    {
      category: "orders",
      question: "Can I change or modify my order after placing it?",
      answer: "Please contact us as soon as possible if you need to modify your order. We can accommodate changes if the order has not yet been dispatched."
    },
    {
      category: "orders",
      question: "Can I cancel my order?",
      answer: "Yes, you may request cancellation before your order is dispatched by contacting our customer support team with your order number."
    },
    {
      category: "payment",
      question: "What payment methods are available?",
      answer: "We offer Cash on Delivery (COD) and secure online payment methods where available during checkout."
    },
    {
      category: "payment",
      question: "In which currency are product prices displayed?",
      answer: "All product prices on the GetToHunt website are displayed in Pakistani Rupees (PKR)."
    },
    {
      category: "shipping",
      question: "Do you deliver across Pakistan?",
      answer: "Yes, GetToHunt delivers orders across Pakistan, subject to courier service availability at your location."
    },
    {
      category: "shipping",
      question: "How long does delivery take?",
      answer: "Order processing takes 1–2 business days, and estimated delivery takes 3–5 business days after dispatch."
    },
    {
      category: "shipping",
      question: "How can I track my order?",
      answer: "Once dispatched, tracking information or a tracking number will be shared via our courier partner so you can track your shipment."
    },
    {
      category: "returns",
      question: "Can I exchange my product size?",
      answer: "Yes, you may request a size exchange within 7 calendar days of receiving your order, provided the product is unused and in its original packaging."
    },
    {
      category: "returns",
      question: "What if I receive a damaged or incorrect product?",
      answer: "If you receive a damaged, defective, or incorrect product, please notify us within 48 hours of delivery with clear photographs or videos."
    },
    {
      category: "support",
      question: "How can I contact GetToHunt customer support?",
      answer: "You can reach out to our team through our official contact channels or WhatsApp support available on our website."
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeTab === "all" || faq.category === activeTab;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
   <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-8 xl:px-0 text-dark mt-[150px]">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Everything you need to know before you shop with <span className="font-semibold text-dark">GetToHunt</span>. Find answers about orders, payments, shipping, and returns.
        </p>

        {/* Search Bar */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search your question here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-3 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-blue transition"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {faqCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              activeTab === cat.id
                ? "bg-dark text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto space-y-4 mb-16">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-xs transition hover:shadow-md"
            >
              <h3 className="font-bold text-dark text-base sm:text-lg mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-500 text-base">No matching questions found.</p>
          </div>
        )}
      </div>

      {/* Still Have Questions Banner */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center max-w-3xl mx-auto">
        <h3 className="font-bold text-xl text-dark mb-2">Still Have Questions?</h3>
        <p className="text-gray-500 text-sm mb-6">
          If your question has not been answered above, feel free to get in touch with our customer support team at GetToHunt.
        </p>
        <a
          href="/contact"
          className="inline-block bg-blue text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-dark transition"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default FAQPage;