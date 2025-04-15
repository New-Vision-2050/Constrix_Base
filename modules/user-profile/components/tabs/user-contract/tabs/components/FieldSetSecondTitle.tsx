"use client";
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
};

export default function FieldSetSecondTitle(props: PropsT) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const {
    mode,
    handleEditClick,
    dropdownItems = [{ label: "Dummy", onClick: () => null }],
  } = props;

  return (
    <div className="flex items-center justify-center gap-1">
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
