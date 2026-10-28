"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

interface BaseItem {
  id: number;
  title?: string;
  name?: string;
  img?: string | null;
  imgs?: string | null;
  logo?: string | null;
  image?: string | null;
  [key: string]: any;
}

interface CategoryViewWrapperProps {
  items: BaseItem[];
  type: "category" | "subcategory" | "product";
  basePath?: string;
}

export default function CategoryViewWrapper({
  items,
  type,
  basePath = "",
}: CategoryViewWrapperProps) {
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Search filter logic (Checks title or name)
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => {
      const itemTitle = item?.title || item?.name || "";
      return itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [items, searchQuery]);

  // 20 items per page pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Robust Image Parser Helper
  const getImageUrl = (item: BaseItem) => {
    if (item.logo) return item.logo;
    if (item.image) return item.image;
    if (item.img) return item.img;
    if (item.imgs) {
      try {
        const parsed = typeof item.imgs === "string" ? JSON.parse(item.imgs) : item.imgs;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        if (parsed?.previews && Array.isArray(parsed.previews)) return parsed.previews[0];
      } catch {
        return typeof item.imgs === "string" ? item.imgs : "/images/placeholder.png";
      }
    }
    return "/images/placeholder.png";
  };

  return (
    <div>
      {/* Top Filter Bar */}
      <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-3 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue text-black"
            />

            <p className="text-sm text-gray-6">
              Showing <span className="text-dark font-medium">{currentItems.length}</span> of{" "}
              <span className="text-dark font-medium">{filteredItems.length}</span> Items
            </p>
          </div>

          {/* Grid vs List View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProductStyle("grid")}
              className={`p-2 rounded-md border transition-colors ${
                productStyle === "grid"
                  ? "bg-blue border-blue text-white"
                  : "bg-gray-1 border-gray-3 text-dark hover:border-blue"
              }`}
              aria-label="Grid View"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M2 2h7v7H2V2zm9 0h7v7h-7V2zm0 9h7v7h-7v-7zm-9 0h7v7H2v-7z" />
              </svg>
            </button>
            <button
              onClick={() => setProductStyle("list")}
              className={`p-2 rounded-md border transition-colors ${
                productStyle === "list"
                  ? "bg-blue border-blue text-white"
                  : "bg-gray-1 border-gray-3 text-dark hover:border-blue"
              }`}
              aria-label="List View"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid / List Display */}
      <div
        className={
          productStyle === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7.5"
            : "flex flex-col gap-4"
        }
      >
        {currentItems.map((item) => {
          const imageSrc = getImageUrl(item);
          const displayTitle = item.title || item.name || "Brand";
          const targetHref = `${basePath}/${item.id}`;

          if (productStyle === "grid") {
            return (
              <Link
                key={item.id}
                href={targetHref}
                className="group bg-white rounded-lg p-4 shadow-1 hover:shadow-2 transition duration-200 text-center flex flex-col items-center justify-center"
              >
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md bg-gray-2 flex items-center justify-center">
                  <Image
                    src={imageSrc}
                    alt={displayTitle}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-lg text-dark group-hover:text-blue">
                  {displayTitle}
                </h3>
              </Link>
            );
          } else {
            return (
              <Link
                key={item.id}
                href={targetHref}
                className="group bg-white rounded-lg p-4 shadow-1 hover:shadow-2 transition duration-200 flex items-center gap-6"
              >
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-2">
                  <Image
                    src={imageSrc}
                    alt={displayTitle}
                    fill
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-lg text-dark group-hover:text-blue">
                  {displayTitle}
                </h3>
              </Link>
            );
          }
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="bg-white shadow-1 rounded-md p-2 flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded disabled:opacity-50 hover:bg-blue hover:text-white transition"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1.5 text-sm rounded transition ${
                  currentPage === idx + 1
                    ? "bg-blue text-white"
                    : "hover:bg-blue hover:text-white text-dark"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded disabled:opacity-50 hover:bg-blue hover:text-white transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}