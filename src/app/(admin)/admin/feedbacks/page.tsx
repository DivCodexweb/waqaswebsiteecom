'use client';

import { useState, useEffect } from 'react';

interface FeedbackItem {
  id: number;
  name: string;
  img: string;
  description: string;
}

export default function FeedbacksManagementPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [existingImg, setExistingImg] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Feedbacks
  const fetchFeedbacks = async () => {
    const res = await fetch('/api/admin/feedbacks');
    const data = await res.json();
    if (data.success) {
      setFeedbacks(data.data);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Handle Form Submit (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return alert('Please fill all text fields!');
    if (!editId && !file) return alert('Please upload an image!');

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (file) formData.append('file', file);
    if (existingImg) formData.append('existingImg', existingImg);
    if (editId) formData.append('id', editId.toString());

    try {
      const res = await fetch('/api/admin/feedbacks', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchFeedbacks();
      } else {
        alert(data.message || 'Action failed');
      }
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Edit Mode On
  const handleEdit = (item: FeedbackItem) => {
    setEditId(item.id);
    setName(item.name);
    setDescription(item.description);
    setExistingImg(item.img);
    setFile(null);
  };

  // Reset Form
  const resetForm = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setExistingImg('');
    setFile(null);
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const res = await fetch(`/api/admin/feedbacks?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchFeedbacks();
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Feedbacks Management</h1>

      {/* Form for Add / Edit */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mb-8 space-y-4 border">
        <h2 className="text-lg font-semibold">{editId ? 'Edit Feedback' : 'Add New Feedback'}</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Feedback Description</label>
          <textarea
            placeholder="Write customer feedback here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Customer Image</label>
          {existingImg && !file && (
            <div className="mb-2">
              <img src={existingImg} alt="Preview" className="w-16 h-16 object-cover rounded border" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm border p-2 rounded"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm hover:bg-blue-700 disabled:opacity-50"  style={{ backgroundColor: 'black' }}
          >
            {loading ? 'Processing...' : editId ? 'Update Feedback' : 'Add Feedback'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded font-medium text-sm hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List Existing Feedbacks */}
      <div className="bg-white p-6 shadow-md rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">All Feedbacks</h2>
        {feedbacks.length === 0 ? (
          <p className="text-gray-500 text-sm">No feedbacks found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 relative bg-gray-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-full border bg-white"
                    />
                    <h3 className="font-bold text-dark">{item.name}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white text-xs px-3 py-1.5 rounded hover:bg-yellow-600 w-1/2" style={{ backgroundColor: 'blue' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white text-xs px-3 py-1.5 rounded hover:bg-red-600 w-1/2" style={{ backgroundColor: 'red' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}