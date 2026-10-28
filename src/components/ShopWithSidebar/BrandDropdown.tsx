"use client";
import React, { useState, useEffect } from "react";

interface Brand {
  id: number | string;
  name?: string;
  title?: string;
}

interface BrandDropdownProps {
  selectedBrands: string[];
  onSelectBrand: (brands: string[]) => void;
  products?: any[];
}

export default function BrandDropdown({ 
  selectedBrands = [], 
  onSelectBrand,
  products = []
}: BrandDropdownProps) {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("/api/admin/brands"); // Apka brands API endpoint
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : json.data || json.brands || [];
          setBrands(list);
        }
      } catch (err) {
        console.error("Failed to fetch brands", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  const getProductCount = (brandId: string | number) => {
    if (!Array.isArray(products)) return 0;
    return products.filter((p) => {
      const pBrandId = p.brandId ?? p.brand_id;
      return pBrandId != null && pBrandId.toString() === brandId.toString();
    }).length;
  };

  const filteredBrands = brands.filter((brand) => {
    const brandName = brand.name || brand.title || "";
    return brandName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleToggleBrand = (brandIdStr: string) => {
    if (selectedBrands.includes(brandIdStr)) {
      onSelectBrand(selectedBrands.filter((id) => id !== brandIdStr));
    } else {
      onSelectBrand([...selectedBrands, brandIdStr]);
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
        <p className="text-dark font-medium">Brand</p>
        <button
          type="button"
          aria-label="button for brand dropdown"
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
          placeholder="Search brand..."
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
              onClick={() => onSelectBrand([])}
              className={`flex items-center justify-between text-left text-sm font-medium ${
                selectedBrands.length === 0 ? "text-blue font-bold" : "text-gray-600 hover:text-blue"
              }`}
            >
              <span>All Brands</span>
              <span className="bg-gray-2 text-dark-4 inline-flex rounded-[30px] text-custom-xs px-2 py-0.5">
                {products.length}
              </span>
            </button>

            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => {
                const brandIdStr = brand.id?.toString();
                const brandName = brand.name || brand.title || "Unnamed";
                const isSelected = selectedBrands.includes(brandIdStr);
                const count = getProductCount(brand.id);

                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => handleToggleBrand(brandIdStr)}
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
                      <span>{brandName}</span>
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
              <p className="text-sm text-gray-400 py-1">No brands found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}