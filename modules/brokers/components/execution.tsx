import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

import TrashIcon from "@/public/icons/trash";
import { useTranslations } from "next-intl";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useModal } from "@/hooks/use-modal";
import { useTableInstance } from "@/modules/table/store/useTableStore";
import { FormConfig, SheetFormBuilder } from "@/modules/form-builder";
import Eye from "@/public/icons/eye";
import EditIcon from "@/public/icons/edit-icon";

const Execution = ({
  id,
  formConfig,
}: {
  id: string;
  formConfig: FormConfig;
}) => {
  const [isOpen, handleOpen, handleClose] = useModal();
  const [isOpenEdit, handleOpenEdit, handleCloseEdit] = useModal();

  const t = useTranslations("CustomerRelation");
  // Get the reloadTable method directly from the table instance
  const { reloadTable } = useTableInstance("customer-relation-table");

  const menuItems = [
    {
      label: t("View"),
      icon: <Eye />,
      func: handleOpenEdit,
    },
    {
      label: t("Edit"),
      icon: <EditIcon />,
      func: handleOpenEdit,
    },
    {
      label: t("Delete"),
      icon: <TrashIcon className="w-4 h-4 me-2" />,
      func: handleOpen,
    },
  ];

  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button className="px-5 bg-[#8785A2] hover:bg-[#8785A2] rotate-svg-child">
            {t("Actions")}
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
        config={
          formConfig?.isEditMode
            ? formConfig
            : {
                ...formConfig,
                isEditMode: true,
                editApiUrl: formConfig.apiUrl + "/:id",
              }
        }
        isOpen={isOpenEdit}
        onOpenChange={handleCloseEdit}
      />
    </>
  );
};

export default Execution;
