'use client';

import { useState, useEffect } from 'react';

interface SliderItem {
  id: number;
  link: string;
  img: string;
}

export default function SlidersPage() {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch Sliders
  const fetchSliders = async () => {
    const res = await fetch('/api/admin/sliders');
    const data = await res.json();
    if (data.success) {
      setSliders(data.data);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Handle Upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !link) return alert('Please provide image and link!');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('link', link);

    try {
      const res = await fetch('/api/admin/sliders', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setLink('');
        setFile(null);
        fetchSliders();
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;

    try {
      const res = await fetch(`/api/admin/sliders?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchSliders();
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Slider Management</h1>

      {/* Recommended Size Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded text-blue-700">
        <p className="font-semibold">Recommended Image Size:</p>
        <p className="text-sm">
          Width: <strong>757px</strong> | Height: <strong>520px</strong> (Aspect Ratio approx 3:2).
        </p>
      </div>

      {/* Add Slider Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mb-8 space-y-4 border">
        <h2 className="text-lg font-semibold">Add New Slider</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Redirect Link Target</label>
          <input
            type="text"
            placeholder="e.g. /products/category-1 or https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slider Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="text-white px-4 py-2 rounded font-medium text-sm hover:bg-black-700 disabled:opacity-50" style={{ backgroundColor: 'black' }}
        >
          {loading ? 'Uploading to Cloudinary...' : 'Add Slider'}
        </button>
      </form>

      {/* Sliders List (Add & Delete Only) */}
      <div className="bg-white p-6 shadow-md rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Active Sliders</h2>
        {sliders.length === 0 ? (
          <p className="text-gray-500 text-sm">No sliders added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sliders.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 relative bg-gray-50 flex flex-col justify-between">
                <div>
                  <img
                    src={item.img}
                    alt="Slider Preview"
                    className="w-full h-[180px] object-cover rounded mb-2"
                  />
                  <p className="text-xs text-gray-600 truncate">
                    <strong>Link:</strong> {item.link}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded hover:bg-red-600 w-full" style={{ backgroundColor: 'red' }}
                >
                  Delete Slider
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}