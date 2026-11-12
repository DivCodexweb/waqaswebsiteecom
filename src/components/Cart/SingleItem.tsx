"use client";
import React, { useState } from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from "@/redux/features/cart-slice";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }: { item: any }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const handleIncreaseQuantity = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
    }
  };

  // Safe & direct image resolver for Cloudinary URLs
  let imageSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg==";

  try {
    const rawImgs = item.imgs;
    if (rawImgs) {
      if (typeof rawImgs === "string") {
        if (rawImgs.startsWith("http") || rawImgs.startsWith("/")) {
          imageSrc = rawImgs;
        } else {
          const parsed = JSON.parse(rawImgs);
          if (typeof parsed === "string" && (parsed.startsWith("http") || parsed.startsWith("/"))) {
            imageSrc = parsed;
          } else if (Array.isArray(parsed) && parsed.length > 0) {
            imageSrc = parsed[0];
          } else if (typeof parsed === "object" && parsed !== null) {
            imageSrc = parsed.previews?.[0] || parsed.thumbnails?.[0] || parsed[0] || imageSrc;
          }
        }
      } else if (Array.isArray(rawImgs) && rawImgs.length > 0) {
        imageSrc = rawImgs[0];
      } else if (typeof rawImgs === "object" && rawImgs !== null) {
        imageSrc = rawImgs.previews?.[0] || rawImgs.thumbnails?.[0] || rawImgs[0] || imageSrc;
      }
    }
  } catch (err) {
    if (typeof item.imgs === "string" && (item.imgs.startsWith("http") || item.imgs.startsWith("/"))) {
      imageSrc = item.imgs;
    }
  }

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-7.5">
      <div className="min-w-[400px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="relative flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5 overflow-hidden">
              <Image width={80} height={80} src={imageSrc} alt={item.title || "product"} className="object-cover" />
            </div>

            <div>
              <h3 className="text-dark font-medium ease-out duration-200 hover:text-blue mb-1">
                <Link href={`/shop/${item.id}`}> {item.title} </Link>
              </h3>

              {/* Display Selected Attributes (Color, Size, etc.) */}
              {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
                  {Object.entries(item.selectedAttributes).map(([key, value]) => (
                    <span key={key} className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                      <strong className="capitalize">{key}:</strong> {String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-[180px]">
        <p className="text-dark">${item.discountedPrice || item.price}</p>
      </div>

      <div className="min-w-[275px]">
        <div className="w-max flex items-center rounded-md border border-gray-3">
          <button
            onClick={handleDecreaseQuantity}
            aria-label="button for remove product"
            className="flex items-center justify-center w-11.5 h-11.5 ease-out duration-200 hover:text-blue"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z"
                fill=""
              />
            </svg>
          </button>

          <span className="flex items-center justify-center w-16 h-11.5 border-x border-gray-4 font-medium">
            {quantity}
          </span>

          <button
            onClick={handleIncreaseQuantity}
            aria-label="button for add product"
            className="flex items-center justify-center w-11.5 h-11.5 ease-out duration-200 hover:text-blue"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z"
                fill=""
              />
              <path
                d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="min-w-[200px]">
        <p className="text-dark font-semibold">${(item.discountedPrice || item.price) * quantity}</p>
      </div>

      <div className="min-w-[50px] flex justify-end">
        <button
          onClick={handleRemoveFromCart}
          aria-label="button for remove product from cart"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.45017 2.06252H12.5498C12.7482 2.06239 12.921 2.06228 13.0842 2.08834C13.7289 2.19129 14.2868 2.59338 14.5883 3.17244C14.6646 3.319 14.7192 3.48298 14.7818 3.6712L14.8841 3.97819C14.9014 4.03015 14.9064 4.04486 14.9105 4.05645C15.0711 4.50022 15.4873 4.80021 15.959 4.81217C15.9714 4.81248 15.9866 4.81254 16.0417 4.81254H18.7917C19.1714 4.81254 19.4792 5.12034 19.4792 5.50004C19.4792 5.87973 19.1714 6.18754 18.7917 6.18754H3.20825C2.82856 6.18754 2.52075 5.87973 2.52075 5.50004C2.52075 5.12034 2.82856 4.81254 3.20825 4.81254H5.95833C6.01337 4.81254 6.02856 4.81248 6.04097 4.81217C6.51273 4.80021 6.92892 4.50024 7.08944 4.05647C7.09366 4.0448 7.09852 4.03041 7.11592 3.97819L7.21823 3.67122C7.28083 3.48301 7.33538 3.319 7.41171 3.17244C7.71324 2.59339 8.27112 2.19129 8.91581 2.08834C9.079 2.06228 9.25181 2.06239 9.45017 2.06252ZM8.25739 4.81254C8.30461 4.71993 8.34645 4.6237 8.38245 4.52419C8.39338 4.49397 8.4041 4.4618 8.41787 4.42048|8.50936 4.14601C8.59293 3.8953 8.61217 3.84416 8.63126 3.8075C8.73177 3.61448 8.91773 3.48045 9.13263 3.44614|9.17345 3.43962 9.22803 3.43754 9.49232 3.43754H12.5077C12.772 3.43754 12.8265 3.43962 12.8674 3.44614C13.0823 3.48045 13.2682 3.61449 13.3687 3.8075|13.3878 3.84416 13.4071 3.89529 13.4906 4.14601L13.5821 4.42031L13.6176 4.52421|13.6535 4.62372 13.6954 4.71994 13.7426 4.81254H8.25739Z"
              fill=""
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

SingleItem.displayName = "SingleItem";
export default SingleItem;