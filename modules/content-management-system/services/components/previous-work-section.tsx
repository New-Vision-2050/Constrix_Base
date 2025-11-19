"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/modules/table/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Trash2 } from "lucide-react";
import ImageUpload from "@/components/shared/ImageUpload";
import { ServiceFormData } from "../schemas/service-form.schema";

interface PreviousWorkSectionProps {
  control: Control<ServiceFormData>;
  previousWorkIndex: number;
  totalPreviousWorks: number;
  isSubmitting: boolean;
  onRemove: () => void;
  initialImageUrl?: string;
}

export default function PreviousWorkSection({
  control,
  previousWorkIndex,
  totalPreviousWorks,
  isSubmitting,
  onRemove,
  initialImageUrl,
}: PreviousWorkSectionProps) {
  const tForm = useTranslations("content-management-system.services.form");

  return (
    <div className="space-y-4 border-t border-gray-700 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {tForm("previousWork")} ({previousWorkIndex + 1})
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Description */}
      <FormField
        control={control}
        name={`previous_works.${previousWorkIndex}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs" required>
              {tForm("previousWorkDescription")}
            </FormLabel>
            <FormControl>
              <Textarea
                disabled={isSubmitting}
                className="mt-1 min-h-[100px] bg-sidebar text-white"
                placeholder={tForm("previousWorkDescriptionPlaceholder")}
                {...field}
              />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />

      {/* Image Upload */}
      <FormField
        control={control}
        name={`previous_works.${previousWorkIndex}.image`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ImageUpload
                label={tForm("previousWorkImage")}
                maxSize={tForm("imageMaxSize")}
                dimensions={tForm("imageDimensions")}
                onChange={(file) => field.onChange(file)}
                initialValue={
                  typeof field.value === "string"
                    ? field.value
                    : initialImageUrl
                }
                minHeight="100px"
              />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

