"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    // LocalStorage & SessionStorage clear karein
    localStorage.clear();
    sessionStorage.clear();

    // NextAuth SignOut run karein
    await signOut({
      callbackUrl: "/signin",
      redirect: true,
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2.5 bg-red-800 text-black font-medium rounded-lg hover:bg-red-700 transition duration-200 text-sm"
    >
      Sign Out
    </button>
  );
}