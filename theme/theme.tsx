"use client";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { DarkPalette } from "./dark.palette";
import { useMemo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LightPalette } from "./light.palette";
import { GreenLightPalette } from "./green-light.palette";
import { GreenDarkPalette } from "./green-dark.palette";
import RtlProvider from "@mui/system/RtlProvider";

// Extend the TypeBackground and PaletteColorOptions interfaces
declare module "@mui/material/styles" {
  interface SimplePaletteColorOptions {
    lightest?: string;
  }

  interface TypeBackground {
    medTransparent?: string;
    darkest: string;
    card?: string;
  }
}

// Create the MUI theme

export default function CustomThemeProvider({
  children,
  direction,
}: CustomThemeProviderProps) {
  const { theme: currentTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveTheme = mounted
    ? currentTheme === "system"
      ? systemTheme
      : currentTheme
    : "dark";

  const palette = useMemo(() => {
    switch (effectiveTheme) {
      case "green-light":
        return GreenLightPalette;
      case "green-dark":
        return GreenDarkPalette;
      case "light":
        return LightPalette;
      default:
        return DarkPalette;
    }
  }, [effectiveTheme]);

  const theme = useMemo(() => {
    return createTheme({
      direction,
      palette,
      shape: {
        borderRadius: 8,
      },
      typography: {
        fontFamily:
          "ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
      },
      components: {
        MuiButtonBase: {
          defaultProps: {
            suppressHydrationWarning: true,
          } as any,
        },
        MuiInputBase: {
          defaultProps: {
            suppressHydrationWarning: true,
          } as any,
        },
        MuiButton: {
          defaultProps: {
            disableElevation: true,
            variant: "contained",
            type: "button",
          },
          styleOverrides: {
            root: {
              fontWeight: 700,
              textTransform: "none",
            },
          },
        },

        // Must be removed
        MuiTypography: {
          defaultProps: {
            color: "text.primary",
          },
        },
        MuiTable: {
          styleOverrides: {
            root: {},
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              border: "none",
            },
          },
        },
        MuiPaper: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
      },
    });
  }, [palette, direction]);

  const withResponsiveFontSizes = useMemo(
    () => ({ ...responsiveFontSizes(theme), direction }),
    [theme, direction],
  );

  return (
    <ThemeProvider theme={withResponsiveFontSizes}>
      <RtlProvider value={direction === "rtl"}>{children}</RtlProvider>
    </ThemeProvider>
  );
}
type CustomThemeProviderProps = {
  children: React.ReactNode;
  direction: "rtl" | "ltr";
};
