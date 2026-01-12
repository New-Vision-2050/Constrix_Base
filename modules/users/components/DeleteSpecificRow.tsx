import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import InfoIcon from "@/public/icons/InfoIcon";
import { Button } from "@/components/ui/button";
import { UserTableRow } from "@/modules/table/config/EmployeeTableConfig";
import { useMemo, useState } from "react";
import { apiClient } from "@/config/axios-config";
import { toast } from "sonner";
import { ModelsTypes } from "./users-sub-entity-form/constants/ModelsTypes";
import { REGISTRATION_FORMS } from "@/constants/registration-forms";
import { GetCompanyUserFormConfig, useFormWithTableReload } from "@/modules/form-builder";

interface PropsT {
  open: boolean;
  onClose: () => void;
  user: UserTableRow;
  registrationFormSlug?: string;
  handleRefreshWidgetsData?: () => void;
  tableId?: string
}

export default function DeleteSpecificRowDialog(props: PropsT) {
  // declare and define component state and vars
  const { open, onClose, user, registrationFormSlug, handleRefreshWidgetsData, tableId } = props;
  const t = useTranslations("Companies");
  const t2 = useTranslations("companyProfile.officialDocs.docsSettingsDialog");

  const [isLoading, setIsLoading] = useState(false);
  const finalFormConfig = useMemo(() => {
    const registrationFromConfig = registrationFormSlug
      ? REGISTRATION_FORMS[registrationFormSlug]
      : GetCompanyUserFormConfig;

    return Boolean(registrationFromConfig)
      ? registrationFromConfig
      : GetCompanyUserFormConfig;
  }, [registrationFormSlug]);

  const formWithTableReload = useFormWithTableReload({
    config: finalFormConfig(t),
    tableId: tableId ?? "users-table-v2",
  });

  // declare and define helper methods
  const handleDelete = async () => {
    //registrationFormSlug
    setIsLoading(true);
    try {
      /**
       * roles
       * 1 --> mean employee
       * 2 --> mean client
       * 3 --> mean broker
       */
      const roleId =
        registrationFormSlug === ModelsTypes.CLIENT
          ? 2
          : registrationFormSlug === ModelsTypes.BROKER
            ? 3
            : 1;

      await apiClient.delete(
        `/company-users/users/${user.user_id}/specific-role`,
        {
          data: {
            role_id: roleId,
          },
        }
      );
      handleRefreshWidgetsData?.();
      toast.success(t2("deleteSuccess"));
      formWithTableReload.reloadTable();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(t2("deleteError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center justify-center mb-9">
          <DialogTitle>
            <button
              className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              ✕
            </button>
          </DialogTitle>
          <InfoIcon />
        </DialogHeader>
        <DialogDescription asChild>
          <p className="text-center text-lg mb-3">{t2("deleteQuestion")}</p>
        </DialogDescription>
        <DialogFooter className="!items-center !justify-center gap-3">
          <Button
            onClick={handleDelete}
            className="w-32 h-10"
            loading={isLoading}
          >
            {t2("confirm")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-32 h-10"
            disabled={isLoading}
          >
            {t2("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
