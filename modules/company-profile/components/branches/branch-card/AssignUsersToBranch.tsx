import {
  DialogClose,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { useCompanyEmployees } from "@/modules/company-profile/query/useCompanyEmployees";
import { DialogDescription } from "@radix-ui/react-dialog";
import { apiClient } from "@/config/axios-config";
import { toast } from "sonner";
import { Manager } from "@/modules/company-profile/types/company";
import useCurrentAuthCompany from "@/hooks/use-auth-company";

type PropsT = {
  branchId: string;
  usersIds: string[];
  manager: Manager | null;
  isOpen: boolean;
  handleClose: () => void;
  handleBranchesRefetch: () => void;
};

export default function AssignUsersToBranch(props: PropsT) {
  const { data } = useCompanyEmployees();
  const { data: authCompany } = useCurrentAuthCompany();
  const t = useTranslations("companyProfile.tabs.branches.assignUsersDialog");
  const {
    branchId,
    usersIds,
    manager,
    isOpen,
    handleClose,
    handleBranchesRefetch,
  } = props;

  // State for selected users
  const [selectedUsers, setSelectedUsers] = useState<string[]>(usersIds || []);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // Reset selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedUsers(usersIds || []);
    } else {
      setSelectedUsers([]);
    }
  }, [isOpen, usersIds]);

  // Handle selection change
  const handleSelectionChange = (values: string[]) => {
    setSelectedUsers(values);
  };

  // Handle assign button click
  const handleAssign = async () => {
    setIsLoading(true);
    try {
      const body = {
        branch_id: branchId,
        user_ids: selectedUsers,
      };
      await apiClient.post(
        `management_hierarchies/user-access/assign-users`,
        body
      );

      toast.success("تم تعيين المستخدمين بنجاح");
      handleBranchesRefetch();
      handleClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء تعيين المستخدمين");
      console.log("Error in handleAssign", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert available users to options format
  const options = useMemo(() => {
    return (
      data
        ?.filter(
          (user) =>
            user?.id !== manager?.id &&
            user?.id !== authCompany?.payload?.owner_id
        )
        ?.map((user) => ({
          label: user?.name,
          value: user?.id,
        })) || []
    );
  }, [data, manager, authCompany]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl min-h-96">
        <DialogHeader>
          <DialogTitle className="text-center">{t("title")}</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t("description")}
            <br />
            {t("managerNote")}
            <span className="text-primary">{authCompany?.payload?.owner_name}</span>
            {' , '}
            {t("branchManager")}
            <span className="text-primary">{manager?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <SearchableMultiSelect
          options={options}
          selectedValues={selectedUsers}
          onChange={handleSelectionChange}
          placeholder={t("searchUsers")}
        />

        <DialogFooter className="gap-3 mt-4">
          <Button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleAssign}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("assign")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
