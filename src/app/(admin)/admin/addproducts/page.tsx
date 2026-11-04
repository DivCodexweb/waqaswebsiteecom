"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  PackagePlus,
  Tag,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Sliders,
  FileText,
  Trash2,
  Edit,
  Plus,
  CheckCircle2,
  Video,
  X,
  ChevronDown,
  Sparkles,
  Search,
  List,
  Filter,
} from "lucide-react";

// Reusable Searchable Dropdown Component
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
  disabled = false,
}: {
  options: { id: string | number; title: string }[];
  value: string;
  onChange: (id: string, title: string) => void;
  placeholder: string;
  label: string;
  icon?: any;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id.toString() === value);

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
        {Icon && <Icon className="w-4 h-4 text-blue-600" />}
        {label}
      </label>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full border border-gray-300 p-2.5 rounded-lg cursor-pointer bg-white flex justify-between items-center transition shadow-sm hover:border-blue-400 ${
          disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""
        }`}
      >
        <span className={selectedOption ? "text-gray-900 font-medium" : "text-gray-400"}>
          {selectedOption ? selectedOption.title : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-white border-b">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-sm text-gray-500 text-center">No results found</div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(opt.id.toString(), opt.title);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className={`p-2.5 text-sm cursor-pointer transition hover:bg-blue-50 ${
                  opt.id.toString() === value
                    ? "bg-blue-100 font-semibold text-blue-700"
                    : "text-gray-700"
                }`}
              >
                {opt.title}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductAdminPage() {
  const [products, setProducts] = useState<any[]>([]);

  // Metadata dropdown state
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Images State (Max 15, Max 500KB)
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");

  // Modal Popup & Filter / Pagination States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterBrandId, setFilterBrandId] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterSubcategoryId, setFilterSubcategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    discountedPrice: 0,
    discountType: "percent",
    discountExpiry: "",
    purchasePrice: 0,
    stock: 0,
    minPurchaseQty: 1,
    sku: "",
    brandId: "",
    brandName: "",
    categoryId: "",
    subcategoryId: "",
    selectedAttributes: [] as string[],
    isRefundable: "yes",
    videoLink: "",
    description: "",
    metaTags: "",
    metaDescription: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchDropdownData();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const result = await res.json();
      if (result.success) setProducts(result.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url);
          const text = await res.text();
          if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) return [];
          const json = JSON.parse(text);
          return json.success ? json.data : Array.isArray(json) ? json : [];
        } catch {
          return [];
        }
      };

      const [brandsData, catData, subCatData, attrData] = await Promise.all([
        safeFetch("/api/admin/brands"),
        safeFetch("/api/admin/category"),
        safeFetch("/api/admin/subcategory"),
        safeFetch("/api/admin/attributes"),
      ]);

      setBrands(brandsData);
      setCategories(catData);
      setSubcategories(subCatData);
      setAttributes(attrData);
    } catch (error) {
      console.error("Failed to fetch dropdown metadata", error);
    }
  };

  // Filter Subcategories dynamically for Form
  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return subcategories.filter(
      (sub: any) => sub.categoryId?.toString() === formData.categoryId.toString()
    );
  }, [subcategories, formData.categoryId]);

  // Filter Subcategories dynamically for Modal Filter
  const modalFilteredSubcategories = useMemo(() => {
    if (!filterCategoryId) return [];
    return subcategories.filter(
      (sub: any) => sub.categoryId?.toString() === filterCategoryId.toString()
    );
  }, [subcategories, filterCategoryId]);

  // Modal Advanced Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(searchTitle.toLowerCase());
      const matchBrand = filterBrandId ? p.brandId?.toString() === filterBrandId : true;
      const matchCategory = filterCategoryId ? p.categoriesId?.toString() === filterCategoryId : true;
      const matchSubcategory = filterSubcategoryId ? p.subcategoryId?.toString() === filterSubcategoryId : true;
      return matchTitle && matchBrand && matchCategory && matchSubcategory;
    });
  }, [products, searchTitle, filterBrandId, filterCategoryId, filterSubcategoryId]);

  // Pagination Logic (20 Items Per Page)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const files = e.target.files;
    if (!files) return;

    if (selectedImages.length + files.length > 15) {
      setImageError("Maximum 15 images can be uploaded!");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 500 * 1024) {
        setImageError(`File "${file.name}" exceeds 500KB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttributeToggle = (attrTitle: string) => {
    setFormData((prev) => {
      const exists = prev.selectedAttributes.includes(attrTitle);
      if (exists) {
        return { ...prev, selectedAttributes: prev.selectedAttributes.filter((a) => a !== attrTitle) };
      } else {
        return { ...prev, selectedAttributes: [...prev.selectedAttributes, attrTitle] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing && currentId !== null ? `/api/admin/products/${currentId}` : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        ...formData,
        categoriesId: formData.categoryId ? parseInt(formData.categoryId) : null,
        subcategoryId: formData.subcategoryId ? parseInt(formData.subcategoryId) : null,
        brandId: formData.brandId ? parseInt(formData.brandId) : null,
        attributesList: JSON.stringify(formData.selectedAttributes),
        imgs: JSON.stringify(selectedImages),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        alert(isEditing ? "Product updated successfully! 🎉" : "Product added successfully! 🎉");
        fetchProducts();
        resetForm();
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setIsEditing(true);
    setCurrentId(product.id);

    let matchedCatId = "";
    if (product.categoriesId) {
      matchedCatId = product.categoriesId.toString();
    } else if (product.subcategoryId) {
      const matchedSub = subcategories.find((s: any) => s.id === product.subcategoryId);
      if (matchedSub) matchedCatId = matchedSub.categoryId?.toString() || "";
    }

    setFormData({
      title: product.title || "",
      price: product.price || 0,
      discountedPrice: product.discountedPrice || 0,
      discountType: product.discountType || "percent",
      discountExpiry: product.discountExpiry || "",
      purchasePrice: product.purchasePrice || 0,
      stock: product.stock || 0,
      minPurchaseQty: product.minPurchaseQty || 1,
      sku: product.sku || "",
      brandId: product.brandId ? product.brandId.toString() : "",
      brandName: product.brandName || "",
      categoryId: matchedCatId,
      subcategoryId: product.subcategoryId ? product.subcategoryId.toString() : "",
      selectedAttributes: product.attributesList ? JSON.parse(product.attributesList) : [],
      isRefundable: product.isRefundable || "yes",
      videoLink: product.videoLink || "",
      description: product.description || "",
      metaTags: product.metaTags || "",
      metaDescription: product.metaDescription || "",
    });

    try {
      setSelectedImages(product.imgs ? JSON.parse(product.imgs) : []);
    } catch {
      setSelectedImages([]);
    }

    setIsModalOpen(false); // Close Modal when Editing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        const result = await res.json();

        if (result.success) {
          setProducts(products.filter((p) => p.id !== id));
          alert("Product deleted!");
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product", error);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setSelectedImages([]);
    setFormData({
      title: "",
      price: 0,
      discountedPrice: 0,
      discountType: "percent",
      discountExpiry: "",
      purchasePrice: 0,
      stock: 0,
      minPurchaseQty: 1,
      sku: "",
      brandId: "",
      brandName: "",
      categoryId: "",
      subcategoryId: "",
      selectedAttributes: [],
      isRefundable: "yes",
      videoLink: "",
      description: "",
      metaTags: "",
      metaDescription: "",
    });
  };

  const clearModalFilters = () => {
    setSearchTitle("");
    setFilterBrandId("");
    setFilterCategoryId("");
    setFilterSubcategoryId("");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Top Header Bar with Open Modal Button */}
      <div 
        className="w-full bg-black text-white p-6 rounded-2xl shadow-md border border-gray-800 flex items-center justify-between my-6" 
        style={{ background: "linear-gradient(90deg, #1e293b, #0f172a)" }}
      >
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-gray-900 text-white rounded-xl border border-gray-700 flex-shrink-0">
            <PackagePlus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage your store catalog and product inventory
            </p>
          </div>
        </div>

        {/* Top Button to Open Products List Modal */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg transition"
        >
          <List className="w-5 h-5" />
          <span>View Products ({products.length})</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PORTION 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 text-blue-600 font-semibold text-lg">
            <Tag className="w-5 h-5" />
            <h2>1. Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Wireless Noise Canceling Headphones"
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">SKU Code</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. PRD-99812"
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* PORTION 2: Brand & Category Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 text-purple-600 font-semibold text-lg">
            <Layers className="w-5 h-5" />
            <h2>2. Category & Brand Association</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchableSelect
              label="Brand"
              placeholder="-- Choose Brand --"
              options={brands}
              value={formData.brandId}
              onChange={(id, title) => setFormData((prev) => ({ ...prev, brandId: id, brandName: title }))}
            />

            <SearchableSelect
              label="Category"
              placeholder="-- Choose Category --"
              options={categories}
              value={formData.categoryId}
              onChange={(id) => setFormData((prev) => ({ ...prev, categoryId: id, subcategoryId: "" }))}
            />

            <SearchableSelect
              label="Subcategory"
              placeholder="-- Choose Subcategory --"
              options={filteredSubcategories}
              value={formData.subcategoryId}
              disabled={!formData.categoryId}
              onChange={(id) => setFormData((prev) => ({ ...prev, subcategoryId: id }))}
            />
          </div>
        </div>

        {/* PORTION 3: Pricing & Stock */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 text-emerald-600 font-semibold text-lg">
            <DollarSign className="w-5 h-5" />
            <h2>3. Pricing, Discounts & Inventory</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Regular Price (PKR) *</label>
              <input
                type="number"
                step="any"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discounted Price (PKR)</label>
              <input
                type="number"
                step="any"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Type</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (PKR)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Expiry</label>
              <input
                type="date"
                name="discountExpiry"
                value={formData.discountExpiry}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Purchase Price (Cost)</label>
              <input
                type="number"
                step="any"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Min Purchase Qty</label>
              <input
                type="number"
                name="minPurchaseQty"
                value={formData.minPurchaseQty}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Is Refundable?</label>
              <select
                name="isRefundable"
                value={formData.isRefundable}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="yes">Yes (Refundable)</option>
                <option value="no">No (Non-refundable)</option>
              </select>
            </div>
          </div>
        </div>

        {/* PORTION 4: Media & Gallery */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 text-amber-600 font-semibold text-lg">
            <ImageIcon className="w-5 h-5" />
            <h2>4. Images & Video Gallery</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Images (Max 15, Max 500KB per image)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
              />
              {imageError && <p className="text-red-500 text-xs mt-1 font-medium">{imageError}</p>}
              <p className="text-xs text-gray-400 mt-1">Uploaded: {selectedImages.length} / 15</p>
            </div>

            {/* Image Previews */}
            {selectedImages.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {selectedImages.map((imgSrc, idx) => (
                  <div key={idx} className="relative w-24 h-24 border rounded-xl overflow-hidden shadow-sm group">
                    <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Video className="w-4 h-4 text-amber-600" /> Video Link (YouTube / MP4)
              </label>
              <input
                type="text"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=example"
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* PORTION 5: Attributes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 text-indigo-600 font-semibold text-lg">
            <Sliders className="w-5 h-5" />
            <h2>5. Select Product Attributes</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {attributes.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No attributes found in system.</p>
            ) : (
              attributes.map((attr: any) => {
                const isSelected = formData.selectedAttributes.includes(attr.title);
                return (
                  <label
                    key={attr.id}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer transition text-sm font-medium ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAttributeToggle(attr.title)}
                      className="hidden"
                    />
                    {isSelected ? <CheckCircle2 className="w-4 h-4 text-indigo-600" /> : <div className="w-4 h-4 border border-gray-300 rounded-full" />}
                    {attr.title}
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* PORTION 6: Descriptions & SEO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 text-rose-600 font-semibold text-lg">
            <FileText className="w-5 h-5" />
            <h2>6. Detailed Description & SEO Metadata</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Write detailed specs and overview..."
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Tags (Comma separated)</label>
                <input
                  type="text"
                  name="metaTags"
                  value={formData.metaTags}
                  onChange={handleChange}
                  placeholder="headphones, wireless, audio"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
                <input
                  type="text"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="SEO summary for search engines"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="flex justify-end gap-4">
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition"
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50"
            style={{ backgroundColor: "black" }}
          >
            {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {isEditing ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>

      {/* POPUP MODAL FOR EXISTING PRODUCTS LIST */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-gray-900 text-black flex items-center justify-between">
              <div className="flex items-center gap-3">
                <List className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold">Existing Products List ({filteredProducts.length})</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-black-800 text-black-400 hover:text-black transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Filters Section */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filter Products</span>
                {(searchTitle || filterBrandId || filterCategoryId || filterSubcategoryId) && (
                  <button
                    onClick={clearModalFilters}
                    className="text-xs text-red-600 hover:underline ml-auto"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Search Title */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Title..."
                    value={searchTitle}
                    onChange={(e) => { setSearchTitle(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Filter Brand */}
                <select
                  value={filterBrandId}
                  onChange={(e) => { setFilterBrandId(e.target.value); setCurrentPage(1); }}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((b: any) => (
                    <option key={b.id} value={b.id.toString()}>{b.title}</option>
                  ))}
                </select>

                {/* Filter Category */}
                <select
                  value={filterCategoryId}
                  onChange={(e) => { setFilterCategoryId(e.target.value); setFilterSubcategoryId(""); setCurrentPage(1); }}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id.toString()}>{c.title}</option>
                  ))}
                </select>

                {/* Filter Subcategory */}
                <select
                  value={filterSubcategoryId}
                  onChange={(e) => { setFilterSubcategoryId(e.target.value); setCurrentPage(1); }}
                  disabled={!filterCategoryId}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">All Subcategories</option>
                  {modalFilteredSubcategories.map((s: any) => (
                    <option key={s.id} value={s.id.toString()}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Table Body */}
            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b text-gray-700 text-sm">
                    <th className="p-3">Title</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Refundable</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-gray-400">
                        No products match your filter parameters.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="p-3 font-semibold text-gray-800">{product.title}</td>
                        <td className="p-3 text-gray-500">{product.brandName || "N/A"}</td>
                        <td className="p-3 font-medium text-emerald-600">PKR {product.price}</td>
                        <td className="p-3 text-gray-600">{product.stock}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              product.isRefundable === "yes"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.isRefundable}
                          </span>
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 font-medium bg-red-50 px-3 py-1.5 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Pagination Footer */}
            <div className="p-4 bg-gray-100 border-t border-gray-200 flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                Page {currentPage} of {totalPages} ({filteredProducts.length} Total Items)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-semibold text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-semibold text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}