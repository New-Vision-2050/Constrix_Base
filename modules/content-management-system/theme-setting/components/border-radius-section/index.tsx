"use client";

import { Control } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeSettingFormData } from "../../schema";

/**
 * BorderRadiusSection component
 * Displays border radius input in an accordion
 * 
 * @param control - React Hook Form control object
 * @param title - Section title
 * @param label - Label for border radius input
 * @param isSubmitting - Form submission state
 */
interface BorderRadiusSectionProps {
  control: Control<ThemeSettingFormData>;
  title: string;
  label?: string;
  isSubmitting?: boolean;
}

export default function BorderRadiusSection({
  control,
  title,
  label,
  isSubmitting = false,
}: BorderRadiusSectionProps) {
  return (
    <Accordion type="single" collapsible defaultValue="border-radius">
      <AccordionItem value="border-radius">
        <AccordionTrigger>
          <h2 className="text-lg font-semibold">{title}</h2>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-6">
            <FormField
              control={control}
              name="borderRadius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    {label || "Border Radius (px)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      variant="secondary"
                      disabled={isSubmitting}
                      className="mt-1"
                      placeholder="4"
                      min={0}
                      max={50}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || 0);
                      }}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

