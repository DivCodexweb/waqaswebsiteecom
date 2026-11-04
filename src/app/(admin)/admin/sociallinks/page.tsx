'use client';

import { useState, useEffect } from 'react';

interface SocialLinkItem {
  id: number;
  title: string;
  link: string;
}

// Platforms ke naam aur unke base URLs / placeholders
const PLATFORM_CONFIG: Record<string, { baseUrl: string; placeholder: string }> = {
  Facebook: { baseUrl: 'https://facebook.com/', placeholder: 'e.g. talhamehmood1' },
  WhatsApp: { baseUrl: 'https://wa.me/', placeholder: 'e.g. 03049899037' },
  Instagram: { baseUrl: 'https://instagram.com/', placeholder: 'e.g. username' },
  Twitter: { baseUrl: 'https://x.com/', placeholder: 'e.g. username' },
  YouTube: { baseUrl: 'https://youtube.com/@', placeholder: 'e.g. channelname' },
  LinkedIn: { baseUrl: 'https://linkedin.com/in/', placeholder: 'e.g. username' },
  TikTok: { baseUrl: 'https://tiktok.com/@', placeholder: 'e.g. username' },
  Telegram: { baseUrl: 'https://t.me/', placeholder: 'e.g. username' },
};

const ALL_PLATFORMS = Object.keys(PLATFORM_CONFIG);

export default function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [title, setTitle] = useState(ALL_PLATFORMS[0]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Database se links fetch karna
  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/admin/sociallinks');
      const data = await res.json();
      if (data.success) {
        setLinks(data.data);
        
        // Jo Platforms already add ho chuke hain unhe filter karke pehle remaining platform ko auto select karna
        const addedTitles = data.data.map((item: SocialLinkItem) => item.title);
        const remaining = ALL_PLATFORMS.filter((p) => !addedTitles.includes(p));
        if (remaining.length > 0) {
          setTitle(remaining[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch links');
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Dropdown ke liye available platforms (jo already added hain unhe chhorkar)
  const addedTitles = links.map((item) => item.title);
  const availablePlatforms = ALL_PLATFORMS.filter((p) => !addedTitles.includes(p));

  // Auto Link Creator Helper
  const buildFullLink = (platform: string, input: string) => {
    let cleanInput = input.trim();

    // Agar user ne galti se pura URL pehle se likh diya ho
    if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
      return cleanInput;
    }

    const config = PLATFORM_CONFIG[platform];
    if (!config) return cleanInput;

    // WhatsApp ke liye agar '0304...' se shuru ho toh Pakistan (+92) ya standard format me clean karna
    if (platform === 'WhatsApp') {
      cleanInput = cleanInput.replace(/[^0-9]/g, ''); // Sirf digits rakhein
      if (cleanInput.startsWith('0')) {
        cleanInput = '92' + cleanInput.slice(1); // 0304... ko 92304... bana dega
      }
    }

    return `${config.baseUrl}${cleanInput}`;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !inputValue) return alert('Kripya sabhi fields bharein!');

    // Complete URL Generate Karein
    const finalLink = buildFullLink(title, inputValue);

    setLoading(true);
    try {
      const res = await fetch('/api/admin/sociallinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link: finalLink }),
      });

      const data = await res.json();
      if (data.success) {
        setInputValue('');
        fetchLinks();
      } else {
        alert(data.message || 'Save nahi ho saka');
      }
    } catch (err) {
      alert('Kuch galat ho gaya!');
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (!confirm('Kya aap is social link ko delete karna chahte hain?')) return;

    try {
      const res = await fetch(`/api/admin/sociallinks?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchLinks();
      } else {
        alert('Delete fail ho gaya');
      }
    } catch (err) {
      alert('Delete fail ho gaya');
    }
  };

  const currentConfig = PLATFORM_CONFIG[title] || { baseUrl: '', placeholder: '' };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Social Links Management</h1>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mb-8 space-y-4 border">
        <h2 className="text-lg font-semibold">Add New Social Link</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Select Social Platform</label>
          {availablePlatforms.length === 0 ? (
            <p className="text-sm text-red-500 font-medium">Sabhi social platforms add ho chuke hain!</p>
          ) : (
            <select
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setInputValue('');
              }}
              className="w-full border rounded p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {availablePlatforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          )}
        </div>

        {availablePlatforms.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {title === 'WhatsApp' ? 'Mobile / WhatsApp Number' : 'Username'}
            </label>
            <div className="flex items-center border rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              {/* Auto Prefix Prefix Label */}
              <span className="bg-gray-100 text-gray-500 text-sm px-3 py-2 border-r select-none">
                {currentConfig.baseUrl}
              </span>
              <input
                type="text"
                placeholder={currentConfig.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2 text-sm focus:outline-none"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Preview Link: <span className="text-blue-600 font-mono">{buildFullLink(title, inputValue || '...')}</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || availablePlatforms.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm hover:bg-blue-700 disabled:opacity-50" style={{ backgroundColor: 'black' }}
        >
          {loading ? 'Saving...' : 'Add Link'}
        </button>
      </form>

      {/* Saved Links List */}
      <div className="bg-white p-6 shadow-md rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Saved Social Links</h2>
        {links.length === 0 ? (
          <p className="text-gray-500 text-sm">Abhi tak koi social link add nahi hua hai.</p>
        ) : (
          <div className="space-y-3">
            {links.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 flex items-center justify-between bg-gray-50">
                <div>
                  <h3 className="font-bold text-dark text-sm">{item.title}</h3>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline truncate block max-w-md font-mono"
                  >
                    {item.link}
                  </a>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white text-xs px-3 py-1.5 rounded hover:bg-red-600"  style={{ backgroundColor: 'red' }}
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