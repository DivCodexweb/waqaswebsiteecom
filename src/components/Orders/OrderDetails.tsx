import React from "react";
import Image from "next/image";

const OrderDetails = ({ orderItem }: any) => {
  const orderIdStr = orderItem?.id ? String(orderItem.id) : "1000";
  const formattedId = orderIdStr.length > 8 ? orderIdStr.slice(-8) : orderIdStr;

  return (
    <div className="w-full">
      <h3 className="font-bold text-xl text-dark mb-4 px-4 sm:px-7.5 pt-6">Order Details</h3>

      {/* Order Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 mx-4 sm:mx-7.5 p-4 rounded-xl mb-6 border border-gray-200">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order ID</p>
          <p className="font-bold text-red">#{formattedId}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date</p>
          <p className="text-sm font-medium text-dark">
            {orderItem?.createdAt ? new Date(orderItem.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
          <span
            className={`inline-block text-xs py-1 px-2.5 rounded-full capitalize font-bold ${
              orderItem?.status === "delivered" || orderItem?.status === "completed"
                ? "text-green-700 bg-green-100"
                : orderItem?.status === "on-hold" || orderItem?.status === "cancelled"
                ? "text-red-700 bg-red-100"
                : "text-yellow-700 bg-yellow-100"
            }`}
          >
            {orderItem?.status || "pending"}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Amount</p>
          <p className="text-sm font-extrabold text-dark">
            Rs {orderItem?.totalAmount || orderItem?.total || 0}
          </p>
        </div>
      </div>

      {/* Ordered Items List (Title, Price, Quantity & Image) */}
      <div className="px-4 sm:px-7.5 mb-6">
        <p className="font-bold text-dark mb-3">Ordered Products:</p>
        <div className="space-y-3">
          {orderItem?.items && orderItem.items.length > 0 ? (
            orderItem.items.map((item: any, index: number) => {
              // Image parsing check (agar JSON array ya string ho)
              let imageUrl = "/images/product/product-01.png"; // Fallback image
              try {
                if (item.image) {
                  const parsedImg = JSON.parse(item.image);
                  imageUrl = Array.isArray(parsedImg) ? parsedImg[0] : item.image;
                }
              } catch {
                imageUrl = item.image || "/images/product/product-01.png";
              }

              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-xl gap-4"
                >
                  <div className="flex items-center gap-3">
                    {/* Product Image */}
                    <div className="w-14 h-14 rounded-lg bg-white border border-gray-200 overflow-hidden relative flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.title || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Product Title & Qty */}
                    <div>
                      <p className="font-semibold text-dark text-sm sm:text-base">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Qty: <span className="font-medium text-dark">{item.quantity}</span> × Rs {item.price}
                      </p>
                      {item.selectedAttributes && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.selectedAttributes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Total Item Price */}
                  <div className="text-right font-extrabold text-dark text-sm sm:text-base">
                    Rs {(item.price || 0) * (item.quantity || 1)}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">No items found for this order.</p>
          )}
        </div>
      </div>

      {/* Shipping Details */}
      <div className="p-4 sm:p-7.5 bg-gray-50 mx-4 sm:mx-7.5 mb-6 rounded-xl space-y-2 border border-gray-200">
        <h4 className="font-bold text-dark mb-2">Shipping Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <p className="text-gray-700">
            <span className="font-semibold text-dark">Name:</span> {orderItem?.firstName || ""} {orderItem?.lastName || ""}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-dark">Phone:</span> {orderItem?.phone || "N/A"}
          </p>
          <p className="text-gray-700 sm:col-span-2">
            <span className="font-semibold text-dark">Address:</span> {orderItem?.address || ""}{orderItem?.addressTwo ? `, ${orderItem.addressTwo}` : ""}, {orderItem?.town || ""}, {orderItem?.country || ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;