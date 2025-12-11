import { ApiBaseResponse } from "@/types/common/response/base";

/**
 * Color Palette Item
 */
export interface ColorPaletteItem {
  id: string;
  slug: string;
  name: string;
  primary: string | null;
  light: string;
  dark: string;
  contrast: string | null;
  paper: string | null;
  default: string | null;
  secondary: string | null;
  divider: string | null;
  disabled: string | null;
  black: string | null;
  white: string | null;
}

/**
 * Color Palettes structure from API
 */
export interface ColorPalettes {
  common: ColorPaletteItem;
  primary: ColorPaletteItem;
  secondary: ColorPaletteItem;
  info: ColorPaletteItem;
  warning: ColorPaletteItem;
  error: ColorPaletteItem;
  text: ColorPaletteItem;
  background: ColorPaletteItem;
}

/**
 * Theme Setting data structure
 */
export interface ThemeSettingData {
  id: string;
  company_id: string;
  url: string | null;
  radius: number;
  icon_url: string | null;
  html_font_size: number;
  font_family: string;
  font_size: string;
  font_weight_light: string;
  font_weight_regular: string;
  font_weight_medium: string;
  font_weight_bold: string;
  status: 0 | 1;
  created_at: string;
  updated_at: string;
  color_palettes: ColorPalettes;
}

/**
 * Response for getting current theme settings
 */
export interface GetCurrentThemeSettingResponse extends ApiBaseResponse<ThemeSettingData> {}

/**
 * Response for updating theme settings
 */
export interface UpdateThemeSettingResponse extends ApiBaseResponse<ThemeSettingData> {}

