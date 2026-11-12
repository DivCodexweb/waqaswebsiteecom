import React, { useState } from "react";

const Shipping = ({ formData, setFormData }: { formData: any; setFormData: any }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div
        onClick={() => setDropdown(!dropdown)}
        className="cursor-pointer flex items-center gap-2.5 font-medium text-lg text-dark py-5 px-5.5"
      >
        Ship to a different address? (optional)
        <svg
          className={`fill-current ease-out duration-200 ${
            dropdown && "rotate-180"
          }`}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
            fill=""
          />
        </svg>
      </div>

      <div className={`p-4 sm:p-8.5 ${dropdown ? "block" : "hidden"}`}>
        <p className="text-sm text-gray-500 mb-4">
          Aap yahan mukhtalif shipping address darj kar sakte hain agar billing address se mukhtalif ho.
        </p>
      </div>
    </div>
  );
};

export default Shipping;