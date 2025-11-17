"use client";

import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { ProjectFormData } from "../../schema/project-form.schema";

/**
 * Project Details Array Component
 * Handles repeatable details section with add/remove functionality
 * Follows Single Responsibility Principle
 */
interface ProjectDetailsArrayProps {
  control: Control<ProjectFormData>;
  isSubmitting: boolean;
  isFetching: boolean;
  t: (key: string) => string;
  serviceOptions: { value: string; label: string }[];
}

export default function ProjectDetailsArray({
  control,
  isSubmitting,
  isFetching,
  t,
  serviceOptions,
}: ProjectDetailsArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const handleAddDetail = () => {
    append({
      detail_ar: "",
      detail_en: "",
      service_id: "",
    });
  };

  const handleRemoveDetail = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 bg-sidebar/50"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
            <h4 className="text-sm font-semibold text-white">
              {t("details")} ({index + 1})
            </h4>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveDetail(index)}
                disabled={isSubmitting || isFetching}
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t("deleteDetail") || "Delete Detail"}</span>
                <span className="sm:hidden">{t("delete") || "Delete"}</span>
              </Button>
            )}
          </div>

          {/* Project Name Arabic & English - Side by side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Detail Arabic */}
            <FormField
              control={control}
              name={`details.${index}.detail_ar`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs" required>
                    {t("detailAr") || "Detail Arabic"}
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

            {/* Detail English */}
            <FormField
              control={control}
              name={`details.${index}.detail_en`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    {t("detailEn") || "Detail English"}
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

          {/* Service */}
          <FormField
            control={control}
            name={`details.${index}.service_id`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs" required>
                  {t("service") || "Service"}
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
                        placeholder={t("servicePlaceholder") || "Select Service"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((option) => (
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
        </div>
      ))}

      {/* Add Detail Button */}
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddDetail}
          disabled={isSubmitting || isFetching}
          className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("addDetail") || "Add Detail"}
        </Button>
      </div>
    </div>
  );
}

