"use client";

import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
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
import { ProjectFormData } from "../../schema/project-form.schema";

/**
 * Project Details Section Component
 * Handles core project information fields
 * Follows Single Responsibility Principle
 */
interface ProjectDetailsSectionProps {
  control: Control<ProjectFormData>;
  isSubmitting: boolean;
  isFetching: boolean;
  t: (key: string) => string;
  projectTypeOptions: { value: string; label: string }[];
}

export default function ProjectDetailsSection({
  control,
  isSubmitting,
  isFetching,
  t,
  projectTypeOptions,
}: ProjectDetailsSectionProps) {
  return (
    <div className="space-y-4">
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

