"use client";

import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import ColorPickerDialog from "./ColorPickerDialog";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex gap-2 items-center">
            <FormLabel className="text-sm font-medium">{label}</FormLabel>
            <FormControl>
              <ColorDisplay
                color={field.value}
                onClick={() => setIsDialogOpen(true)}
              />
            </FormControl>
            <FormErrorMessage />

            <ColorPickerDialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              color={field.value}
              onChange={field.onChange}
              label={label}
            />
          </FormItem>
        )}
      />
    </>
  );
}

