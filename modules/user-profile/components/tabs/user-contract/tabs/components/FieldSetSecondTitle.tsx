"use client";
import {
  DropdownItemT,
  IconBtnDropdown,
} from "@/components/shared/IconBtnDropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EyeIcon from "@/public/icons/eye-icon";
import PencilLineIcon from "@/public/icons/pencil-line";
import SettingsIcon from "@/public/icons/settings";
import { useLocale } from "next-intl";

type DropdownItem = {
  label: string;
  onClick: () => void;
};

type PropsT = {
  mode: "Edit" | "Preview";
  handleEditClick: () => void;
  dropdownItems?: DropdownItem[];
  settingsBtn?: {
    icon?: JSX.Element;
    items: DropdownItemT[];
  };
};

export default function FieldSetSecondTitle(props: PropsT) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { mode, handleEditClick, dropdownItems, settingsBtn } = props;

  return (
    <div className="flex items-center justify-center gap-1">
      {!!settingsBtn && (
        <IconBtnDropdown
          icon={settingsBtn?.icon ?? <SettingsIcon />}
          items={settingsBtn?.items ?? []}
        />
      )}
      {!!dropdownItems && (
        <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <SettingsIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {dropdownItems.map((item, index) => (
              <DropdownMenuItem key={index} onClick={() => item.onClick()}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Button variant={"ghost"} onClick={handleEditClick}>
        {mode === "Preview" ? (
          <PencilLineIcon additionalClass="text-pink-600" />
        ) : (
          <EyeIcon />
        )}
      </Button>
    </div>
  );
}
