/**
 * Basic Info for Theme Setting Form
 */
export interface ThemeSettingBasicInfo {
  websiteIcon: File | null;
  websiteUrl: string;
  websiteIconUrl?: string;
}

/**
 * Simple Color (for common and background)
 */
export interface ThemeSettingSimpleColor {
  light?: string;
  dark?: string;
}

/**
 * Full Color (for primary, secondary, info, warning, error, text)
 */
export interface ThemeSettingFullColor {
  main?: string;
  light?: string;
  dark?: string;
  contrastText?: string;
}

/**
 * Color Palette for Theme Setting Form
 */
export interface ThemeSettingColorPalette {
  common: ThemeSettingSimpleColor;
  background: ThemeSettingSimpleColor;
  primary: ThemeSettingFullColor;
  secondary: ThemeSettingFullColor;
  info: ThemeSettingFullColor;
  warning: ThemeSettingFullColor;
  error: ThemeSettingFullColor;
  text: ThemeSettingFullColor;
}

/**
 * Typography Settings
 */
export interface ThemeSettingTypography {
  htmlFontSize: number;
  fontFamily: string;
  fontSize: number;
  fontWeightLight: number;
  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightBold: number;
}

/**
 * Complete Theme Setting Form Initial Data
 * Used when transforming API response to form data
 */
export interface ThemeSettingFormInitialData {
  basicInfo: ThemeSettingBasicInfo;
  borderRadius: number;
  typography: ThemeSettingTypography;
  palette: ThemeSettingColorPalette;
}

