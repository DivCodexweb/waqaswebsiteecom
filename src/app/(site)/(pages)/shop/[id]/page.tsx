"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  const currentId = id ? String(id) : "";
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [globalAttributes, setGlobalAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!currentId) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, attrRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/attributes")
        ]);

        if (prodRes.ok) {
          const json = await prodRes.json();
          const list = Array.isArray(json) ? json : json.data || json.products || [];
          setAllProducts(list);
          const found = list.find((p: any) => p.id?.toString() === currentId);
          setProduct(found || null);

          if (found) {
            const minQty = found.minPurchaseQty ? Number(found.minPurchaseQty) : 1;
            setQuantity(minQty);

            if (found.imgs) {
              try {
                const parsedImgs = JSON.parse(found.imgs);
                const firstImg = parsedImgs?.previews?.[0] || parsedImgs?.[0] || "";
                setSelectedImage(firstImg);
              } catch {
                setSelectedImage("");
              }
            }
          }
        }

        if (attrRes.ok) {
          const attrJson = await attrRes.json();
          const attrList = Array.isArray(attrJson) ? attrJson : attrJson.data || attrJson.attributes || [];
          setGlobalAttributes(attrList);
        }
      } catch (err) {
        console.error("Failed to fetch product details or attributes", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentId]);

  const parseListValues = (listField: any): string[] => {
    if (!listField) return [];
    if (Array.isArray(listField)) return listField.map(String);
    try {
      const parsed = JSON.parse(listField);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return listField.split(",").map((item: string) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const handleAttributeSelect = (attrTitle: string, val: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attrTitle]: val }));
  };

  // Stock logic & handlers
  const availableStock = Number(product?.stock) || 0;
  const isOutOfStock = availableStock <= 0;
  const minLimit = product?.minPurchaseQty ? Number(product.minPurchaseQty) : 1;

  const handleIncreaseQuantity = () => {
    if (quantity >= availableStock) {
      alert(`Only ${availableStock} units available in stock!`);
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((q) => Math.max(minLimit, q - 1));
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setQuantity(minLimit);
      return;
    }
    if (val > availableStock) {
      alert(`Only ${availableStock} units available in stock!`);
      setQuantity(availableStock);
    } else if (val < minLimit) {
      setQuantity(minLimit);
    } else {
      setQuantity(val);
    }
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    if (quantity < minLimit) {
      alert(`Minimum purchase quantity for this product is ${minLimit}!`);
      return;
    }

    if (quantity > availableStock) {
      alert(`Cannot add more than ${availableStock} units available in stock!`);
      return;
    }

    if (globalAttributes.length > 0) {
      for (const attr of globalAttributes) {
        if (!selectedAttributes[attr.title]) {
          alert(`Please select a ${attr.title} before adding to cart!`);
          return;
        }
      }
    }

    dispatch(
      addItemToCart({
        ...product,
        id: Number(product.id),
        discountedPrice: product.discountedPrice ?? product.price,
        imgs: {
          thumbnails: typeof product.imgs === "object" && product.imgs !== null && "thumbnails" in product.imgs ? (product.imgs.thumbnails as string[]) : [],
          previews: typeof product.imgs === "object" && product.imgs !== null && "previews" in product.imgs ? (product.imgs.previews as string[]) : [],
        },
        quantity,
        selectedAttributes,
      })
    );
    alert("Product added to cart successfully! 🛒");
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    dispatch(
      addItemToWishlist({
        ...product,
        id: Number(product.id),
        discountedPrice: product.discountedPrice ?? product.price,
        imgs: {
          thumbnails: typeof product.imgs === "object" && product.imgs !== null && "thumbnails" in product.imgs ? (product.imgs.thumbnails as string[]) : [],
          previews: typeof product.imgs === "object" && product.imgs !== null && "previews" in product.imgs ? (product.imgs.previews as string[]) : [],
        },
        status: "available",
        quantity: 1,
      })
    );
    alert("Product added to wishlist! ❤️");
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    try {
      if (url.includes("embed/")) return url;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1170px] w-full mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-8 rounded-3xl shadow-sm">
          <div className="h-[450px] bg-gray-2 rounded-2xl" />
          <div className="space-y-6 py-4">
            <div className="h-6 bg-gray-2 rounded w-1/4" />
            <div className="h-10 bg-gray-2 rounded w-3/4" />
            <div className="h-8 bg-gray-2 rounded w-1/3" />
            <div className="h-24 bg-gray-2 rounded w-full" />
            <div className="h-12 bg-gray-2 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32 bg-[#f3f4f6]">
        <h2 className="text-2xl font-bold text-gray-800">Product not found!</h2>
        <Link href="/shop" className="mt-4 inline-block bg-blue text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-dark transition">
          Back to Shop
        </Link>
      </div>
    );
  }

  let imagesList: string[] = [];
  try {
    const parsed = typeof product.imgs === "string" ? JSON.parse(product.imgs) : product.imgs;
    imagesList = Array.isArray(parsed) ? parsed : parsed?.previews || [];
  } catch {
    imagesList = [];
  }

  let relatedProducts = allProducts.filter(
    (p) => p.id?.toString() !== product.id?.toString() && 
    (p.categoriesId === product.categoriesId || p.brandId === product.brandId)
  );

  if (relatedProducts.length === 0) {
    relatedProducts = allProducts.filter((p) => p.id?.toString() !== product.id?.toString());
  }
  relatedProducts = relatedProducts.slice(0, 4);

  return (
    <>
      <Breadcrumb title={product.title} pages={["shop", "/", product.title]} />
      
      <section className="overflow-hidden py-12 lg:py-20 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl shadow-xl transition-all duration-300">
            
            {/* Product Images Section */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-[400px] sm:h-[480px] overflow-hidden flex items-center justify-center bg-gray-1 rounded-2xl border border-gray-2 group">
                <Image 
                  src={selectedImage || imagesList[0] || "/images/placeholder.jpg"} 
                  alt={product.title} 
                  fill 
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" 
                />
              </div>

              {imagesList.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {imagesList.map((img, idx) => (
                    <button 
                      key={idx} 
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 border-2 rounded-xl overflow-hidden flex-shrink-0 transition-all cursor-pointer ${selectedImage === img ? "border-blue scale-95 shadow-md" : "border-gray-2 hover:border-gray-400"}`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info & Attributes Section */}
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-blue bg-blue/10 px-3.5 py-1.5 rounded-full inline-block">
                    {product.brandName || "Brand Collection"}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mt-3 leading-tight">{product.title}</h1>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-extrabold text-dark">${product.discountedPrice || product.price}</span>
                  {product.discountedPrice && product.discountedPrice < product.price && (
                    <span className="text-lg text-dark-4 line-through">${product.price}</span>
                  )}
                </div>

                <p className="text-dark-4 text-sm sm:text-base leading-relaxed">
                  {product.description || "No description available for this product."}
                </p>

                {/* Attributes Selection */}
                {globalAttributes.length > 0 && (
                  <div className="space-y-4 border-t border-b border-gray-3 py-5">
                    <h3 className="text-sm font-semibold text-dark">Select Options:</h3>
                    {globalAttributes.map((attr) => {
                      const valuesList = parseListValues(attr.list);
                      const isColor = attr.title.toLowerCase().includes("color") || attr.title.toLowerCase().includes("rang");

                      return (
                        <div key={attr.id} className="flex flex-col gap-2">
                          <span className="text-xs font-bold text-dark uppercase tracking-wide">{attr.title}</span>
                          <div className="flex flex-wrap gap-2.5">
                            {valuesList.map((val: string) => {
                              const isChosen = selectedAttributes[attr.title] === val;

                              return isColor ? (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => handleAttributeSelect(attr.title, val)}
                                  className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                    isChosen ? "border-blue ring-2 ring-blue/20 bg-blue/5 text-blue" : "border-gray-3 hover:border-dark"
                                  }`}
                                >
                                  <span className="w-4 h-4 rounded-full border border-gray-3 inline-block shadow-inner" style={{ backgroundColor: val.trim() }}></span>
                                  <span>{val}</span>
                                </button>
                              ) : (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => handleAttributeSelect(attr.title, val)}
                                  className={`px-4 py-2 border rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                    isChosen 
                                      ? "bg-blue text-white border-blue shadow-md" 
                                      : "bg-gray-1 text-dark border-gray-3 hover:border-dark"
                                  }`}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quantity & Actions with Stock Limits */}
              <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-gray-3">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-gray-3 rounded-xl overflow-hidden bg-gray-1">
                    <button 
                      type="button"
                      disabled={isOutOfStock || quantity <= minLimit}
                      onClick={handleDecreaseQuantity}
                      className="px-4 py-3 bg-gray-2 hover:bg-gray-3 text-dark font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    
                    <input
                      type="number"
                      value={quantity}
                      disabled={isOutOfStock}
                      onChange={handleQuantityInputChange}
                      min={minLimit}
                      max={availableStock}
                      className="w-16 text-center py-3 font-semibold text-dark bg-transparent focus:outline-none"
                    />

                    <button 
                      type="button"
                      disabled={isOutOfStock || quantity >= availableStock}
                      onClick={handleIncreaseQuantity}
                      className="px-4 py-3 bg-gray-2 hover:bg-gray-3 text-dark font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-xl font-bold bg-blue text-white shadow-lg shadow-blue/20 hover:bg-blue-dark transition-all duration-200 cursor-pointer text-center disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToWishlist}
                    aria-label="Add to Wishlist"
                    className="p-3.5 border border-gray-3 rounded-xl bg-white hover:bg-gray-1 transition shadow-sm text-dark cursor-pointer flex items-center justify-center"
                  >
                    ❤️
                  </button>
                </div>

                {/* Stock Warning Messages */}
                {isOutOfStock ? (
                  <span className="text-xs text-red-500 font-medium">
                    * This product is currently out of stock.
                  </span>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-emerald-600 font-medium">
                      * In Stock: {availableStock} units available
                    </span>
                    {minLimit > 1 && (
                      <span className="text-xs text-orange-500 font-medium">
                        * Minimum purchase requirement: {minLimit} units
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* YouTube Video Section */}
              {product.videoLink && (
                <div className="mt-6 pt-6 border-t border-gray-3">
                  <h3 className="text-sm font-semibold text-dark mb-3">Product Video:</h3>
                  <div className="relative w-full h-[220px] rounded-2xl overflow-hidden shadow-sm bg-black">
                    <iframe
                      src={getEmbedUrl(product.videoLink)}
                      title="Product Video"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Additional Specs */}
              <div className="text-xs text-dark-4 space-y-1 pt-6 mt-6 border-t border-gray-3">
                {product.sku && <p>SKU: <span className="font-medium text-dark">{product.sku}</span></p>}
                <p>Stock Status: <span className={`font-medium ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>{product.stock > 0 ? `${product.stock} units available` : "Out of stock"}</span></p>
              </div>

            </div>

          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-dark mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProd) => {
                  let relImg = "/images/placeholder.jpg";
                  try {
                    const pImg = typeof relProd.imgs === "string" ? JSON.parse(relProd.imgs) : relProd.imgs;
                    relImg = pImg?.previews?.[0] || pImg?.[0] || "/images/placeholder.jpg";
                  } catch {
                    relImg = "/images/placeholder.jpg";
                  }

                  return (
                    <Link 
                      key={relProd.id} 
                      href={`/shop/${relProd.id}`}
                      className="bg-white p-5 rounded-2xl border border-gray-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 group"
                    >
                      <div className="relative w-full h-52 bg-gray-1 rounded-xl overflow-hidden flex items-center justify-center">
                        <Image src={relImg} alt={relProd.title} fill className="object-contain p-2 group-hover:scale-105 transition duration-300" />
                      </div>
                      <h3 className="font-semibold text-dark text-base line-clamp-1 group-hover:text-blue transition">
                        {relProd.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-dark text-lg">${relProd.discountedPrice || relProd.price}</span>
                        {relProd.discountedPrice && relProd.discountedPrice < relProd.price && (
                          <span className="text-xs text-dark-4 line-through">${relProd.price}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
}