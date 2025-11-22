"use client";

import React from "react";
import { Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import ImageUpload from "@/components/shared/ImageUpload";
import { ProjectFormData } from "../../schema/project-form.schema";

/**
 * Project Details Section Component
 * Handles featured toggle, image uploads, and core project information fields
 */
interface ProjectDetailsSectionProps {
  control: Control<ProjectFormData>;
  isSubmitting: boolean;
  isFetching: boolean;
  t: (key: string) => string;
  projectTypeOptions: { value: string; label: string }[];
  mainImageInitialValue?: string;
  subImagesInitialValue?: string[];
}

export default function ProjectDetailsSection({
  control,
  isSubmitting,
  isFetching,
  t,
  projectTypeOptions,
  mainImageInitialValue,
  subImagesInitialValue,
}: ProjectDetailsSectionProps) {
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
          <FormItem className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-lg  p-3 sm:p-4">
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

      {/* Images and Titles Row - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* w-20% width - Main Image */}
        <div className="lg:col-span-1">
          <FormField
            control={control}
            name="main_image"
            render={({ field }) => (
              <FormItem>
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
        </div>

        {/* w-20% width - Sub Images */}
        <div className="lg:col-span-1">
          <FormField
            control={control}
            name="sub_images"
            render={({ field }) => (
              <FormItem>
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
        </div>

        {/* w-60% width - Project Title Arabic & English */}
        <div className="lg:col-span-3 space-y-4">
          {/* Project Title Arabic */}
          <FormField
            control={control}
            name="title_ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs" required>
                  {t("titleAr") || "Project Title Arabic"}
                </FormLabel>
                <FormControl>
                  <Input
                    variant="secondary"
                    disabled={isSubmitting || isFetching}
                    className="mt-1"
                    placeholder="SAAS"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />

          {/* Project Title English */}
          <FormField
            control={control}
            name="title_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">
                  {t("titleEn") || "Project Title English"}
                </FormLabel>
                <FormControl>
                  <Input
                    variant="secondary"
                    disabled={isSubmitting || isFetching}
                    className="mt-1"
                    placeholder="SAAS"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Project Type */}
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs" required>
              {t("type") || "Project Type"}
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting || isFetching}
              >
                <SelectTrigger
                  className="mt-1 bg-sidebar border-white text-white h-12"
                  showClear={!!field.value}
                  onClear={() => field.onChange("")}
                >
                  <SelectValue
                    placeholder={t("typePlaceholder") || "Select Project Type"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {projectTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />

      {/* Project Name Arabic & English - Side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Project Name Arabic */}
        <FormField
          control={control}
          name="name_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs" required>
                {t("nameAr") || "Project Name Arabic"}
              </FormLabel>
              <FormControl>
                <Input
                  variant="secondary"
                  disabled={isSubmitting || isFetching}
                  className="mt-1"
                  placeholder="SAAS"
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* Project Name English */}
        <FormField
          control={control}
          name="name_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">
                {t("nameEn") || "Project Name English"}
              </FormLabel>
              <FormControl>
                <Input
                  variant="secondary"
                  disabled={isSubmitting || isFetching}
                  className="mt-1"
                  placeholder="SAAS"
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Project Description Arabic */}
      <FormField
        control={control}
        name="description_ar"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs" required>
              {t("descriptionAr") || "Project Description Arabic"}
            </FormLabel>
            <FormControl>
              <Textarea
                disabled={isSubmitting || isFetching}
                rows={4}
                className="mt-1 resize-none bg-sidebar border-white text-white"
                placeholder={t("descriptionArPlaceholder") || "Enter description"}
                {...field}
              />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />

      {/* Project Description English */}
      <FormField
        control={control}
        name="description_en"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">
              {t("descriptionEn") || "Project Description English"}
            </FormLabel>
            <FormControl>
              <Textarea
                disabled={isSubmitting || isFetching}
                rows={4}
                className="mt-1 resize-none bg-sidebar border-white text-white"
                placeholder={t("descriptionEnPlaceholder") || "Enter description"}
                {...field}
              />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
