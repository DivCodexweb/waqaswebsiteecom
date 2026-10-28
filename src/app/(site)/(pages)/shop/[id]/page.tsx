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
            // Set initial quantity based on minPurchaseQty from schema
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

  const handleAddToCart = () => {
    if (!product) return;

    const minQty = product.minPurchaseQty ? Number(product.minPurchaseQty) : 1;
    if (quantity < minQty) {
      alert(`Minimum purchase quantity for this product is ${minQty}!`);
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
        id: product.id,
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
        status: "available",
        quantity: 1,
      })
    );
    alert("Product added to wishlist! ❤️");
  };

  // Helper to convert regular YouTube link to Embed URL
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
    return <div className="text-center py-20 text-lg font-medium">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-xl font-bold text-red-500">Product not found!</div>;
  }

  let imagesList: string[] = [];
  try {
    const parsed = typeof product.imgs === "string" ? JSON.parse(product.imgs) : product.imgs;
    imagesList = Array.isArray(parsed) ? parsed : parsed?.previews || [];
  } catch {
    imagesList = [];
  }

  const minLimit = product.minPurchaseQty ? Number(product.minPurchaseQty) : 1;

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
      
      <section className="overflow-hidden py-15 lg:py-20 bg-gray-50">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-sm">
            
            {/* Product Images Section */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-[400px] overflow-hidden flex items-center justify-center bg-gray-50 rounded-xl">
                <Image 
                  src={selectedImage || imagesList[0] || "/images/placeholder.jpg"} 
                  alt={product.title} 
                  fill 
                  className="object-contain" 
                />
              </div>

              {imagesList.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {imagesList.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 border rounded-lg overflow-hidden flex-shrink-0 ${selectedImage === img ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-200"}`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info & Attributes Section */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.brandName || "Brand"}
                </span>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{product.title}</h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-emerald-600">RS: {product.discountedPrice || product.price}</span>
                {product.discountedPrice && product.discountedPrice < product.price && (
                  <span className="text-lg text-gray-400 line-through">RS: {product.price}</span>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description || "No description available for this product."}
              </p>

              {/* Attributes (Color, Size from attributes table) */}
              {globalAttributes.length > 0 && (
                <div className="space-y-4 border-t border-b py-4">
                  <h3 className="text-sm font-semibold text-black-800">Select Options:</h3>
                  {globalAttributes.map((attr) => {
                    const valuesList = parseListValues(attr.list);
                    const isColor = attr.title.toLowerCase().includes("color") || attr.title.toLowerCase().includes("rang");

                    return (
                      <div key={attr.id} className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-black-500 uppercase">{attr.title}</span>
                        <div className="flex flex-wrap gap-2.5">
                          {valuesList.map((val: string) => {
                            const isChosen = selectedAttributes[attr.title] === val;

                            return isColor ? (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleAttributeSelect(attr.title, val)}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition ${
                                  isChosen ? "border-blue-600 ring-2 ring-blue-400 bg-blue-50" : "border-black hover:border-black-400"
                                }`}
                              >
                                <span className="w-4 h-4 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: val.trim() }}></span>
                                <span>{val}</span>
                              </button>
                            ) : (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleAttributeSelect(attr.title, val)}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                                  isChosen 
                                    ? "bg-blue-600 text-red border-blue-600 shadow-sm" 
                                    : "bg-black text-gray-700 border-gray-300 hover:border-black"
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

              {/* Quantity & Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setQuantity((q) => Math.max(minLimit, q - 1))}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-semibold text-gray-800">{quantity}</span>
                    <button 
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                    className="flex-1 py-3 px-6 rounded-xl font-bold shadow-lg hover:opacity-90 transition text-white"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={handleAddToWishlist}
                    aria-label="Add to Wishlist"
                    className="p-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition text-gray-700"
                  >
                    ❤️
                  </button>
                </div>
                {minLimit > 1 && (
                  <span className="text-xs text-orange-500 font-medium">
                    * Minimum purchase quantity required: {minLimit} units
                  </span>
                )}
              </div>

              {/* YouTube Video Section */}
              {product.videoLink && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Product Video:</h3>
                  <div className="relative w-full h-[220px] rounded-xl overflow-hidden shadow-sm bg-black">
                    <iframe
                      src={getEmbedUrl(product.videoLink)}
                      title="Product Video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Additional Specs */}
              <div className="text-xs text-gray-400 space-y-1 pt-4 border-t">
                {product.sku && <p>SKU: {product.sku}</p>}
                <p>Stock Available: {product.stock > 0 ? `${product.stock} units` : "Out of stock"}</p>
              </div>

            </div>

          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
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
                      className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition flex flex-col gap-3 group"
                    >
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <Image src={relImg} alt={relProd.title} fill className="object-cover group-hover:scale-105 transition" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-blue-600 transition">
                        {relProd.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">RS{relProd.discountedPrice || relProd.price}</span>
                        {relProd.discountedPrice && relProd.discountedPrice < relProd.price && (
                          <span className="text-xs text-gray-400 line-through">RS{relProd.price}</span>
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