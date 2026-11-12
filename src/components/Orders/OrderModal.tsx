import React from "react";
import OrderDetails from "./OrderDetails";
import EditOrder from "./EditOrder";

const OrderModal = ({ showDetails, showEdit, toggleModal, order }: any) => {
  if (!showDetails && !showEdit) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[650px] rounded-2xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Properly positioned Close Button */}
        <button
          onClick={() => toggleModal(false)}
          className="absolute top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-200 cursor-pointer shadow-xs"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Content Wrapper */}
        <div className="w-full mt-2">
          {showDetails && <OrderDetails orderItem={order} />}
          {showEdit && <EditOrder order={order} toggleModal={toggleModal} />}
        </div>

      </div>
    </div>
  );
};

export default OrderModal;