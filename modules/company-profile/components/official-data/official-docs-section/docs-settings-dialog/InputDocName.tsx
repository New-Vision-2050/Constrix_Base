import React from "react";
import { cn } from "@/lib/utils";

interface InputDocNameProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const InputDocName: React.FC<InputDocNameProps> = ({
  value,
  onChange,
  placeholder = "...",
  className = "",
  disabled = false,
}) => {
  return (
    <div className={cn("relative flex-1 max-w-md", className)}>
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
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
    </div>
  );
};

export default InputDocName;
