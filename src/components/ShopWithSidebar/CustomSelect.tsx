"use client";
import React, { useState, useEffect, useRef } from "react";

interface Option {
  id?: string | number;
  name?: string;
  label?: string;
  [key: string]: any;
}

interface CustomSelectProps {
  options: Option[];
  onChange?: (option: Option) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0] || { name: "Select", label: "Select" });
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  // Helper to get display text whether it uses 'name' or 'label'
  const displayLabel = selectedOption?.label || selectedOption?.name || "Select option";

  return (
    <div ref={selectRef} className="relative w-full min-w-[140px]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full cursor-pointer rounded-md border border-gray-3 bg-white py-2 px-3 text-sm text-dark select-none"
      >
        <span>{displayLabel}</span>
        <svg
          className={`fill-current transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path d="M2.25 4.5L6 8.25L9.75 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {isOpen && (
        <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-3 rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 text-sm text-dark hover:bg-gray-1 cursor-pointer transition-colors"
            >
              {option.label || option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;