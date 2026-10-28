'use client';

import React, { useState, useEffect } from 'react';

interface Brand {
  id: number;
  title: string;
  img: string;
}

interface Attribute {
  id: number;
  title: string;
  list: string;
}

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState<'brands' | 'attributes'>('brands');

  // Brand State
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [brandTitle, setBrandTitle] = useState('');
  const [brandImg, setBrandImg] = useState('');
  const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Attribute State
  const [attributesList, setAttributesList] = useState<Attribute[]>([]);
  const [attrTitle, setAttrTitle] = useState('');
  const [attrListInput, setAttrListInput] = useState(''); // Comma separated items (e.g. #FF0000, #00FF00)
  const [editingAttrId, setEditingAttrId] = useState<number | null>(null);

  useEffect(() => {
    fetchBrands();
    fetchAttributes();
  }, []);

  // Fetch Brands
  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      if (res.ok) setBrandsList(await res.json());
    } catch (error) {
      console.error('Failed to fetch brands', error);
    }
  };

  // Fetch Attributes
  const fetchAttributes = async () => {
    try {
      const res = await fetch('/api/admin/attributes');
      if (res.ok) setAttributesList(await res.json());
    } catch (error) {
      console.error('Failed to fetch attributes', error);
    }
  };

  // Server-side API ke zariye Image Upload (`/api/upload`)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.secure_url) {
        setBrandImg(data.secure_url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Brand CRUD Actions
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandTitle || !brandImg) return alert('Please enter title and upload image');

    const url = editingBrandId ? `/api/admin/brands/${editingBrandId}` : '/api/admin/brands';
    const method = editingBrandId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: brandTitle, img: brandImg }),
      });

      if (res.ok) {
        setBrandTitle('');
        setBrandImg('');
        setEditingBrandId(null);
        fetchBrands();
      } else {
        alert('Failed to save brand');
      }
    } catch (error) {
      console.error('Error saving brand', error);
    }
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrandId(brand.id);
    setBrandTitle(brand.title);
    setBrandImg(brand.img);
  };

  const handleDeleteBrand = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBrands();
    } catch (error) {
      console.error('Error deleting brand', error);
    }
  };

  // Attribute CRUD Actions
  const handleSaveAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attrTitle || !attrListInput) return alert('Please enter title and list items');

    const formattedList = JSON.stringify(
      attrListInput.split(',').map((item) => item.trim()).filter(Boolean)
    );

    const url = editingAttrId ? `/api/admin/attributes/${editingAttrId}` : '/api/admin/attributes';
    const method = editingAttrId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: attrTitle, list: formattedList }),
      });

      if (res.ok) {
        setAttrTitle('');
        setAttrListInput('');
        setEditingAttrId(null);
        fetchAttributes();
      } else {
        alert('Failed to save attribute');
      }
    } catch (error) {
      console.error('Error saving attribute', error);
    }
  };

  const handleEditAttribute = (attr: Attribute) => {
    setEditingAttrId(attr.id);
    setAttrTitle(attr.title);
    try {
      const parsed = JSON.parse(attr.list);
      setAttrListInput(Array.isArray(parsed) ? parsed.join(', ') : attr.list);
    } catch {
      setAttrListInput(attr.list);
    }
  };

  const handleDeleteAttribute = async (id: number) => {
    if (!confirm('Are you sure you want to delete this attribute?')) return;
    try {
      const res = await fetch(`/api/admin/attributes/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAttributes();
    } catch (error) {
      console.error('Error deleting attribute', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Admin Management Panel</h1>

      {/* Tabs Header */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`py-2 px-6 font-semibold transition-colors ${
            activeTab === 'brands'
              ? 'border-b-2 border-black text-black bg-white rounded-t-lg'
              : 'text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('brands')}
        >
          Brands
        </button>
        <button
          className={`py-2 px-6 font-semibold transition-colors ${
            activeTab === 'attributes'
              ? 'border-b-2 border-black text-black bg-white rounded-t-lg'
              : 'text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('attributes')}
        >
          Attributes
        </button>
      </div>

      {/* TAB 1: BRANDS MANAGEMENT */}
      {activeTab === 'brands' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-black">
              {editingBrandId ? 'Edit Brand' : 'Add New Brand'}
            </h2>
            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Brand Title</label>
                <input
                  type="text"
                  value={brandTitle}
                  onChange={(e) => setBrandTitle(e.target.value)}
                  placeholder="e.g. Samsung, Nike"
                  className="w-full p-2 border rounded focus:outline-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Brand Logo / Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer"
                />
                {uploading && <p className="text-xs text-black font-medium mt-1">Uploading to Cloudinary...</p>}
                {brandImg && (
                  <div className="mt-2">
                    <img src={brandImg} alt="Preview" className="h-20 w-20 object-contain border rounded p-1" />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 font-medium transition disabled:bg-gray-400"
                style={{backgroundColor:"black"}}
                >
                  {editingBrandId ? 'Update Brand' : 'Save Brand'}
                </button>
                {editingBrandId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBrandId(null);
                      setBrandTitle('');
                      setBrandImg('');
                    }}
                    style={{backgroundColor:"black"}}
                    className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Table */}
          <div className="md:col-span-2 bg-white p-5 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-black">Brands List</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100 text-gray-700">
                    <th className="p-3">ID</th>
                    <th className="p-3">Image</th>
                    <th className="p-3">Title</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brandsList.map((brand) => (
                    <tr key={brand.id} className="border-b hover:bg-slate-50 text-gray-800">
                      <td className="p-3 font-mono text-sm">{brand.id}</td>
                      <td className="p-3">
                        <img src={brand.img} alt={brand.title} className="h-10 w-10 object-contain rounded" />
                      </td>
                      <td className="p-3 font-semibold">{brand.title}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleEditBrand(brand)}
                          className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 font-medium"
                        style={{backgroundColor:"black"}}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand.id)}
                          className="bg-zinc-800 text-white px-3 py-1 rounded text-sm hover:bg-black font-medium"
                      style={{backgroundColor:"black"}}
                      >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {brandsList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500">
                        No brands found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTRIBUTES MANAGEMENT */}
      {activeTab === 'attributes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-black">
              {editingAttrId ? 'Edit Attribute' : 'Add New Attribute'}
            </h2>
            <form onSubmit={handleSaveAttribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Attribute Title</label>
                <input
                  type="text"
                  value={attrTitle}
                  onChange={(e) => setAttrTitle(e.target.value)}
                  placeholder="e.g. Color, Size"
                  className="w-full p-2 border rounded focus:outline-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  List Items (Comma separated)
                </label>
                <textarea
                  value={attrListInput}
                  onChange={(e) => setAttrListInput(e.target.value)}
                  placeholder="e.g. #FF0000, #00FF00, #0000FF OR Small, Medium, Large"
                  rows={4}
                  className="w-full p-2 border rounded focus:outline-black text-black"
                />
                <span className="text-xs text-gray-500">Values ko comma (,) se alag karein.</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 font-medium transition"
               style={{backgroundColor:"black"}}
               >
                  {editingAttrId ? 'Update Attribute' : 'Save Attribute'}
                </button>
                {editingAttrId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAttrId(null);
                      setAttrTitle('');
                      setAttrListInput('');
                    }}
                    className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 font-medium"
                 style={{backgroundColor:"black"}}
                 >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Table */}
          <div className="md:col-span-2 bg-white p-5 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-black">Attributes List</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100 text-gray-700">
                    <th className="p-3">ID</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Values</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attributesList.map((attr) => {
                    let items: string[] = [];
                    try {
                      items = JSON.parse(attr.list);
                    } catch {
                      items = attr.list.split(',');
                    }

                    return (
                      <tr key={attr.id} className="border-b hover:bg-slate-50 text-gray-800">
                        <td className="p-3 font-mono text-sm">{attr.id}</td>
                        <td className="p-3 font-semibold">{attr.title}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(items) &&
                              items.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-xs px-2 py-1 rounded border flex items-center gap-1 font-mono text-black"
                                >
                                  {item.startsWith('#') && (
                                    <span
                                      className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                                      style={{ backgroundColor: item }}
                                    ></span>
                                  )}
                                  {item}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleEditAttribute(attr)}
                            className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 font-medium"
                         style={{backgroundColor:"black"}}
                         >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAttribute(attr.id)}
                            className="bg-zinc-800 text-white px-3 py-1 rounded text-sm hover:bg-black font-medium"
                         style={{backgroundColor:"black"}}
                         >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {attributesList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500">
                        No attributes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}