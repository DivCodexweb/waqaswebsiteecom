"use client";
import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/orders`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch((err) => {
        console.log("Error fetching orders:", err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 font-medium">
        Loading your orders...
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[770px]">
          {/* <!-- order header --> */}
          {orders.length > 0 && (
<div className="items-center justify-between py-4.5 px-7.5 hidden md:flex border-b border-gray-3">
  <div className="w-[150px]"><p className="text-custom-sm font-semibold text-dark">Order ID</p></div>
  <div className="w-[200px]"><p className="text-custom-sm font-semibold text-dark">Date</p></div>
  <div className="w-[150px]"><p className="text-custom-sm font-semibold text-dark">Status</p></div>
  <div className="w-[150px]"><p className="text-custom-sm font-semibold text-dark">Total Amount</p></div>
  <div className="w-[120px] text-right"><p className="text-custom-sm font-semibold text-dark">Action</p></div>
</div>
          )}

          {/* Render Live Orders */}
          {orders.length > 0 ? (
            orders.map((orderItem, key) => (
              <SingleOrder key={key} orderItem={orderItem} smallView={false} />
            ))
          ) : (
            <div className="py-12 px-4 sm:px-7.5 xl:px-10 text-center">
              <p className="text-gray-500 text-lg mb-2">You don't have any orders yet!</p>
              <p className="text-gray-400 text-sm">When you place orders, they will appear here.</p>
            </div>
          )}
        </div>

        {/* Mobile View / Small View rendering */}
        {orders.length > 0 &&
          orders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} />
          ))}
      </div>
    </>
  );
};

export default Orders;