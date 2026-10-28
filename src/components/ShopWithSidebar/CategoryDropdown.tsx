"use client";
import React, { useState, useEffect } from "react";

interface Category {
  id: number | string;
  name?: string;
  title?: string;
}

interface CategoryDropdownProps {
  selectedCategory: string[]; // <-- Array kar diya hai
  onSelectCategory: (categories: string[]) => void;
  products?: any[];
}

export default function CategoryDropdown({ 
  selectedCategory = [], 
  onSelectCategory,
  products = []
}: CategoryDropdownProps) {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/category");
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : json.data || json.categories || [];
          setCategories(list);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const getProductCount = (catId: string | number) => {
    if (!Array.isArray(products)) return 0;
    return products.filter((p) => {
      const pCatId = p.categoriesId ?? p.categoryId ?? p.category_id ?? p.category;
      return pCatId != null && pCatId.toString() === catId.toString();
    }).length;
  };

  const filteredCategories = categories.filter((cat) => {
    const catName = cat.name || cat.title || "";
    return catName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Multiple selection toggle handler
  const handleToggleCategory = (catIdStr: string) => {
    if (selectedCategory.includes(catIdStr)) {
      // Agar pehle se selected hai toh hata dein
      onSelectCategory(selectedCategory.filter((id) => id !== catIdStr));
    } else {
      // Agar select nahi hai toh add kar dein
      onSelectCategory([...selectedCategory, catIdStr]);
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-lg overflow-hidden">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter border-b border-gray-2"
        }`}
      >
        <p className="text-dark font-medium">Category</p>
        <button
          type="button"
          aria-label="button for category dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && "rotate-180"
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div
        className={`flex-col gap-3 py-4 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        <input
          type="text"
          placeholder="Search category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-3 rounded focus:outline-black text-black mb-2"
        />

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => onSelectCategory([])}
              className={`flex items-center justify-between text-left text-sm font-medium ${
                selectedCategory.length === 0 ? "text-blue font-bold" : "text-gray-600 hover:text-blue"
              }`}
            >
              <span>All Categories</span>
              <span className="bg-gray-2 text-dark-4 inline-flex rounded-[30px] text-custom-xs px-2 py-0.5">
                {products.length}
              </span>
            </button>

            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const catIdStr = category.id?.toString();
                const catName = category.name || category.title || "Unnamed";
                const isSelected = selectedCategory.includes(catIdStr);
                const count = getProductCount(category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleToggleCategory(catIdStr)}
                    className={`${
                      isSelected ? "text-blue font-semibold" : "text-gray-700"
                    } group w-full flex items-center justify-between ease-out duration-200 hover:text-blue text-left text-sm`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
                          isSelected ? "border-blue bg-blue" : "bg-white border-gray-3"
                        }`}
                      >
                        <svg
                          className={isSelected ? "block" : "hidden"}
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                            stroke="white"
                            strokeWidth="1.94437"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span>{catName}</span>
                    </div>

                    <span
                      className={`${
                        isSelected ? "text-white bg-blue" : "bg-gray-2 text-dark-4"
                      } inline-flex rounded-[30px] text-custom-xs px-2 py-0.5`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-gray-400 py-1">No categories found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}