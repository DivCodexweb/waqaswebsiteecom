"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
// Agar clear cart action available ho toh import kar sakte hain:
// import { clearCart } from "@/redux/features/cart-slice";

const Checkout = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);
  const dispatch = useDispatch<AppDispatch>();

  // Form state for billing, shipping, and notes
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    address: "",
    addressTwo: "",
    town: "",
    phone: "",
    email: "",
    notes: "",
  });

const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderPayload = {
      customerDetails: formData,
      items: cartItems,
      totalAmount: totalPrice,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("Order Placed Successfully:", data);
        // alert(`Order placed successfully! 🎉 Order ID: ${data.orderId}`);
        
      const orderData = {
  orderId: data.orderId,
  customerDetails: formData,
  items: cartItems,
  totalAmount: totalPrice,
};
localStorage.setItem("latestOrder", JSON.stringify(orderData));

// Phir redirect kar dein:
window.location.href = "/thank-you";
      } else {
        alert(data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleOrderSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- billing details --> */}
                <Billing formData={formData} setFormData={setFormData} />

                {/* <!-- address box two --> */}
                <Shipping formData={formData} setFormData={setFormData} />

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {/* <!-- dynamic cart items --> */}
                    {cartItems.length > 0 ? (
                      cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-5 border-b border-gray-3"
                        >
                          <div>
                            <p className="text-dark">
                              {item.title} {item.quantity > 1 && `(x${item.quantity})`}
                            </p>
                          </div>
                          <div>
                            <p className="text-dark text-right">
                              ${(item.discountedPrice || item.price) * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center text-gray-500">
                        Your cart is empty
                      </p>
                    )}

                    {/* <!-- shipping fee placeholder --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Shipping Fee</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">$0.00</p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- coupon box --> */}
                <Coupon />

                {/* <!-- shipping box --> */}
                <ShippingMethod />

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 cursor-pointer"
                >
                  Place Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;