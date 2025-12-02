/**
 * Color Palette parameters for theme update
 */
export interface ColorPaletteParams {
  slug: string;
  name: string;
  black?: string;
  white?: string;
  paper?: string;
  default?: string;
  primary?: string;
  secondary?: string;
  divider?: string;
  disabled?: string;
  main?: string;
  light?: string;
  dark?: string;
  contrast?: string;
}

/**
 * Parameters for updating Theme Settings
 */
export interface UpdateThemeSettingParams {
  url?: string;
  icon?: File | null;
  radius: number;
  html_font_size: number;
  font_family: string;
  font_size: string;
  font_weight_light: string;
  font_weight_regular: string;
  font_weight_medium: string;
  font_weight_bold: string;
  color_palettes: ColorPaletteParams[];
}

