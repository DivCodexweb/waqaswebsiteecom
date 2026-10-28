"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import RecentlyViewdItems from "./RecentlyViewd";

const ShopDetails = ({ product }: { product: any }) => {
  const [previewImg, setPreviewImg] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  // Database se `imgs` column JSON string ki surat mein aata hai, usay safely parse karein:
  let imageList: string[] = [];
  try {
    if (typeof product.imgs === "string") {
      const parsed = JSON.parse(product.imgs);
      imageList = parsed.previews || parsed.thumbnails || parsed || [];
    } else if (Array.isArray(product.imgs)) {
      imageList = product.imgs;
    } else if (product.imgs?.previews) {
      imageList = product.imgs.previews;
    }
  } catch (e) {
    imageList = ["/images/placeholder.jpg"];
  }

  if (imageList.length === 0) imageList = ["/images/placeholder.jpg"];

  return (
    <>
      <Breadcrumb title={"Shop Details"} pages={["Shop", product.title]} />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            {/* Gallery Section */}
            <div className="lg:max-w-[570px] w-full">
              <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                <Image
                  src={imageList[previewImg] || imageList[0]}
                  alt={product.title || "product"}
                  width={400}
                  height={400}
                  className="object-contain h-full"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                {imageList.map((imgUrl: string, key: number) => (
                  <button
                    onClick={() => setPreviewImg(key)}
                    key={key}
                    className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue cursor-pointer ${
                      key === previewImg ? "border-blue" : "border-transparent"
                    }`}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={imgUrl}
                      alt="thumbnail"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="max-w-[539px] w-full">
              <h1 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark mb-3">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-4.5">
                <span className="font-semibold text-xl text-blue">
                  ${product.discountedPrice || product.price}
                </span>
                {product.discountedPrice && product.discountedPrice < product.price && (
                  <span className="line-through text-gray-500">
                    ${product.price}
                  </span>
                )}
              </div>

              <p className="text-body mb-6">{product.description}</p>

              {/* Quantity & Actions */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-3 rounded-md px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  className="bg-blue text-white font-medium py-3 px-8 rounded-md hover:bg-blue-dark transition-colors cursor-pointer"
                  onClick={() => alert(`Added ${quantity} item(s) to cart!`)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewdItems />
    </>
  );
};

export default ShopDetails;