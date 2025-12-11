"use client";

import { Control } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/shared/ImageUpload";
import { ThemeSettingFormData } from "../../schema";

/**
 * BasicInfoSection component
 * Displays website icon upload and URL input fields
 * 
 * @param control - React Hook Form control object
 * @param title - Section title
 * @param iconLabel - Label for icon upload
 * @param urlLabel - Label for URL input
 * @param isSubmitting - Form submission state
 */
interface BasicInfoSectionProps {
  control: Control<ThemeSettingFormData>;
  title: string;
  iconLabel: string;
  urlLabel: string;
  isSubmitting?: boolean;
  initialIconUrl?: string;
}

export default function BasicInfoSection({
  control,
  title,
  iconLabel,
  urlLabel,
  isSubmitting = false,
  initialIconUrl,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-6 bg-sidebar rounded-lg p-6 border border-border">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* 20% width - Website Icon */}
        <div className="lg:col-span-1">
          <FormField
            control={control}
            name="basicInfo.websiteIcon"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel className="text-xs">{iconLabel}</FormLabel>
                <FormControl>
                  <ImageUpload
                    label=""
                    maxSize="2MB"
                    dimensions="512 x 512"
                    required={false}
                    onChange={(file) => onChange(file)}
                    initialValue={initialIconUrl}
                    minHeight="200px"
                    className="mt-1"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/x-icon"
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 80% width - Website URL */}
        <div className="lg:col-span-4">
          <FormField
            control={control}
            name="basicInfo.websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs" required>{urlLabel}</FormLabel>
                <FormControl>
                  <Input
                    variant="secondary"
                    disabled={isSubmitting}
                    className="mt-1"
                    placeholder="example.com"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

