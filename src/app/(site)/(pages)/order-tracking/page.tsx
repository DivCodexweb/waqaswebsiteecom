"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";

const OrderTrackingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"id" | "phone">("id");
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert("Please enter a valid Order ID or Phone Number!");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setOrderResult(null);

    try {
      const res = await fetch(`/api/orders/track?type=${searchType}&value=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setOrderResult(data.order);
      } else {
        setErrorMessage(data.message || "No order found with this detail.");
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Order Tracking"} pages={["Order Tracking"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[850px] w-full mx-auto px-4 sm:px-8">
          
          {/* Main Card */}
          <div className="bg-white rounded-[20px] shadow-lg p-6 sm:p-10">
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-dark mb-2">Track Your Order 📦</h2>
              <p className="text-gray-600">
                Enter your Order ID or Phone Number below to check your live order status.
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleTrackOrder} className="space-y-5">
              
              {/* Type Switcher Buttons */}
              <div className="flex justify-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setSearchType("id")}
                  className={`px-5 py-2 rounded-lg font-medium text-sm transition duration-200 cursor-pointer ${
                    searchType === "id"
                      ? "bg-blue text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Search by Order ID
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType("phone")}
                  className={`px-5 py-2 rounded-lg font-medium text-sm transition duration-200 cursor-pointer ${
                    searchType === "phone"
                      ? "bg-blue text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Search by Phone Number
                </button>
              </div>

              {/* Input & Submit */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    searchType === "id"
                      ? "Enter Order ID (e.g. 1)"
                      : "Enter Phone Number (e.g. +923001234567)"
                  }
                  className="flex-1 rounded-xl border border-gray-3 bg-gray-1 py-3.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 text-dark"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue hover:bg-blue-dark text-white font-semibold py-3.5 px-8 rounded-xl transition duration-300 shadow-md flex items-center justify-center min-w-[140px] cursor-pointer"
                >
                  {loading ? "Searching..." : "Track Order"}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-medium">
                {errorMessage}
              </div>
            )}

            {/* Order Result Details Box */}
            {orderResult && (
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 text-left transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-4 gap-2">
                  <div>
                    <span className="text-sm text-gray-500">Order ID:</span>
                    <h3 className="text-xl font-bold text-dark">#{orderResult.id}</h3>
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      orderResult.status === 'completed' ? 'bg-green-100 text-green-700' :
                      orderResult.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {orderResult.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-gray-500">Customer Name:</p>
                    <p className="font-semibold text-dark">{orderResult.firstName} {orderResult.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone Number:</p>
                    <p className="font-semibold text-dark">{orderResult.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Delivery Address:</p>
                    <p className="font-semibold text-dark">{orderResult.address}, {orderResult.town}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order Date:</p>
                    <p className="font-semibold text-dark">{new Date(orderResult.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-semibold text-dark mb-3">Ordered Items:</h4>
                  <div className="space-y-2.5">
                    {orderResult.items?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 flex justify-between items-center shadow-xs">
                        <div>
                          <p className="font-medium text-dark">{item.title} <span className="text-sm text-gray-500">(x{item.quantity})</span></p>
                          {item.selectedAttributes && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.selectedAttributes}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-dark">Rs {item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 font-extrabold text-lg">
                  <span className="text-dark">Total Amount:</span>
                  <span className="text-blue">Rs {orderResult.totalAmount}</span>
                </div>
              </div>
            )}

            {/* Back to Shop */}
            <div className="mt-8 text-center">
              <Link href="/shop-with-sidebar" className="text-blue font-semibold hover:underline">
                ← Back to Shop
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

OrderTrackingPage.displayName = "OrderTrackingPage";
export default OrderTrackingPage;