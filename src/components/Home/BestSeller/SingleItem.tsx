"use client";
import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import Image from "next/image";
import Link from "next/link";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";

const SingleItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        status: "available",
        quantity: 1,
      })
    );
  };

  const productImage = item?.imgs?.previews?.[0] || "/images/placeholder.jpg";
  const productId = item?.id  || "";

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg bg-[#F6F7FB] min-h-[403px]">
        <div className="text-center px-4 py-7.5">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Image
                  key={i}
                  src="/images/icons/icon-star.svg"
                  alt="star icon"
                  width={14}
                  height={14}
                />
              ))}
            </div>

            <p className="text-custom-sm">({item.reviews || 0})</p>
          </div>

          {/* Title Link */}
          <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 line-clamp-1">
            <Link href={`/shop/${productId}`}> {item.title} </Link>
          </h3>

          <span className="flex items-center justify-center gap-2 font-medium text-lg">
            <span className="text-dark">${item.discountedPrice || item.price}</span>
            {item.discountedPrice && item.discountedPrice < item.price && (
              <span className="text-dark-4 line-through">${item.price}</span>
            )}
          </span>
        </div>

        {/* Image wrapped with Link so clicking the image opens product detail page */}
        <Link href={`/shop/${productId}`} className="flex justify-center items-center h-[280px] block cursor-pointer">
          <Image 
            src={productImage} 
            alt={item.title || "product"} 
            width={280} 
            height={280} 
            className="object-contain h-full group-hover:scale-105 transition duration-300" 
          />
        </Link>

        {/* Action Buttons (Quick View, Cart, Wishlist) */}
        <div className="absolute right-0 bottom-0 translate-x-full u-w-full flex flex-col gap-2 p-5.5 ease-linear duration-300 group-hover:translate-x-0">
          {/* <button
            onClick={() => {
              handleQuickViewUpdate();
              openModal();
            }}
            aria-label="button for quick view"
            id="bestOne"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-white hover:bg-blue cursor-pointer"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99992 5.49996C6.61921 5.49996 5.49992 6.61925 5.49992 7.99996C5.49992 9.38067 6.61921 10.5 7.99992 10.5C9.38063 10.5 10.4999 9.38067 10.4999 7.99996C10.4999 6.61925 9.38063 5.49996 7.99992 5.49996ZM6.49992 7.99996C6.49992 7.17153 7.17149 6.49996 7.99992 6.49996C8.82835 6.49996 9.49992 7.17153 9.49992 7.99996C9.49992 8.82839 8.82835 9.49996 7.99992 9.49996C7.17149 9.49996 6.49992 8.82839 6.49992 7.99996Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99992 2.16663C4.9905 2.16663 2.96345 3.96942 1.78696 5.49787L1.76575 5.52543C1.49968 5.87098 1.25463 6.18924 1.08838 6.56556C0.910348 6.96854 0.833252 7.40775 0.833252 7.99996C0.833252 8.59217 0.910348 9.03138 1.08838 9.43436C1.25463 9.81068 1.49968 10.1289 1.76575 10.4745L1.78696 10.5021C2.96345 12.0305 4.9905 13.8333 7.99992 13.8333C11.0093 13.8333 13.0364 12.0305 14.2129 10.5021L14.2341 10.4745C14.5002 10.1289 14.7452 9.81069 14.9115 9.43436C15.0895 9.03138 15.1666 8.59217 15.1666 7.99996C15.1666 7.40775 15.0895 6.96854 14.9115 6.56556C14.7452 6.18923 14.5002 5.87097 14.2341 5.52541L14.2129 5.49787C13.0364 3.96942 11.0093 2.16663 7.99992 2.16663ZM2.5794 6.10783C3.66568 4.69657 5.43349 3.16663 7.99992 3.16663C10.5663 3.16663 12.3342 4.69657 13.4204 6.10783C13.7128 6.48769 13.8841 6.71466 13.9967 6.96966C14.102 7.20797 14.1666 7.49925 14.1666 7.99996C14.1666 8.50067 14.102 8.79195 13.9967 9.03026C13.8841 9.28526 13.7128 9.51223 13.4204 9.89209C12.3342 11.3033 10.5663 12.8333 7.99992 12.8333C5.43349 12.8333 3.66568 11.3033 2.5794 9.89209C2.28701 9.51223 2.11574 9.28525 2.00309 9.03026C1.89781 8.79195 1.83325 8.50067 1.83325 7.99996C1.83325 7.49925 1.89781 7.20797 2.00309 6.96966C2.11574 6.71466 2.28701 6.48769 2.5794 6.10783Z"
                fill=""
              />
            </svg>
          </button> */}

          <button
            onClick={() => handleAddToCart()}
            aria-label="button for add to cart"
            id="addCartOne"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-white hover:bg-blue cursor-pointer"
          >
            🛒
          </button>

          <button
            onClick={() => handleItemToWishList()}
            aria-label="button for add to fav"
            id="addFavOne"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-white hover:bg-blue cursor-pointer"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;