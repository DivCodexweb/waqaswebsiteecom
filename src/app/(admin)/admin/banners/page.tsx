'use client';

import { useState, useEffect } from 'react';

interface BannerItem {
  id: number;
  locationid: string;
  link: string;
  img: string;
}

const LOCATIONS = [
  { id: 'hero1', label: '(600 x 300)' },
  { id: 'hero2', label: '(600 x 300)' },
  { id: 'promotionbanner', label: 'Width: 757px | Height: 520px' },
  { id: 'pro1', label: '(600 x 300)' },
  { id: 'pro2', label: '(600 x 300)' },
];

export default function BannersPage() {
  const [items, setItems] = useState<BannerItem[]>([]);
  const [locationid, setLocationid] = useState('hero1');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchItems = async () => {
    const res = await fetch('/api/admin/images');
    const data = await res.json();
    if (data.success) {
      setItems(data.data);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !link || !locationid) return alert('Please fill all fields!');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('link', link);
    formData.append('locationid', locationid);

    try {
      const res = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setLink('');
        setFile(null);
        fetchItems();
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
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const res = await fetch(`/api/admin/images?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchItems();
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Hero & Promotion Banners Management</h1>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mb-8 space-y-4 border">
        <h2 className="text-lg font-semibold">Upload New Banner / Image</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Select Section (Location ID)</label>
          <select
            value={locationid}
            onChange={(e) => setLocationid(e.target.value)}
            className="w-full border rounded p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.id} — {loc.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Redirect Link (`href` target)</label>
          <input
            type="text"
            placeholder="e.g. /products/iphone-14 or https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Banner Image File</label>
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
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm hover:bg-blue-700 disabled:opacity-50" style={{ backgroundColor: 'black' }}
        >
          {loading ? 'Uploading to Cloudinary...' : 'Upload & Save'}
        </button>
      </form>

      {/* List Items */}
      <div className="bg-white p-6 shadow-md rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Existing Banners</h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No banners added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 relative bg-gray-50 flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded mb-2">
                    ID: {item.locationid}
                  </span>
                  <img
                    src={item.img}
                    alt="Banner preview"
                    className={`w-full object-cover rounded mb-2 border bg-white ${
                      item.locationid === 'promotionbanner' ? 'h-[180px]' : 'h-[140px]'
                    }`}
                  />
                  <p className="text-xs text-gray-600 truncate mb-1">
                    <strong>Link:</strong> {item.link}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-2 bg-red-500 text-white text-xs px-3 py-1.5 rounded hover:bg-red-600 w-full" style={{ backgroundColor: 'red' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}