"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/modules/table/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ColorRow from "./components/color-row";
import BasicInfoSection from "./components/basic-info-section";
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
  const tBasicInfo = useTranslations("content-management-system.themeSetting.basicInfo");

  const form = useForm<ThemeSettingFormData>({
    resolver: zodResolver(createThemeSettingFormSchema(t)),
    defaultValues: getDefaultThemeSettingFormValues(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: ThemeSettingFormData) => {
    try {
      console.log("Theme settings:", data);
      // TODO: API call here
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="px-6 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <BasicInfoSection
            control={form.control}
            title={tBasicInfo("title")}
            iconLabel={tBasicInfo("iconLabel")}
            urlLabel={tBasicInfo("urlLabel")}
            isSubmitting={isSubmitting}
          />

          {/* Theme Settings */}
          <div className="space-y-6 bg-background rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-white">
              {t("themeSettings")}
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("saveChanges") || "حفظ التعديل"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

