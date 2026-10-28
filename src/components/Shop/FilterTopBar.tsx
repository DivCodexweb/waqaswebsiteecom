"use client";
import React from "react";
import CustomSelect from "@/components/ShopWithSidebar/CustomSelect";

interface FilterTopBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  productStyle: "grid" | "list";
  setProductStyle: (style: "grid" | "list") => void;
  totalItems: number;
  showingItems: number;
}

export default function FilterTopBar({
  searchQuery,
  setSearchQuery,
  productStyle,
  setProductStyle,
  totalItems,
  showingItems,
}: FilterTopBarProps) {
  const sortOptions = [
    { label: "Latest", value: "0" },
    { label: "Popularity", value: "1" },
    { label: "Oldest", value: "2" },
  ];

  return (
    <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: Search, Sort Dropdown & Count */}
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-3 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue"
          />

          <CustomSelect options={sortOptions} />

          <p className="text-sm text-gray-6">
            Showing <span className="text-dark font-medium">{showingItems}</span> of{" "}
            <span className="text-dark font-medium">{totalItems}</span> Items
          </p>
        </div>

        {/* Right Side: Grid vs List View Icon Buttons */}
        <div className="flex items-center gap-2">
          {/* Grid View Icon Button */}
          <button
            onClick={() => setProductStyle("grid")}
            aria-label="Grid View"
            className={`p-2 rounded-md border transition-colors ${
              productStyle === "grid"
                ? "bg-blue border-blue text-white"
                : "bg-gray-1 border-gray-3 text-dark hover:border-blue"
            }`}
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 2h7v7H2V2zm9 0h7v7h-7V2zm0 9h7v7h-7v-7zm-9 0h7v7H2v-7z" />
            </svg>
          </button>

          {/* List View Icon Button */}
          <button
            onClick={() => setProductStyle("list")}
            aria-label="List View"
            className={`p-2 rounded-md border transition-colors ${
              productStyle === "list"
                ? "bg-blue border-blue text-white"
                : "bg-gray-1 border-gray-3 text-dark hover:border-blue"
            }`}
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}