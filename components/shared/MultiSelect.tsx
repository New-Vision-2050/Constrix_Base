"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "اختر",
}: MultiSelectProps) {
  const selectedItems = Array.isArray(value) ? value : [];
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      onChange(selectedItems.filter((i: string) => i !== item));
    } else {
      onChange([...selectedItems, item]);
    }
  };

  const removeItem = (item: string) => {
    onChange(selectedItems.filter((i: string) => i !== item));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[42px] w-full bg-sidebar border border-[#3c345a] rounded-md px-3 py-2 flex items-center justify-between gap-2"
      >
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Selected Tags */}
          {selectedItems.map((item: string) => (
            <div
              key={item}
              className="flex items-center gap-2 bg-[#2a2440] border border-[#3c345a] rounded-full px-3 py-1"
            >
              <span className="text-white text-sm">{item}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    e.preventDefault();
                    removeItem(item);
                  }
                }}
                className="w-5 h-5 rounded-full bg-[#3c345a] flex items-center justify-center hover:bg-[#4c446a] transition-colors cursor-pointer"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 3L3 9M3 3L9 9"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          ))}
          {selectedItems.length === 0 && (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-sidebar border border-[#3c345a] rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#2a2440] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                toggleItem(option);
              }}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(option)}
                onChange={() => toggleItem(option)}
                className="w-4 h-4"
              />
              <span className="text-sm text-white">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
