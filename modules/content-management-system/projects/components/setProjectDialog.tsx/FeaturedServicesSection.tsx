"use client";

import React from "react";
import { Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import { Switch } from "@/components/ui/switch";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import ImageUpload from "@/components/shared/ImageUpload";
import { ProjectFormData } from "../../schema/project-form.schema";

/**
 * Featured Services Section Component
 * Handles featured toggle and image uploads
 * Follows Single Responsibility Principle
 */
interface FeaturedServicesSectionProps {
  control: Control<ProjectFormData>;
  isSubmitting: boolean;
  isFetching: boolean;
  t: (key: string) => string;
  mainImageInitialValue?: string;
  subImagesInitialValue?: string[];
}

export default function FeaturedServicesSection({
  control,
  isSubmitting,
  isFetching,
  t,
  mainImageInitialValue,
  subImagesInitialValue,
}: FeaturedServicesSectionProps) {
  const isFeatured = useWatch({
    control,
    name: "is_featured",
    defaultValue: false,
  });

  return (
    <div className="space-y-4">
      {/* Featured Toggle */}
      <FormField
        control={control}
        name="is_featured"
        render={({ field }) => (
          <FormItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 sm:p-4 gap-2 sm:gap-0">
            <div className="space-y-0.5">
              <FormLabel className="text-xs sm:text-sm font-medium">
                {t("featuredServices") || "Featured Services (Display on Homepage)"}
              </FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting || isFetching}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Show images only when featured is enabled */}
      {isFeatured && (
        <>
          {/* Main Image */}
          <FormField
            control={control}
            name="main_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs" required>
                  {t("mainImage") || "Main Image"}
                </FormLabel>
                <FormControl>
                  <ImageUpload
                    label={t("mainImage") || "Main Image"}
                    maxSize="3MB - الحجم الأقصى"
                    dimensions="2160 × 2160"
                    required={false}
                    onChange={(file) => field.onChange(file)}
                    initialValue={mainImageInitialValue}
                    minHeight="200px"
                    className="mt-1"
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />

          {/* Sub Images */}
          <FormField
            control={control}
            name="sub_images"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">
                  {t("subImages") || "Sub Images (Attach Images)"}
                </FormLabel>
                <FormControl>
                  <ImageUpload
                    label={t("subImages") || "Sub Images"}
                    maxSize="3MB - الحجم الأقصى"
                    dimensions="2160 × 2160"
                    required={false}
                    multiple={true}
                    onMultipleChange={(files) => field.onChange(files)}
                    initialValue={subImagesInitialValue}
                    minHeight="200px"
                    className="mt-1"
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}

