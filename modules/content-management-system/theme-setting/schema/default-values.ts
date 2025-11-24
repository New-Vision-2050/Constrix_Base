import { ThemeSettingFormData } from "./theme-setting-form.schema";

/**
 * Default form values for theme setting form
 * Provides initial state for React Hook Form
 */
export const getDefaultThemeSettingFormValues = (): ThemeSettingFormData => ({
  basicInfo: {
    websiteIcon: null,
    websiteUrl: "",
  },
  palette: {
    common: {
      light: "#ffffff",
      dark: "#000000",
    },
    background: {
      light: "#ffffff",
      dark: "#121212",
    },
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#ffffff",
    },
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#ffffff",
    },
    text: {
      main: "#000000",
      light: "#666666",
      dark: "#000000",
      contrastText: "#ffffff",
    },
  },
  borderRadius: 4,
  typography: {
    htmlFontSize: 16,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
});

