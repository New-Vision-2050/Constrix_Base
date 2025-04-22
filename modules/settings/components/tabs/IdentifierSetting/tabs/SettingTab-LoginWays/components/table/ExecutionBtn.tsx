import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {ChevronDown, EditIcon} from "lucide-react";
import EnterIcon from "@/public/icons/enter";
import TrashIcon from "@/public/icons/trash";
import { useTranslations } from "next-intl";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useModal } from "@/hooks/use-modal";
import { useTableInstance } from "@/modules/table/store/useTableStore";
import { SheetFormBuilder} from "@/modules/form-builder";
import {
    loginWayFormEditConfig
} from "@/modules/settings/components/tabs/IdentifierSetting/tabs/SettingTab-LoginWays/components/form/editConfig";

const LoginWaysExecutionBtn = ({ id }: { id: string }) => {
  const [isOpen, handleOpen, handleClose] = useModal();
  const { reloadTable } = useTableInstance("login-ways-table");
  const t = useTranslations();
  const [isOpenEdit, handleOpenEdit, handleCloseEdit] = useModal();

  const menuItems = [
    {
      label: "Action 1",
      icon: <EnterIcon className="w-4 h-4 me-2" />,
      func: () => console.log(id),
    },
      {
          label: "Edit",
          icon: <EditIcon className="w-4 h-4 me-2" />,
          func: handleOpenEdit,
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
        <SheetFormBuilder
            recordId={id}
            config={loginWayFormEditConfig}
            isOpen={isOpenEdit}
            onOpenChange={handleCloseEdit}
        />
    </>
  );
};

export default LoginWaysExecutionBtn;
