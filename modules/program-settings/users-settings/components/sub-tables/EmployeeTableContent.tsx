import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserTableRow } from "@/modules/table/utils/configs/usersTableConfig";

interface PropsT {
  open: boolean;
  onClose: () => void;
  user: UserTableRow;
}

const EmployeeTableContent: React.FC<PropsT> = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="items-center justify-center mb-9">
          <DialogTitle>
            <button
              className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              ✕
            </button>
            <p className="text-lg font-bold">محتويات جدول الموظفين</p>
          </DialogTitle>
        </DialogHeader>
        <DialogContent className="w-full">
          <div>omar</div>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeTableContent;
