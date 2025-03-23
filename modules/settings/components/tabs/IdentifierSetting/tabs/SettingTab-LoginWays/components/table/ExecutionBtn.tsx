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
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useModal } from "@/hooks/use-modal";
import { useTableInstance } from "@/modules/table/store/useTableStore";

const LoginWaysExecutionBtn = ({ id }: { id: string }) => {
  const [isOpen, handleOpen, handleClose] = useModal();
  const { reloadTable } = useTableInstance("login-ways-table");
  const t = useTranslations();

  const menuItems = [
    {
      label: "Action 1",
      icon: <EnterIcon className="w-4 h-4 me-2" />,
      func: () => console.log(id),
    },
    {
      label: "Action 2",
      icon: <GearIcon className="w-4 h-4 me-2" />,
      func: () => null,
    },
    {
      label: "Delete",
      icon: <TrashIcon className="w-4 h-4 me-2" />,
      func: handleOpen,
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
      <DeleteConfirmationDialog
        deleteUrl={`/settings/login-way/${id}`}
        onClose={handleClose}
        open={isOpen}
        onSuccess={() => {
          // Reload the table after successful deletion using the centralized method
          reloadTable();
        }}
      />
    </>
  );
};

export default LoginWaysExecutionBtn;
