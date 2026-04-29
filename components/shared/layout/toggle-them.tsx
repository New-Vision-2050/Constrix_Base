"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useEffect, useCallback } from "react";
import { IconButton, Menu, MenuItem, Stack, Box } from "@mui/material";

const GREEN_SYSTEM_KEY = "green-system-mode";

const ToggleTheme = () => {
  const { setTheme, theme } = useTheme();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const resolveGreenSystem = useCallback(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme(prefersDark ? "green-dark" : "green-light");
  }, [setTheme]);

  useEffect(() => {
    const isGreenSystem = localStorage.getItem(GREEN_SYSTEM_KEY) === "true";
    if (!isGreenSystem) return;

    resolveGreenSystem();

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => resolveGreenSystem();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [resolveGreenSystem]);

  const handleTheme = (value: string) => {
    localStorage.setItem(GREEN_SYSTEM_KEY, "false");
    setTheme(value);
    handleClose();
  };

  const isGreen = theme === "green-light" || theme === "green-dark";

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Palette />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isRtl ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isRtl ? "right" : "left",
        }}
      >
        <MenuItem
          onClick={() =>
            handleTheme(
              isGreen
                ? theme === "green-dark"
                  ? "dark"
                  : "light"
                : theme || "dark",
            )
          }
          sx={{
            backgroundColor: !isGreen
              ? "rgba(159, 18, 57, 0.1)"
              : "transparent",
            "&:hover": {
              backgroundColor: !isGreen
                ? "rgba(159, 18, 57, 0.2)"
                : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Default
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleTheme(
              isGreen
                ? theme
                : theme === "dark" || theme === "system"
                  ? "green-dark"
                  : "green-light",
            )
          }
          sx={{
            backgroundColor: isGreen ? "rgba(159, 18, 57, 0.1)" : "transparent",
            "&:hover": {
              backgroundColor: isGreen
                ? "rgba(159, 18, 57, 0.2)"
                : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                display: "inline-block",
                height: "10px",
                width: "10px",
                borderRadius: "50%",
                background: isGreen ? "#25935F" : "#88D8AD",
              }}
            />
            <span>Green</span>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ToggleTheme;
