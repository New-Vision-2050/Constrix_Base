"use client";
import { ThemeSettingData } from "@/services/api/company-dashboard/theme-setting/types/response";
import ThemeSettingForm from "./components";
import { useEffect, useMemo } from "react";
import { ThemeSettingFormInitialData } from "./types";

export default function ThemeSettingModule({ initialData }: { initialData: ThemeSettingData }) {
    // flat incoming data to form data
    const formData: ThemeSettingFormInitialData = useMemo(() => {
        const colors = initialData.color_palettes;
        const common = colors?.common;
        const background = colors?.background;
        const primary = colors?.primary;
        const secondary = colors?.secondary;
        const info = colors?.info;
        const warning = colors?.warning;
        const error = colors?.error;
        const text = colors?.text;
        return {
            basicInfo: {
                // base 
                websiteIcon: null,
                websiteUrl: initialData.url || "",
            },
            borderRadius: initialData.radius,
            typography: {
                // typography
                htmlFontSize: initialData.html_font_size,
                fontFamily: initialData.font_family,
                fontSize: parseInt(initialData.font_size) || 14,
                fontWeightLight: parseInt(initialData.font_weight_light) || 300,
                fontWeightRegular: parseInt(initialData.font_weight_regular) || 400,
                fontWeightMedium: parseInt(initialData.font_weight_medium) || 500,
                fontWeightBold: parseInt(initialData.font_weight_bold) || 700,
            },
            // color palette
            palette: {
                // common
                common: {
                    light: common?.white || undefined,
                    dark: common?.black || undefined,
                },
                // background
                background: {
                    light: background?.paper || undefined,
                    dark: background?.default || undefined,
                },
                // primary
                primary: {
                    main: primary?.primary || undefined,
                    light: primary?.light || undefined,
                    dark: primary?.dark || undefined,
                    contrastText: primary?.contrast || undefined,
                },
                // secondary
                secondary: {
                    main: secondary?.primary || undefined,
                    light: secondary?.light || undefined,
                    dark: secondary?.dark || undefined,
                    contrastText: secondary?.contrast || undefined,
                },
                // info
                info: {
                    main: info?.primary || undefined,
                    light: info?.light || undefined,
                    dark: info?.dark || undefined,
                    contrastText: info?.contrast || undefined,
                },
                // warning
                warning: {
                    main: warning?.primary || undefined,
                    light: warning?.light || undefined,
                    dark: warning?.dark || undefined,
                    contrastText: warning?.contrast || undefined,
                },
                // error
                error: {
                    main: error?.primary || undefined,
                    light: error?.light || undefined,
                    dark: error?.dark || undefined,
                    contrastText: error?.contrast || undefined,
                },
                // text
                text: {
                    main: text?.primary || undefined,
                    light: text?.secondary || undefined,
                    dark: text?.divider || undefined,
                    contrastText: text?.disabled || undefined,
                },
            }
        }
    }, [initialData]);
    
    return <div className="px-6 py-2 flex flex-col gap-4">
        <ThemeSettingForm initialData={formData} />
    </div>
}