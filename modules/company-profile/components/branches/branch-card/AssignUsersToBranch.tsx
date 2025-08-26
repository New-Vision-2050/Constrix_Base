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
import { useState, useEffect } from "react";
import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";

type PropsT = {
  branchId: string;
  usersIds: string[];
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
};

export default function AssignUsersToBranch(props: PropsT) {
  const t = useTranslations("companyProfile.tabs.branches.assignUsersDialog");
  const { 
    branchId, 
    usersIds, 
    isOpen, 
    handleOpen, 
    handleClose
  } = props;

  // State for selected users
  const [selectedUsers, setSelectedUsers] = useState<string[]>(usersIds || []);

  // Reset selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedUsers(usersIds || []);
    }
  }, [isOpen, usersIds]);

  // Handle selection change
  const handleSelectionChange = (values: string[]) => {
    setSelectedUsers(values);
  };

  // Handle assign button click
  const handleAssign = () => {
    handleClose();
  };

  // Convert available users to options format
  const options = [
    {label: "Ahmed Mohamed", value: "1"},
    {label: "Mohamed Ali", value: "2"},
    {label: "Mostafa", value: "3"},
    {label: "Sallam", value: "4"},
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{t("title")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t("description")}</p>
        
        <SearchableMultiSelect
          options={options}
          selectedValues={selectedUsers}
          onChange={handleSelectionChange}
          placeholder={t("searchUsers")}
        />
        
        <DialogFooter className="gap-3 mt-4">
          <DialogClose className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            {t("cancel")}
          </DialogClose>
          <Button 
            onClick={handleAssign}
            disabled={selectedUsers.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("assign")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
