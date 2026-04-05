import React from "react";
import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/table/components/ui/select";
import { cn } from "@/lib/utils";
import type { DropdownOption } from "./types";

interface SearchSelectFieldProps {
  value?: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SearchSelectField: React.FC<SearchSelectFieldProps> = ({
  value,
  onChange,
  options,
  placeholder = "اختر عنصر",
  className = "",
  disabled = false,
}) => {
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <Select value={value || ""} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "w-full bg-transparent border-gray-700 text-white",
          !value && "text-gray-400",
          isRtl ? "text-right" : "text-left",
          className,
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn(isRtl ? "text-right" : "text-left")}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={cn(isRtl ? "text-right" : "text-left")}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SearchSelectField;
