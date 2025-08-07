import React from "react";
import ToggleLang from "./toggle-lang";
import ToggleTheme from "./toggle-them";
import Notification from "./notification";
import { useTranslations } from "next-intl";
import ProfileDrop from "./profile-drop";
import { ClientComponents } from "@/lib/breadcrumbs";

const Header = () => {
  const t = useTranslations();
  return (
    <header className="flex h-16 m-7 mb-5 bg-sidebar shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-3">
      <div className="w-full flex items-center justify-between">
        <ClientComponents.Breadcrumbs showHomeLink={true} />
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
