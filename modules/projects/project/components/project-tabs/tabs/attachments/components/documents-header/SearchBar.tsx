import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchBarProps } from "./types";

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "البحث في المستندات...",
  className = "",
  disabled = false,
}) => {
  return (
    <div className={cn("relative flex-1 max-w-md", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full pl-10 pr-4 py-2 rounded-lg border",
          "bg-transparent border-gray-700 text-white placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "transition-colors duration-200",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      />
    </div>
  );
};

export default SearchBar;
