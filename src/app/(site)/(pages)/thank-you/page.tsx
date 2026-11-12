"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";

const ThankYouPage = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("latestOrder");
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder));
    }
  }, []);

  // Fallback state if order details are not found in localStorage
  const order = orderDetails || {
    orderId: "1058",
    customerDetails: {
      firstName: "Muhammad",
      lastName: "Kashif",
      phone: "+923001234567",
      town: "Lahore",
      address: "Main Boulevard, DHA",
    },
    items: [
      {
        title: "Mouse HP",
        price: 2000,
        quantity: 1,
        selectedAttributes: { Color: "Black", Size: "Medium" },
      },
    ],
    totalAmount: 2000,
  };

  // WhatsApp Admin Number (Without '+' sign, include country code)
  const adminWhatsAppNumber = "923001234567"; 
  
  // Clean English WhatsApp Message Format
  const generateWhatsAppMessage = () => {
    let msg = `Hello! I have just placed an order. Here are my order details:\n\n`;
    msg += `📦 *Order ID:* #${order.orderId || "1058"}\n`;
    msg += `👤 *Name:* ${order.customerDetails.firstName} ${order.customerDetails.lastName}\n`;
    msg += `📞 *Phone:* ${order.customerDetails.phone}\n`;
    msg += `📍 *City:* ${order.customerDetails.town}\n\n`;
    msg += `🛍️ *Items Ordered:* \n`;
    
    order.items.forEach((item: any, idx: number) => {
      msg += `${idx + 1}. ${item.title} (Qty: ${item.quantity}) - $${(item.discountedPrice || item.price) * item.quantity}\n`;
      if (item.selectedAttributes) {
        Object.entries(item.selectedAttributes).forEach(([k, v]) => {
          msg += `   - ${k}: ${v}\n`;
        });
      }
    });

    msg += `\n💰 *Total Amount:* $${order.totalAmount}\n`;
    msg += `Thank you! Please confirm my order.`;

    return encodeURIComponent(msg);
  };

  const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${generateWhatsAppMessage()}`;

  return (
    <>
      <Breadcrumb title={"Thank You"} pages={["Thank You"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8">
          
          {/* Main Card with Fade-in Animation */}
          <div className="bg-white rounded-[20px] shadow-lg p-6 sm:p-12 text-center animate-fade-in transition-all duration-500 transform hover:scale-[1.01]">
            
            {/* Big Animated Green Tick Icon in Center */}
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-md">
              <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-3 tracking-tight">
              Thank You For Your Order! 🎉
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-lg mx-auto">
              Your order has been placed successfully. We will contact you very soon to confirm your details.
            </p>

            {/* Order Summary Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left mb-8 shadow-sm">
              <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                <span className="font-semibold text-dark">Order ID:</span>
                <span className="text-blue font-bold">#{order.orderId || "1058"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                <span className="font-semibold text-dark">Customer Name:</span>
                <span className="text-dark font-medium">{order.customerDetails.firstName} {order.customerDetails.lastName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                <span className="font-semibold text-dark">Phone:</span>
                <span className="text-dark font-medium">{order.customerDetails.phone}</span>
              </div>

              {/* Products & Attributes Details */}
              <div className="mb-4">
                <p className="font-semibold text-dark mb-2">Order Items:</p>
                <div className="space-y-2.5">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="bg-white p-3.5 rounded-lg border border-gray-200 flex justify-between items-center shadow-xs">
                      <div>
                        <p className="font-semibold text-dark">{item.title} <span className="text-sm font-normal text-gray-500">(Qty: {item.quantity})</span></p>
                        {item.selectedAttributes && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5 text-xs text-gray-600">
                            {Object.entries(item.selectedAttributes).map(([key, val]) => (
                              <span key={key} className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 font-medium">
                                <strong className="text-dark">{key}:</strong> {String(val)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-dark text-base">${(item.discountedPrice || item.price) * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200 font-extrabold text-xl">
                <span className="text-dark">Total Amount:</span>
                <span className="text-blue">${order.totalAmount}</span>
              </div>
            </div>

            {/* Interactive WhatsApp Button with Pulse Animation */}
            <div className="mb-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-green hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 animate-pulse hover:animate-none"
              >
                {/* WhatsApp SVG Icon */}
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                Chat on WhatsApp to Confirm Order
              </a>
            </div>

            {/* Continue Shopping Link */}
            <div>
              <Link
                href="/shop-with-sidebar"
                className="text-blue font-semibold hover:underline inline-flex items-center gap-1.5 transition duration-200"
              >
                ← Continue Shopping
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ThankYouPage;