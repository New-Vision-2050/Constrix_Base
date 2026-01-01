"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/modules/table/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BasicInfoSection from "./basic-info-section";
import BorderRadiusSection from "./border-radius-section";
import ColorPaletteSection from "./color-palette-section";
import TypographySection from "./typography-section";
import {
  createThemeSettingFormSchema,
  getDefaultThemeSettingFormValues,
  ThemeSettingFormData,
} from "../schema";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CompanyDashboardThemeSettingApi } from "@/services/api/company-dashboard/theme-setting";
import { ThemeSettingFormInitialData } from "../types";
import { useEffect } from "react";

/**
 * Theme Setting Form Component
 * Main form for theme settings with all sections
 */
function ThemeSettingForm({ initialData }: { initialData: ThemeSettingFormInitialData }) {
  const t = useTranslations("content-management-system.themeSetting");
  const tCommon = useTranslations("content-management-system.themeSetting.common");
  const tBasicInfo = useTranslations("content-management-system.themeSetting.basicInfo");
  const tBorderRadius = useTranslations("content-management-system.themeSetting.borderRadius");
  const tTypography = useTranslations("content-management-system.themeSetting.typography");

  const form = useForm<ThemeSettingFormData>({
    resolver: zodResolver(createThemeSettingFormSchema(tBorderRadius)),
    defaultValues: Boolean(initialData) ? initialData as ThemeSettingFormData : undefined,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  // set initial data
  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const onSubmit = async (data: ThemeSettingFormData) => {
    try {
      const payload = {
        // basic info
        url: data.basicInfo.websiteUrl,
        icon: data.basicInfo.websiteIcon,
        // border radius
        radius: data.borderRadius,
        // typography
        html_font_size: data.typography.htmlFontSize,
        font_family: data.typography.fontFamily,
        font_size: data.typography.fontSize.toString(),
        font_weight_light: data.typography.fontWeightLight.toString(),
        font_weight_regular: data.typography.fontWeightRegular.toString(),
        font_weight_medium: data.typography.fontWeightMedium.toString(),
        font_weight_bold: data.typography.fontWeightBold.toString(),
        // color palette
        color_palettes: Object.entries(data.palette).map(([key, value]) => {
          switch (key) {
            case "common":
              return {
                slug: key,
                name: "Common (black and white)",
                black: value.dark,
                white: value.light
              }
            case "background":
              return {
                slug: key,
                name: "Background",
                paper: value.light,
                default: value.dark,
              }
            case "text":
              return {
                slug: key,
                name: "Text",
                primary: "main" in value ? value.main : undefined,
                secondary: value.light,
                divider: value.dark,
                disabled: "contrastText" in value ? value.contrastText : undefined,
              }
            default:
              return {
                slug: key,
                name: key,
                primary: "main" in value ? value.main : undefined,
                light: value.light,
                dark: value.dark,
                contrast: "contrastText" in value ? value.contrastText : undefined,
              }
          }
        }),
      }
      await CompanyDashboardThemeSettingApi.updateCurrent(payload);
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
            initialIconUrl={initialData.basicInfo.websiteIconUrl}
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

          {/* Typography Section */}
          <TypographySection
            control={form.control}
            title={tTypography("title")}
            isSubmitting={isSubmitting}
            t={tTypography}
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

export default withPermissions(ThemeSettingForm, [PERMISSIONS.CMS.themeSetting.update]);