"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
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
import { ProjectFormData } from "../../schema/project-form.schema";
import { CompanyDashboardProjectsApi } from "@/services/api/company-dashboard/projects";
import { toast } from "sonner";
import ProjectImageUpload from "../ProjectImageUpload";

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
  subImagesInitialValue?: { id: string; url: string }[];
  projectId?: string;
}

export default function ProjectDetailsSection({
  control,
  isSubmitting,
  isFetching,
  t,
  projectTypeOptions,
  mainImageInitialValue,
  subImagesInitialValue,
  projectId,
}: ProjectDetailsSectionProps) {
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
                {t("featuredServices") ||
                  "Featured Services (Display on Homepage)"}
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

      {/* Two compact uploads (first in DOM → RTL right) + title fields (wider); row stretch matches img 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:items-stretch">
        <div className="flex min-h-[200px] flex-col gap-4 sm:flex-row lg:col-span-2 lg:min-h-0">
          <div className="flex min-h-0 flex-1 flex-col">
            <FormField
              control={control}
              name="main_image"
              render={({ field }) => (
                <FormItem className="flex h-full min-h-0 flex-col">
                  <FormControl className="flex flex-1">
                    <ProjectImageUpload
                      label={t("mainImage") || "Main Image"}
                      required={false}
                      onChange={(file) => field.onChange(file)}
                      initialValue={mainImageInitialValue}
                      className="mt-1 flex-1"
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <FormField
              control={control}
              name="sub_images"
              render={({ field }) => (
                <FormItem className="flex h-full min-h-0 flex-col">
                  <FormControl className="flex flex-1">
                    <ProjectImageUpload
                      label={t("subImages") || "Sub Images"}
                      required={false}
                      multiple={true}
                      onMultipleChange={(files) => field.onChange(files)}
                      initialValue={subImagesInitialValue}
                      className="mt-1 flex-1"
                      showDeleteConfirm={true}
                      OnDelete={async (input) => {
                        try {
                          await CompanyDashboardProjectsApi.deleteMedia(
                            projectId ?? "",
                            input.id ?? ""
                          );
                          toast.success(
                            t("deleteSuccess") ||
                              "Image deleted successfully!"
                          );
                        } catch {
                          toast.error(
                            t("deleteError") || "Failed to delete image"
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-4 lg:col-span-3">
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
                    placeholder={t("titleArPlaceholder") || "Enter Project Title Arabic"}
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
                    placeholder={t("titleEnPlaceholder") || "Enter Project Title English"}
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
                  placeholder={t("nameArPlaceholder") || "Enter Project Name Arabic"}
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
                  placeholder={t("nameEnPlaceholder") || "Enter Project Name English"}
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
                placeholder={
                  t("descriptionArPlaceholder") || "Enter description"
                }
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
                placeholder={
                  t("descriptionEnPlaceholder") || "Enter description"
                }
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
