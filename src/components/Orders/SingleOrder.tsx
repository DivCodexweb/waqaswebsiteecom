import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";

const SingleOrder = ({ orderItem, smallView }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  const orderIdStr = orderItem?.id ? String(orderItem.id) : "1000";
  const formattedId = orderIdStr.length > 8 ? orderIdStr.slice(-8) : orderIdStr;

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-b border-gray-3 py-5 px-7.5 hidden md:flex">
          {/* 1. Order ID */}
          <div className="w-[150px]">
            <p className="text-custom-sm text-red font-bold">
              #{formattedId}
            </p>
          </div>

          {/* 2. Date */}
          <div className="w-[200px]">
            <p className="text-custom-sm text-dark">
              {orderItem?.createdAt ? new Date(orderItem.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>

          {/* 3. Status */}
          <div className="w-[150px]">
            <span
              className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] capitalize font-medium ${
                orderItem?.status === "delivered" || orderItem?.status === "completed"
                  ? "text-green bg-green-light-6"
                  : orderItem?.status === "on-hold" || orderItem?.status === "cancelled"
                  ? "text-red bg-red-light-6"
                  : "text-yellow bg-yellow-light-4"
              }`}
            >
              {orderItem?.status || "pending"}
            </span>
          </div>

          {/* 4. Total Amount */}
          <div className="w-[150px]">
            <p className="text-custom-sm text-dark font-bold">
              RS {orderItem?.totalAmount || orderItem?.total || 0}
            </p>
          </div>

          {/* 5. Action */}
          <div className="w-[120px] flex justify-end">
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>
        </div>
      )}

      {/* Mobile View */}
      {smallView && (
        <div className="block md:hidden border-b border-gray-3 p-4 space-y-2">
          <p className="text-custom-sm text-dark">
            <span className="font-bold pr-2">Order ID:</span> #{formattedId}
          </p>
          <p className="text-custom-sm text-dark">
            <span className="font-bold pr-2">Date:</span> {orderItem?.createdAt ? new Date(orderItem.createdAt).toLocaleDateString() : "N/A"}
          </p>
          <p className="text-custom-sm text-dark flex items-center gap-2">
            <span className="font-bold">Status:</span>
            <span
              className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] capitalize font-medium ${
                orderItem?.status === "delivered" || orderItem?.status === "completed"
                  ? "text-green bg-green-light-6"
                  : orderItem?.status === "on-hold" || orderItem?.status === "cancelled"
                  ? "text-red bg-red-light-6"
                  : "text-yellow bg-yellow-light-4"
              }`}
            >
              {orderItem?.status || "pending"}
            </span>
          </p>
          <p className="text-custom-sm text-dark">
            <span className="font-bold pr-2">Total:</span> RS {orderItem?.totalAmount || orderItem?.total || 0}
          </p>
          <div className="pt-2">
            <OrderActions toggleDetails={toggleDetails} toggleEdit={toggleEdit} />
          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;