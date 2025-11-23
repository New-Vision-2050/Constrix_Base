import { ColorConfig } from "../components/color-row";
import { ThemeSettingFormData } from "../schema";

/**
 * Theme color configurations factory functions
 * Uses translation function for internationalization support
 * 
 * @param t - Translation function for localized labels
 * @returns Color configuration arrays with translated labels
 */

export const getPrimaryColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.primary.main", label: t("primary") },
  { name: "palette.primary.light", label: t("light") },
  { name: "palette.primary.dark", label: t("dark") },
  { name: "palette.primary.contrastText", label: t("contrast") },
];

export const getSecondaryColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.secondary.main", label: t("primary") },
  { name: "palette.secondary.light", label: t("light") },
  { name: "palette.secondary.dark", label: t("dark") },
  { name: "palette.secondary.contrastText", label: t("contrast") },
];

export const getInfoColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.info.main", label: t("primary") },
  { name: "palette.info.light", label: t("light") },
  { name: "palette.info.dark", label: t("dark") },
  { name: "palette.info.contrastText", label: t("contrast") },
];

export const getWarningColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.warning.main", label: t("primary") },
  { name: "palette.warning.light", label: t("light") },
  { name: "palette.warning.dark", label: t("dark") },
  { name: "palette.warning.contrastText", label: t("contrast") },
];

export const getErrorColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.error.main", label: t("primary") },
  { name: "palette.error.light", label: t("light") },
  { name: "palette.error.dark", label: t("dark") },
  { name: "palette.error.contrastText", label: t("contrast") },
];

export const getTextColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.text.main", label: t("primary") },
  { name: "palette.text.light", label: t("light") },
  { name: "palette.text.dark", label: t("dark") },
  { name: "palette.text.contrastText", label: t("contrast") },
];

export const getCommonColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.common.light", label: t("light") },
  { name: "palette.common.dark", label: t("dark") },
];

export const getBackgroundColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.background.light", label: t("light") },
  { name: "palette.background.dark", label: t("dark") },
];

