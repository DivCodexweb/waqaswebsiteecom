import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/logout/LogoutButton"; // Import Logout Button
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side Session Check
  const session = await getServerSession(authOptions);

  // 1. Login na hone par signin page par bhejain
  if (!session) {
    redirect("/signin");
  }

  // 2. Role admin na hone par home page par bhejain
  if ((session.user as any)?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Fixed Sidebar with Internal Scrollbar */}
      <aside className="w-64 bg-slate-900 text-black flex flex-col justify-between p-5 shadow-lg h-screen sticky top-0 shrink-0 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="mb-8 border-b border-slate-700 pb-4 sticky top-0 bg-slate-900 z-10">
            <h2 className="text-xl font-bold tracking-wide text-black">Admin Panel</h2>
            <p className="text-xs text-slate-400 mt-1">Manage your store</p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col space-y-2">
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-black transition-colors"
            >
              Dashboard
            </Link>
             <Link
              href="/admin/addproducts"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-black transition-colors"
            >
              Add Products
            </Link>
            <Link
              href="/admin/addcategory"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-black transition-colors"
            >
              Add Category
            </Link>
            <Link
              href="/admin/subcategories"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-black transition-colors"
            >
              Subcategories
            </Link>
             <Link
              href="/admin/addbrands"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-black transition-colors"
            >
              Brand/Attributes
            </Link>
          </nav>
        </div>

        {/* Footer Link & Sign Out Button */}
        <div className="pt-4 border-t border-slate-700 mt-6 sticky bottom-0 bg-slate-900 z-10 flex flex-col gap-3">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area (Independent Scroll) */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-sm min-h-full text-black">
          {children}
        </div>
      </main>
    </div>
  );
}