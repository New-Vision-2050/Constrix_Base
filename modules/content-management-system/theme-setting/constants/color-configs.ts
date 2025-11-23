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
  { name: "palette.primary.main", label: t("primaryMain") },
  { name: "palette.primary.light", label: t("primaryLight") },
  { name: "palette.primary.dark", label: t("primaryDark") },
  { name: "palette.primary.contrastText", label: t("primaryContrast") },
];

export const getSecondaryColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.secondary.main", label: t("secondaryMain") },
  { name: "palette.secondary.light", label: t("secondaryLight") },
  { name: "palette.secondary.dark", label: t("secondaryDark") },
  { name: "palette.secondary.contrastText", label: t("secondaryContrast") },
];

export const getInfoColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.info.main", label: t("infoMain") },
  { name: "palette.info.light", label: t("infoLight") },
  { name: "palette.info.dark", label: t("infoDark") },
  { name: "palette.info.contrastText", label: t("infoContrast") },
];

export const getWarningColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.warning.main", label: t("warningMain") },
  { name: "palette.warning.light", label: t("warningLight") },
  { name: "palette.warning.dark", label: t("warningDark") },
  { name: "palette.warning.contrastText", label: t("warningContrast") },
];

export const getErrorColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.error.main", label: t("errorMain") },
  { name: "palette.error.light", label: t("errorLight") },
  { name: "palette.error.dark", label: t("errorDark") },
  { name: "palette.error.contrastText", label: t("errorContrast") },
];

export const getTextColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.text.main", label: t("textMain") },
  { name: "palette.text.light", label: t("textLight") },
  { name: "palette.text.dark", label: t("textDark") },
  { name: "palette.text.contrastText", label: t("textContrast") },
];

export const getCommonColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.common.light", label: t("commonLight") },
  { name: "palette.common.dark", label: t("commonDark") },
];

export const getBackgroundColors = (
  t: (key: string) => string
): ColorConfig<ThemeSettingFormData>[] => [
  { name: "palette.background.light", label: t("backgroundLight") },
  { name: "palette.background.dark", label: t("backgroundDark") },
];

