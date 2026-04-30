"use client";

import { useState } from "react";
import LangIcon from "@/public/icons/lang";
import { usePathname } from "@i18n/navigation";
import { SA, US } from "country-flag-icons/react/3x2";
import { useLocale } from "next-intl";
import { Check, Languages } from "lucide-react";
import { IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { LanguageSharp } from "@mui/icons-material";

const ToggleLang = () => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLocaleChange = (newLocale: string) => {
    // Get the base path (e.g., /companies)
    const basePath = pathname.replace(/^\/(en|ar)/, ``);

    // Construct the new path with the new locale
    const newPathname = `/${newLocale}${basePath}`;
    window.location.href = newPathname;
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLocale = (newLocale: string) => {
    handleClose();
    handleLocaleChange(newLocale);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Languages />
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
          onClick={() => handleSelectLocale("en")}
          selected={locale === "en"}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <US style={{ width: "20px" }} title="United States" />
            <span>English</span>
            {locale === "en" && <Check size={16} />}
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => handleSelectLocale("ar")}
          selected={locale === "ar"}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SA style={{ width: "20px" }} title="Saudi Arabia" />
            <span>العربية</span>
            {locale === "ar" && <Check size={16} />}
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ToggleLang;
