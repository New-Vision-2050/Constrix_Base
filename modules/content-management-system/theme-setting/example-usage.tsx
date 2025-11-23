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
  const tCommon = useTranslations("content-management-system.themeSetting.common");

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
              colors={getPrimaryColors(tCommon)}
              columns={4}
              title={tCommon('primaryColor')}
            />

            {/* Secondary Colors */}
            <ColorRow
              control={form.control}
              colors={getSecondaryColors(tCommon)}
              columns={4}
              title={tCommon('secondaryColor')}
            />

            {/* Info Colors */}
            <ColorRow
              control={form.control}
              colors={getInfoColors(tCommon)}
              columns={4}
              title={tCommon('infoColor')}
            />

            {/* Warning Colors */}
            <ColorRow
              control={form.control}
              colors={getWarningColors(tCommon)}
              columns={4}
              title={tCommon('warningColor')}
            />

            {/* Error Colors */}
            <ColorRow
              control={form.control}
              colors={getErrorColors(tCommon)}
              columns={4}
              title={tCommon('errorColor')}
            />

            {/* Text Colors */}
            <ColorRow
              control={form.control}
              colors={getTextColors(tCommon)}
              columns={4}
              title={tCommon('textColor')}
            />
          </div>

          <Button type="submit">Save Theme Settings</Button>
        </form>
      </Form>
    </div>
  );
}

