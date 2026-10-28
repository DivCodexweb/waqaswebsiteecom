"use client";
import React, { useState, useMemo } from "react";
import FilterTopBar from "./FilterTopBar";
import SingleGridItem from "./SingleGridItem";
import SingleListItem from "./SingleListItem";

export default function ProductListing({ initialItems }: { initialItems: any[] }) {
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredItems = useMemo(() => {
    if (!initialItems) return [];
    return initialItems.filter((item) =>
      item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialItems, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <FilterTopBar
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        productStyle={productStyle}
        setProductStyle={setProductStyle}
        totalItems={filteredItems.length}
        showingItems={currentProducts.length}
      />

      <div
        className={
          productStyle === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9"
            : "flex flex-col gap-7.5"
        }
      >
        {currentProducts.map((item) => {
          let parsedImgs = item.imgs;
          try {
            parsedImgs = typeof item.imgs === "string" ? JSON.parse(item.imgs) : item.imgs;
          } catch {
            parsedImgs = [];
          }

          const formattedItem = { ...item, imgs: parsedImgs };

          return productStyle === "grid" ? (
            <SingleGridItem item={formattedItem} key={item.id} />
          ) : (
            <SingleListItem item={formattedItem} key={item.id} />
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="bg-white shadow-1 rounded-md p-2 flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded disabled:opacity-50 bg-neutral-900 text-white hover:bg-neutral-800 transition"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1.5 text-sm rounded transition ${
                  currentPage === idx + 1
                    ? "bg-neutral-900 text-white"
                    : "hover:bg-gray-100 text-black"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded disabled:opacity-50 bg-neutral-900 text-white hover:bg-neutral-800 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}