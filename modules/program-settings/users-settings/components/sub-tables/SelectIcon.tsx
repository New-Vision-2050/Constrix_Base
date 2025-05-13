"use client";
import { FieldConfig, useFormStore } from "@/modules/form-builder";
import React, { useState } from "react";
import { tableIcon } from "../../tableIcon";

import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const SelectIcon = ({
  formId,
  field,
  value,
  onChange,
}: {
  formId: string;
  field: FieldConfig;
  value: any;
  onChange: (newValue: any) => void;
}) => {
  const { getError } = useFormStore();
  const err = getError(formId, field.name);
  const [isOpen, setIsOpen] = useState(false);
  const SelectedIcon = value
    ? tableIcon[value as keyof typeof tableIcon]
    : null;

  return (
    <div className="w-full mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </div>
        <CollapsibleTrigger className="w-full group">
          <div className="flex items-center justify-between w-full px-3 hover:bg-accent hover:text-accent-foreground  h-10 rounded-md border border-input bg-sidebar transition-colors">
            <div className="flex items-center gap-2">
              {value && SelectedIcon && (
                <div className="border border-primary h-6 w-6 rounded-sm flex items-center justify-center">
                  <SelectedIcon className="w-4 h-4 fill-primary" />
                </div>
              )}
              <span
                className={cn(
                  "text-sm ",
                  value && SelectedIcon
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                {field.label}
              </span>
            </div>
            <span className="text-gray-500">
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2">
          <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
            {Object.entries(tableIcon).map(([key, Icon]) => {
              const isSelected = value === key;
              return (
                <div
                  key={key}
                  onClick={() => onChange(key)}
                  className={`px-3 py-4  cursor-pointer rounded-lg border transition-all duration-200 flex items-center justify-center ${
                    isSelected
                      ? "border-primary bg-transparent"
                      : "border-transparent bg-sidebar hover:border-primary"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      isSelected ? "fill-primary" : "fill-[#B9B2C4]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
      {!!err && <div className="text-destructive text-sm mt-1 ml-6">{err}</div>}
    </div>
  );
};

export default SelectIcon;
