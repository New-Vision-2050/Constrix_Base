import React from "react";
import ToggleLang from "./toggle-lang";
import ToggleTheme from "./toggle-them";
import ToggleMode from "./toggle-mode";
import Notification from "./notification";
import ProfileDrop from "./profile-drop";
import Breadcrumbs, { getRoutesMap } from "../breadcrumbs";
import { useLocale, useTranslations } from "next-intl";
import { Box, Stack, IconButton, useTheme } from "@mui/material";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

const Header = ({ onMobileMenuClick }: HeaderProps) => {
  const locale = useLocale();
  const theme = useTheme();

  // Get the routes map based on the current language
  const t = useTranslations("breadcrumbs");
  const routesMap = getRoutesMap(locale, t);

  // Get theme-aware colors for glass-morphism effect
  const bgColor =
    theme.palette.mode === "dark"
      ? "rgba(30, 41, 59, 0.75)"
      : "rgba(248, 250, 252, 0.75)";
  const borderColor =
    theme.palette.mode === "dark"
      ? "rgba(148, 163, 184, 0.12)"
      : "rgba(203, 213, 225, 0.4)";

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        height: "64px",
        mx: 3.5,
        mb: 2.5,
        mt: 2,
        backgroundColor: bgColor,
        backdropFilter: "blur(15px)",
        borderRadius: "12px",
        border: `1px solid ${borderColor}`,
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        alignItems: "center",
        gap: 2,
        transition: "all 200ms ease-in-out",
        px: 3,
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side - Menu button + Breadcrumbs */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={onMobileMenuClick}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "inherit",
            }}
            size="small"
          >
            <Menu size={20} />
          </IconButton>
          <Box className="breadcrumbs-container">
            <Breadcrumbs
              homeLabel={t("home")}
              className="breadcrumbs-container"
              routesMap={routesMap}
            />
          </Box>
        </Stack>

        {/* Right side - Toggle buttons */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
          }}
        >
          <ToggleLang />
          <ToggleMode />
          <ToggleTheme />
          <Notification />
          <ProfileDrop />
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
