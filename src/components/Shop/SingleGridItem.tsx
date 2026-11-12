"use client";
import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";

const SingleGridItem = ({ item }: { item?: Product }) => {
  // Agar product data load nahi hua, toh skeleton loader render karein
  if (!item) {
    return (
      <div className="group animate-pulse">
        <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-gray-2 min-h-[270px] mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-2 rounded w-1/3"></div>
          <div className="h-5 bg-gray-2 rounded w-3/4"></div>
          <div className="h-6 bg-gray-2 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // add to cart with safe type formatting
const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        id: Number(item.id),
        discountedPrice: item.discountedPrice ?? item.price,
        imgs: item.imgs, // <-- Yahan seedha item.imgs pass karein (object ya array mat banayein)
        quantity: 1,
      })
    );
  };
  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        id: Number(item.id),
        discountedPrice: item.discountedPrice ?? item.price,
        imgs: {
          thumbnails: typeof item.imgs === "object" && item.imgs !== null && "thumbnails" in item.imgs ? (item.imgs.thumbnails as string[]) : [],
          previews: typeof item.imgs === "object" && item.imgs !== null && "previews" in item.imgs ? (item.imgs.previews as string[]) : [],
        },
        status: "available",
        quantity: 1,
      })
    );
  };

  // Safe image parsing fallback
  let imageSrc = "/images/placeholder.jpg";
  try {
    if (typeof item.imgs === "string") {
      const parsed = JSON.parse(item.imgs);
      imageSrc = parsed?.previews?.[0] || parsed?.[0] || "/images/placeholder.jpg";
    } else if (item.imgs && typeof item.imgs === "object") {
      // @ts-ignore
      imageSrc = item.imgs.previews?.[0] || item.imgs[0] || "/images/placeholder.jpg";
    }
  } catch {
    imageSrc = "/images/placeholder.jpg";
  }

  return (
    <div className="group">
      {/* Image container wrapped with Link */}
    <div className="shadow-list relative overflow-hidden flex items-center justify-center max-w-[270px] w-full sm:min-h-[270px] p-4 mx-auto block group">
  {/* Image wrapped in Link */}
  <Link href={`/shop/${item.id}`} className="flex items-center justify-center w-full cursor-pointer">
    <Image 
      src={imageSrc} 
      alt={item.title || "Product"} 
      width={250} 
      height={250} 
      className="object-contain group-hover:scale-105 transition duration-300" 
    />
  </Link>

  {/* Hover Action Button */}
  <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
    <Link
      href={`/shop/${item.id}`} 
      className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark cursor-pointer"
    >
      View Details
    </Link>
  </div>
</div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
        </div>
        <p className="text-custom-sm">({item.reviews || 5})</p>
      </div>

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
        <Link href={`/shop/${item.id}`}> {item.title} </Link>
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark">RS: {item.discountedPrice.toLocaleString()}</span>
        <span className="text-dark-4 line-through">RS:  {item.price.toLocaleString()}</span>
      </span>
    </div>
  );
};

export default SingleGridItem;