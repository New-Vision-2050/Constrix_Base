import React from "react";
import ToggleLang from "./toggle-lang";
import ToggleTheme from "./toggle-them";
import Notification from "./notification";
import ProfileDrop from "./profile-drop";
import Breadcrumbs, { getRoutesMap } from "../breadcrumbs";
import { useLocale, useTranslations } from "next-intl";
import { IconButton } from "@mui/material";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

const Header = ({ onMobileMenuClick }: HeaderProps) => {
  const locale = useLocale();
  // Get the routes map based on the current language
  const t = useTranslations("breadcrumbs");
  const routesMap = getRoutesMap(locale, t);

  return (
    <header className="flex h-16 m-7 mb-5 bg-sidebar shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-3">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          <Breadcrumbs
            homeLabel={locale === "ar" ? "الرئيسية" : "Home"}
            className="breadcrumbs-container"
            routesMap={routesMap}
          />
        </div>
        <div className="flex gap-6">
          <ToggleLang />
          <ToggleTheme />
          <Notification />
          <ProfileDrop />
        </div>
      </div>
    </header>
  );
};

export default Header;
