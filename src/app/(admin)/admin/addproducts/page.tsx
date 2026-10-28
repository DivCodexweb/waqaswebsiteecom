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
  SearchCheck,
  Trash2,
  Edit,
  Plus,
  CheckCircle2,
  XCircle,
  Video,
  X,
  ChevronDown,
  Sparkles,
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

  // Filter Subcategories dynamically
  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return subcategories.filter(
      (sub: any) => sub.categoryId?.toString() === formData.categoryId.toString()
    );
  }, [subcategories, formData.categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Images Upload with 500KB limit
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <PackagePlus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-500">Manage your store catalog and product inventory</p>
          </div>
        </div>
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

      {/* PORTION 7: Existing Products Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3 text-gray-800 font-semibold text-lg">
          <SearchCheck className="w-5 h-5 text-blue-600" />
          <h2>Existing Products List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                <th className="p-3">Title</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Refundable</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-gray-400">
                    No products added yet.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
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
                    <td className="p-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 font-medium"
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
      </div>
    </div>
  );
}