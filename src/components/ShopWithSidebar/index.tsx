"use client";
import React, { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import CategoryDropdown from "./CategoryDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import BrandDropdown from "./BrandDropdown";

const ShopWithSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  // Data States & Loading State
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States synced with URL query params
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    searchParams.get("category") ? searchParams.get("category")!.split(",") : []
  );
  const [selectedGender, setSelectedGender] = useState(searchParams.get("gender") || "");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "0");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brand") ? searchParams.get("brand")!.split(",") : []
  );
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(
    searchParams.get("attribute") ? searchParams.get("attribute")!.split(",") : []
  );

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  // Fetch Products from Database API
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const prodRes = await fetch("/api/admin/products");
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(Array.isArray(prodData) ? prodData : prodData.products || prodData.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Sync filters with URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory.length > 0) params.set("category", selectedCategory.join(","));
    if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));
    if (selectedAttributes.length > 0) params.set("attribute", selectedAttributes.join(","));
    if (selectedGender) params.set("gender", selectedGender);
    if (sortOption) params.set("sort", sortOption);

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }, [selectedCategory, selectedBrands, selectedAttributes, selectedGender, sortOption, router]);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);

  // Filter & Sort Products Logic
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const result = products.filter((item) => {
      let matchesCategory = true;
      if (selectedCategory.length > 0) {
        const itemCatId = item.categoriesId ?? item.categoryId ?? item.category_id ?? item.category;
        matchesCategory = itemCatId != null && selectedCategory.includes(itemCatId.toString());
      }

      let matchesBrand = true;
      if (selectedBrands.length > 0) {
        const itemBrandId = item.brandId ?? item.brand_id;
        matchesBrand = itemBrandId != null && selectedBrands.includes(itemBrandId.toString());
      }

      let matchesAttribute = true;
      if (selectedAttributes.length > 0) {
        if (!item.attributesList) {
          matchesAttribute = false;
        } else {
          try {
            const parsedAttrs = typeof item.attributesList === "string"
              ? JSON.parse(item.attributesList)
              : item.attributesList;

            matchesAttribute = selectedAttributes.some((selectedAttr) => {
              return parsedAttrs.some((attrVal: any) => {
                if (typeof attrVal === "string") return attrVal.toLowerCase() === selectedAttr.toLowerCase();
                return attrVal.name?.toLowerCase() === selectedAttr.toLowerCase() || attrVal.value?.toLowerCase() === selectedAttr.toLowerCase();
              });
            });
          } catch {
            matchesAttribute = false;
          }
        }
      }

      return matchesCategory && matchesBrand && matchesAttribute;
    });

    // Sorting Logic
    return result.sort((a, b) => {
      if (sortOption === "1") {
        // Best Selling / Popularity
        return (b.reviews || 0) - (a.reviews || 0);
      } else if (sortOption === "2") {
        // Old Products
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      } else {
        // Latest Products (Default: "0")
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });
  }, [products, selectedCategory, selectedBrands, selectedAttributes, selectedGender, sortOption]);

  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  const handleCleanAll = () => {
    setSelectedCategory([]);
    setSelectedBrands([]);
    setSelectedGender("");
    setSelectedAttributes([]);
    setSortOption("0");
  };

  return (
    <>
      <Breadcrumb
        title={"Explore All Products"}
        pages={["shop", "/", "shop with sidebar"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto shadow-lg"
                  : "-translate-x-full xl:translate-x-0"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
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
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-dark">Filters:</p>
                      <button type="button" onClick={handleCleanAll} className="text-blue text-sm cursor-pointer hover:underline">
                        Clean All
                      </button>
                    </div>
                  </div>

                  {/* <!-- category box --> */}
                  <CategoryDropdown
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cats) => setSelectedCategory(cats)}
                    products={products}
                  />

                  {/* <!-- brand box --> */}
                  <BrandDropdown
                    selectedBrands={selectedBrands}
                    onSelectBrand={(brands) => setSelectedBrands(brands)}
                    products={products}
                  />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
                  <div className="flex flex-wrap items-center gap-4">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="p-2 border rounded text-sm text-black bg-white focus:outline-black cursor-pointer"
                    >
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <p className="text-sm">
                      Showing <span className="text-dark font-semibold">{isLoading ? "..." : filteredProducts.length}</span> Products
                    </p>
                  </div>

                  {/* <!-- top bar right --> */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="button for product grid tab"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white cursor-pointer`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="button for product list tab"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white cursor-pointer`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- Products Grid Tab Content Start --> */}
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
              >
                {isLoading ? (
                  // Loading Skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className={productStyle === "grid" ? "group animate-pulse" : "group rounded-lg bg-white shadow-1 animate-pulse p-4"}>
                      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-gray-2 min-h-[270px] mb-4" />
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-2 rounded w-1/3"></div>
                        <div className="h-5 bg-gray-2 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-2 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((item, key) =>
                    productStyle === "grid" ? (
                      <SingleGridItem item={item} key={key} />
                    ) : (
                      <SingleListItem item={item} key={key} />
                    )
                  )
                ) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-700">No products found matching your filters.</h3>
                  </div>
                )}
              </div>
              {/* <!-- Products Grid Tab Content End --> */}

            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;