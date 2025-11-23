"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/modules/table/components/ui/form";
import { Button } from "@/components/ui/button";
import ColorRow from "./components/color-row";
import {
  getPrimaryColors,
  getSecondaryColors,
  getInfoColors,
  getWarningColors,
  getErrorColors,
  getTextColors,
} from "./constants";
import {
  createThemeSettingFormSchema,
  getDefaultThemeSettingFormValues,
  ThemeSettingFormData,
} from "./schema";

/**
 * Example usage of ColorItem component
 * Demonstrates integration with React Hook Form and i18n
 */
export default function ThemeSettingExample() {
  const t = useTranslations("content-management-system.themeSetting");

  const form = useForm<ThemeSettingFormData>({
    resolver: zodResolver(createThemeSettingFormSchema(t)),
    defaultValues: getDefaultThemeSettingFormValues(),
  });

  const onSubmit = (data: ThemeSettingFormData) => {
    console.log("Theme settings:", data);
  };

  return (
    <div className="px-6 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-6 bg-background rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-white">
              Theme Settings
            </h2>

            {/* Primary Colors */}
            <ColorRow
              control={form.control}
              colors={getPrimaryColors(t)}
              columns={4}
            />

            {/* Secondary Colors */}
            <ColorRow
              control={form.control}
              colors={getSecondaryColors(t)}
              columns={4}
            />

            {/* Info Colors */}
            <ColorRow
              control={form.control}
              colors={getInfoColors(t)}
              columns={4}
            />

            {/* Warning Colors */}
            <ColorRow
              control={form.control}
              colors={getWarningColors(t)}
              columns={4}
            />

            {/* Error Colors */}
            <ColorRow
              control={form.control}
              colors={getErrorColors(t)}
              columns={4}
            />

            {/* Text Colors */}
            <ColorRow
              control={form.control}
              colors={getTextColors(t)}
              columns={4}
            />
          </div>

          <Button type="submit">Save Theme Settings</Button>
        </form>
      </Form>
    </div>
  );
}

