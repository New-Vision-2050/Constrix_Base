"use client";

import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import ColorPickerPopover from "./ColorPickerPopover";
import ColorDisplay from "./ColorDisplay";

/**
 * ColorItem component for React Hook Form integration
 * Displays color label, value, and provides color picker functionality
 * 
 * @param control - React Hook Form control object
 * @param name - Field name for form registration
 * @param label - Display label for the color field
 */
interface ColorItemProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
}

export default function ColorItem<TFieldValues extends FieldValues>({
  control,
  name,
  label,
}: ColorItemProps<TFieldValues>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex gap-2 items-center">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <ColorPickerPopover
                open={isOpen}
                onOpenChange={setIsOpen}
                color={field.value}
                onChange={field.onChange}
                label={label}
              >
                <ColorDisplay color={field.value} />
              </ColorPickerPopover>
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </>
  );
}
