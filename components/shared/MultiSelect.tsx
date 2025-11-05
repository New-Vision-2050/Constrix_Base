"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MultiSelectOption {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export default function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "اختر",
  searchPlaceholder = "بحث...",
  disabled = false,
}: MultiSelectProps) {
  const selectedItems = Array.isArray(value) ? value : [];
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onChange(selectedItems.filter((i: string) => i !== itemId));
    } else {
      onChange([...selectedItems, itemId]);
    }
  };

  const removeItem = (itemId: string) => {
    onChange(selectedItems.filter((i: string) => i !== itemId));
  };

  const getSelectedNames = () => {
    return selectedItems
      .map((id) => options.find((opt) => opt.id === id)?.name)
      .filter(Boolean);
  };

  const filteredOptions = options.filter((option) =>
    option?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="min-h-[42px] w-full bg-sidebar border border-[#3c345a] rounded-md px-3 py-2 flex items-center justify-between gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Selected Tags */}
          {getSelectedNames().map((name, index) => (
            <div
              key={selectedItems[index]}
              className="flex items-center gap-2 bg-[#2a2440] border border-[#3c345a] rounded-full px-3 py-1"
            >
              <span className="text-white text-sm">{name}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(selectedItems[index]);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    e.preventDefault();
                    removeItem(selectedItems[index]);
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
        <div className="absolute z-50 w-full mt-1 bg-sidebar border border-[#3c345a] rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-[#3c345a]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 bg-[#2a2440] border-[#3c345a] text-white placeholder:text-gray-400"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#2a2440] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(option.id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(option.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleItem(option.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-white">{option.name}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-gray-400 text-sm">
                لا توجد نتائج
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
