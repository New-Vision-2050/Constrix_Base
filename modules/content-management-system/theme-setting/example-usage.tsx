"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/modules/table/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BasicInfoSection from "./components/basic-info-section";
import BorderRadiusSection from "./components/border-radius-section";
import ColorPaletteSection from "./components/color-palette-section";
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
  const tBorderRadius = useTranslations("content-management-system.themeSetting.borderRadius");

  const form = useForm<ThemeSettingFormData>({
    resolver: zodResolver(createThemeSettingFormSchema(tBorderRadius)),
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

          {/* Color Palette Section */}
          <ColorPaletteSection
            control={form.control}
            title={tCommon("palette")}
            t={tCommon}
          />

          {/* Border Radius Section */}
          <BorderRadiusSection
            control={form.control}
            title={tBorderRadius("title")}
            label={tBorderRadius("label")}
            isSubmitting={isSubmitting}
          />

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

