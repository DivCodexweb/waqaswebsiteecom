import React from "react";

// Agar aapke paas categories ki koi specific type/interface hai toh wo use karein, warna any[]
const Categories = ({ categories }: { categories: any[] }) => {
  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h3 className="font-semibold text-dark text-custom-1">Categories</h3>
      </div>
      <div className="p-4 sm:p-6">
        <ul>
          {Array.isArray(categories) && categories.map((category: any, index: number) => (
            <li key={index} className="mb-2 last:mb-0">
              {/* Category rendering logic */}
              <span className="text-dark hover:text-blue transition-colors cursor-pointer">
                {category.title || category}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;