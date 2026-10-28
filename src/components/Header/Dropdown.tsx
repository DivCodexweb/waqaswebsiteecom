"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

const Dropdown = ({ menuItem, stickyMenu }: { menuItem: any; stickyMenu?: boolean }) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const pathUrl = usePathname();

  return (
    <li className="relative group">
      <button
        onClick={() => setDropdownToggler(!dropdownToggler)}
        className={`flex items-center justify-between gap-1.5 py-3 text-custom-sm font-medium ${
          stickyMenu ? "text-dark" : "text-white"
        } hover:text-blue w-full`}
      >
        {menuItem?.title || "Menu"}
        {/* Dropdown arrow icon */}
        <svg className="fill-current" width="12" height="12" viewBox="0 0 12 12">
          <path d="M2.25 4.5L6 8.25L9.75 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown submenu items */}
      {menuItem?.submenu && (
        <ul
          className={`dropdown-submenu ${
            dropdownToggler ? "block" : "hidden"
          } lg:group-hover:block lg:absolute lg:top-full lg:left-0 lg:w-48 bg-white shadow-md rounded-md py-2 z-50`}
        >
          {menuItem.submenu.map((subItem: any, index: number) => (
            <li key={index}>
              <Link
                href={subItem.path || "#"}
                className={`block px-4 py-2 text-sm text-dark hover:text-blue transition-colors ${
                  pathUrl === subItem.path ? "text-blue font-semibold" : ""
                }`}
              >
                {subItem.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Dropdown;