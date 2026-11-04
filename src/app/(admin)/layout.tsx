"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/logout/LogoutButton";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // State to handle which dropdown is open (only one open at a time)
  const [openDropdown, setOpenDropdown] = useState<string | null>("catalog");

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Fixed Sidebar with Internal Scrollbar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-5 shadow-xl h-screen sticky top-0 shrink-0 overflow-y-auto">
        <div>
          {/* Logo & Header */}
          <div className="mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 z-10 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
              {/* Yahan aap apna logo image laga sakte hain, abhi placeholder 'A' hai */}
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-black">Admin Panel</h2>
              <p className="text-xs text-slate-400">Manage your store</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col space-y-1.5">
            <Link
              href="/admin"
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/admin"
                  ? "bg-blue-600 text-red shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-red"
              }`}
            >
              📊 Dashboard
            </Link>

            {/* Dropdown Section: Catalog Management */}
            <div className="flex flex-col">
              <button
                onClick={() => toggleDropdown("catalog")}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-red transition-colors w-full text-left"
              >
                <span className="flex items-center gap-2">📦 Products</span>
                <span className={`transform transition-transform duration-200 ${openDropdown === "catalog" ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {/* Sub-menu items */}
              {openDropdown === "catalog" && (
                <div className="flex flex-col pl-6 mt-1 space-y-1 border-l border-slate-800 ml-4">
                  <Link
                    href="/admin/addproducts"
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      pathname === "/admin/addproducts" ? "text-blue-400 bg-slate-800/50" : "text-slate-400 hover:text-red hover:bg-slate-800/30"
                    }`}
                  >
                    Add Products
                  </Link>
                 
                 
                </div>
              )}
            </div>
            
    <div className="flex flex-col">
              <button
                onClick={() => toggleDropdown("Layout")}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-red transition-colors w-full text-left"
              >
                <span className="flex items-center gap-2"> ✓  Layout</span>
                <span className={`transform transition-transform duration-200 ${openDropdown === "Layout" ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {openDropdown === "Layout" && (
                <div className="flex flex-col pl-6 mt-1 space-y-1 border-l border-slate-800 ml-4">
                  <Link
                    href="/admin/sliders"
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      pathname === "/admin/sliders" ? "text-blue-400 bg-slate-800/50" : "text-slate-400 hover:text-red hover:bg-slate-800/30"
                    }`}
                  >
                    Sliders
                  </Link>
                  <Link
                    href="/admin/banners"
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      pathname === "/admin/banners" ? "text-blue-400 bg-slate-800/50" : "text-slate-400 hover:text-red hover:bg-slate-800/30"
                    }`}
                  >
                    Banners images
                  </Link>
                         <Link
                    href="/admin/feedbacks"
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      pathname === "/admin/feedbacks" ? "text-blue-400 bg-slate-800/50" : "text-slate-400 hover:text-red hover:bg-slate-800/30"
                    }`}
                  >
                    Add Feedbacks
                  </Link>
                   <Link
                    href="/admin/sociallinks"
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      pathname === "/admin/sociallinks" ? "text-blue-400 bg-slate-800/50" : "text-slate-400 hover:text-red hover:bg-slate-800/30"
                    }`}
                  >
                    Social Links
                  </Link>
                </div>
              )}
            </div>
            {/* Dropdown Section: Settings (Optional / Example) */}
            <div className="flex flex-col">
              <button
                onClick={() => toggleDropdown("settings")}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-red transition-colors w-full text-left"
              >
                <span className="flex items-center gap-2">⚙️ Settings</span>
                <span className={`transform transition-transform duration-200 ${openDropdown === "settings" ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {openDropdown === "settings" && (
                <div className="flex flex-col pl-6 mt-1 space-y-1 border-l border-slate-800 ml-4">
                  <Link
                    href="/admin/addcategory"
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      pathname === "/admin/addcategory" ? "text-blue-400 bg-slate-800/50" : "text-slate-400 hover:text-red hover:bg-slate-800/30"
                    }`}
                  >
                    Add Category
                  </Link>
                  <Link
                    href="/admin/subcategories"
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      pathname === "/admin/subcategories" ? "text-blue-400 bg-slate-800/50" : "text-slate-400 hover:text-red hover:bg-slate-800/30"
                    }`}
                  >
                    Subcategories
                  </Link>
                  <Link
                    href="/admin/addbrands"
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      pathname === "/admin/addbrands" ? "text-blue-400 bg-slate-800/50" : "text-slate-400 hover:text-red hover:bg-slate-800/30"
                    }`}
                  >
                    Brand/Attributes
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Footer / Sign Out Button */}
        <div className="pt-4 border-t border-slate-800 mt-6 sticky bottom-0 bg-slate-900 z-10 flex flex-col gap-3">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-sm min-h-full text-slate-800 ">
          {children}
        </div>
      </main>
    </div>
  );
}