import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import EnterIcon from "@/public/icons/enter";
import { useTranslations } from "next-intl";

const LanguagesSettingsActionsBtn = ({ id }: { id: string }) => {
  const t = useTranslations();
  // const { reloadTable } = useTableInstance("countries-table");

  const menuItems = [
    {
      label: "Action 1",
      icon: <EnterIcon className="w-4 h-4 me-2" />,
      func: () => console.log(id),
    },
  ];

  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button className="px-5 bg-[#8785A2] hover:bg-[#8785A2] rotate-svg-child">
            {t("Companies.Actions")}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {menuItems.map((item, index) => (
            <DropdownMenuItem key={index} onClick={item.func}>
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default LanguagesSettingsActionsBtn;
