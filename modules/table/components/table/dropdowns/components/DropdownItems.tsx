
import React from 'react';
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownOption } from "@/modules/table/utils/tableTypes";
import {
  CommandItem,
  CommandGroup,
} from "@/modules/table/components/ui/command";
import LoadingSpinner from '@/modules/table/components/table/LoadingSpinner';

interface DropdownItemsProps {
  options: DropdownOption[];
  isLoading: boolean;
  currentValue: string;
  onSelect: (value: string) => void;
}

const DropdownItems: React.FC<DropdownItemsProps> = ({
  options,
  isLoading,
  currentValue,
  onSelect
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="small" />
      </div>
    );
  }

  // Debug log to see if options are being received
  console.log(`Rendering ${options.length} dropdown items:`, options);

  return (
    <CommandGroup className="py-1.5">
      <CommandItem
        key="clear-option"
        value="__clear__"
        onSelect={() => onSelect('')}
        className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm flex items-center"
      >
        <span>Clear selection</span>
      </CommandItem>
      
      {options.map((option) => (
        <CommandItem
          key={option.value}
          value={option.value}
          onSelect={() => onSelect(option.value)}
          className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm flex items-center"
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              currentValue === option.value ? "opacity-100" : "opacity-0"
            )}
          />
          {option.label}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default DropdownItems;
