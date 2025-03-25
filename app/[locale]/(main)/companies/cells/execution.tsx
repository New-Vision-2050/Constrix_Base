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
import {FormConfig, SheetFormBuilder} from "@/modules/form-builder";

const Execution = ({ id ,formConfig}: { id: string,formConfig: FormConfig }) => {
  const [isOpen, handleOpen, handleClose] = useModal();
  const [isOpenEdit, handleOpenEdit, handleCloseEdit] = useModal();

  const t = useTranslations();
  // Get the reloadTable method directly from the table instance
  const { reloadTable } = useTableInstance("companies-table");

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
          label: t("Companies.Edit"),
          icon: <TrashIcon className="w-4 h-4 me-2" />,
          func: handleOpenEdit,
      },
    {
      label: t("Companies.Delete"),
      icon: <TrashIcon className="w-4 h-4 me-2" />,
      func: handleOpen,
    }
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
        deleteUrl={`${formConfig.apiUrl}/${id}`}
        onClose={handleClose}
        open={isOpen}
        onSuccess={() => {
          reloadTable();
        }}
      />
      <SheetFormBuilder
        recordId={id}
        config={formConfig?.isEditMode ? formConfig : {...formConfig, isEditMode:true,editApiUrl:formConfig.apiUrl+'/:id'}}
        isOpen={isOpenEdit}
        onOpenChange={handleCloseEdit}
      />
    </>
  );
};

export default Execution;
