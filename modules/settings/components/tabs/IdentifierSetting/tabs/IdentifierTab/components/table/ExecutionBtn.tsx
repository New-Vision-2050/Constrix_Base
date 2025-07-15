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
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

const LoginIdentifierExecutionBtn = ({ id }: { id: string }) => {
  const canDelete = can(PERMISSION_ACTIONS.DELETE, PERMISSION_SUBJECTS.IDENTIFIER) as boolean
  const [isOpen, handleOpen, handleClose] = useModal();
  const t = useTranslations();

  const menuItems = [
    ...(canDelete
      ? [
          {
            label: "حذف",
            icon: <TrashIcon className="w-4 h-4 me-2" />,
            func: handleOpen,
          },
        ]
      : []),
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
            <DropdownMenuItem key={index} className="text-error" onClick={item.func}>
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        deleteUrl={`/companies/${id}`}
        onClose={handleClose}
        open={isOpen}
        onSuccess={() => console.log("success deleting")}
      />
    </>
  );
};

export default LoginIdentifierExecutionBtn;
