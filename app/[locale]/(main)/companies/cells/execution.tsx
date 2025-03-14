import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import EnterIcon from "@/public/icons/enter";
import GearIcon from "@/public/icons/gear";
import TrashIcon from "@/public/icons/trash";
import { useTranslations } from "next-intl";

const Execution = ({ id }: { id: string }) => {
  const t = useTranslations();
  
  const menuItems = [
    {
      label: t("Companies.LoginAsManager"),
      icon: <EnterIcon className="w-4 h-4 me-2" />,
      func: () => console.log(id),
    },
    {
      label: t("Companies.PackageSettings"),
      icon: <GearIcon className="w-4 h-4 me-2" />,
      func: () => null,
    },
    {
      label: t("Companies.Delete"),
      icon: <TrashIcon className="w-4 h-4 me-2" />,
      func: () => null,
    },
  ];
  
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button className="px-5 bg-[#8785A2] hover:bg-[#8785A2] rotate-svg-child">
          {t("Companies.Actions")}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menuItems.map((item, index) => (
          <DropdownMenuItem key={index}>
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Execution;
