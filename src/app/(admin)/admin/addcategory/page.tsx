'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Category {
  id: number;
  title: string;
  img: string;
}

export default function CategoryAdminPage() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentImgUrl, setCurrentImgUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  // Fetch Categories List
  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/category');
      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setCategoriesList(result.data);
        } else if (Array.isArray(result)) {
          setCategoriesList(result);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle('');
    setImage(null);
    setEditingId(null);
    setCurrentImgUrl('');
    setFileInputKey(Date.now());
  };

  const handleEditClick = (item: Category) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCurrentImgUrl(item.img);
    setImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/category?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete category');
      }
    } catch (err) {
      alert('An error occurred while deleting.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || (!image && !editingId)) {
      alert('Please fill all required fields.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    if (image) formData.append('image', image);
    if (editingId) formData.append('id', String(editingId));

    try {
      const endpoint = '/api/admin/category';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, { method, body: formData });

      if (res.ok) {
        resetForm();
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save category');
      }
    } catch (err) {
      alert('An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden py-12 bg-gray-100 min-h-screen">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* Top Header */}
        <div className="text-center mb-10">
          <h1 className="font-semibold text-2xl sm:text-3xl text-gray-800 mb-1.5">
            Category Management
          </h1>
          <p className="text-gray-500 text-sm">Add, update or remove categories</p>
        </div>

        {/* --- FORM CONTAINER --- */}
        <div className="max-w-[700px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-8 mb-12 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg text-gray-800">
              {editingId ? 'Edit Category' : 'Create Category'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-gray-500 hover:text-gray-800 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="mb-5">
              <label htmlFor="title" className="block mb-2.5 font-medium text-gray-700 text-sm">
                Category Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter category title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg border border-gray-300 bg-gray-50 text-gray-800 w-full py-2.5 px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            {/* Image Upload Input */}
            <div className="mb-6">
              <label className="block mb-2.5 font-medium text-gray-700 text-sm">
                Category Image
              </label>

              {editingId && currentImgUrl && (
                <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200 w-fit">
                  <div className="w-10 h-10 relative rounded overflow-hidden bg-white border">
                    <Image src={currentImgUrl} alt="Preview" fill className="object-contain" />
                  </div>
                  <span className="text-xs text-gray-500">Current Active Image</span>
                </div>
              )}

              <input
                key={fileInputKey}
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-sm w-full py-2 px-3 outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-800 file:text-white hover:file:bg-blue-600 cursor-pointer"
                required={!editingId}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-black bg-black-900 py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : editingId ? 'Update Category' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* --- DATA TABLE GRID --- */}
        <div className="rounded-xl bg-white shadow-md p-4 sm:p-7.5 overflow-hidden border border-gray-200">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800">Categories List</h3>
            <span className="text-xs text-gray-500">Total: {categoriesList.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 font-medium text-xs uppercase">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
                {categoriesList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categoriesList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 duration-150">
                      <td className="py-3.5 px-4">
                        <div className="w-12 h-12 relative rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                          <Image
                            src={item.img}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{item.title}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="text-xs bg-gray-800 hover:bg-blue-600 text-black font-medium py-1.5 px-3 rounded-lg duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="text-xs bg-red-600 hover:bg-red-700 text-black font-medium py-1.5 px-3 rounded-lg duration-200 disabled:opacity-50"
                          >
                            {deletingId === item.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}