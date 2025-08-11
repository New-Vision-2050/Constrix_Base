import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Option type for select dropdown
 */
export type SelectOptionType = {
  id: string;
  name: string;
};

/**
 * InputWithSelect component props
 */
interface InputWithSelectProps {
  // Input props
  inputType: "text" | "number" | "email" | "password";
  inputValue: string | number;
  onInputChange: (value: string) => void;
  inputPlaceholder?: string;
  inputDisabled?: boolean;

  // Select props
  selectOptions: SelectOptionType[];
  selectValue: string;
  onSelectChange: (value: string) => void;
  selectDisabled?: boolean;

  // Common props
  label?: string;
  className?: string;
}

/**
 * A component that combines an input field with a select dropdown
 * Following SOLID principles:
 * - Single responsibility: Handles only input with select functionality
 * - Open/closed: Extendable through props without modifying component
 * - Liskov substitution: Can replace standard inputs where needed
 * - Interface segregation: Exposes only necessary props
 * - Dependency inversion: Relies on abstractions (props) rather than concrete implementations
 */
export const InputWithSelect: React.FC<InputWithSelectProps> = ({
  // Input props
  inputType,
  inputValue,
  onInputChange,
  inputPlaceholder = "",
  inputDisabled = false,

  // Select props
  selectOptions,
  selectValue,
  onSelectChange,
  selectDisabled = false,

  // Common props
  label,
  className = "",
}) => {
  // Get theme for styling
  const { resolvedTheme } = useTheme();

  // Dynamic styling based on theme
  const isDarkTheme = resolvedTheme === "dark";
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && (
        <label
          className={cn(
            "text-sm font-medium transition-colors",
            isDarkTheme ? "text-gray-300" : "text-gray-700"
          )}
        >
          {label}
        </label>
      )}
      <div className="flex w-full h-full min-h-[40px] border rounded-sm ring-offset-background  focus-within:ring-offset-2 transition-all">
        <input
          type={inputType}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          disabled={inputDisabled}
          className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-full border border-1 border-gray-400"
        />
        <select
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value)}
          disabled={selectDisabled}
          className="rounded-l-none border-l-0 focus:ring-0 focus:ring-offset-0 bg-pink-500 text-white"
        >
          {selectOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InputWithSelect;
