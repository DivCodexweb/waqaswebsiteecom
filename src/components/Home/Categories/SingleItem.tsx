import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CategoryType {
  id: string | number;
  title: string;
  image?: string;
  img?: string;
  imageUrl?: string;
}

const SingleItem = ({ item }: { item: CategoryType }) => {
  // Check image URL across potential API field names or use default placeholder
  const categoryImage =
    item.image || item.img || item.imageUrl || "/images/categories/category-01.svg";

  return (
    <Link
      href={`/categories/${item.id}`}
      className="group flex flex-col items-center"
    >
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4 overflow-hidden relative">
        <Image
          src={categoryImage}
          alt={item.title || "Category"}
          width={82}
          height={62}
          className="object-contain ease-in-out duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {item.title}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;