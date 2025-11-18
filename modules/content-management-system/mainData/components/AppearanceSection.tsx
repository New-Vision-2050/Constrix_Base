"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/shared/ColorPicker";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { MainDataFormData } from "../schemas/main-data-form.schema";

interface AppearanceSectionProps {
  form: UseFormReturn<MainDataFormData>;
  isSaving: boolean;
}

export default function AppearanceSection({
  form,
  isSaving,
}: AppearanceSectionProps) {
  const t = useTranslations("content-management-system.mainData");

  return (
    <div className="backdrop-blur-sm rounded-xl border p-6 space-y-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-6 text-right">
        {t("appearance.title")}
      </h2>

      {/* Color Pickers - Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Primary Color */}
        <FormField
          control={form.control}
          name="primary_color"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ColorPicker
                  label={t("appearance.primaryColor")}
                  value={field.value}
                  onChange={(color) => field.onChange(color)}
                  className="z-10"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* Secondary Color */}
        <FormField
          control={form.control}
          name="secondary_color"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ColorPicker
                  label={t("appearance.secondaryColor")}
                  value={field.value}
                  onChange={(color) => field.onChange(color)}
                  className="z-10"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* Background Color */}
        <FormField
          control={form.control}
          name="background_color"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ColorPicker
                  label={t("appearance.backgroundColor")}
                  value={field.value}
                  onChange={(color) => field.onChange(color)}
                  className="z-10"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          loading={isSaving}
          className="text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-200"
        >
          {t("appearance.saveChanges")}
        </Button>
      </div>
    </div>
  );
}
