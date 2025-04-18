"use client";

import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import CopyIcon from "@/public/icons/copy";
import FolderIcon from "@/public/icons/folder";
import { Trash } from "lucide-react";
import UserActivityLogExample from "./show-table";

const DocsTable = () => {
  const [isOpenDelete, handleOpenDelete, handleCloseDelete] = useModal();
  const [isOpenShow, handleOpenShow, handleCloseShow] = useModal();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <FolderIcon />
          سجل تجاري
        </div>
        <p>اعتماد المكتب</p>
        <div className="flex gap-2 items-center">
          214563{" "}
          <button>
            <CopyIcon />
          </button>
        </div>
        <p> 25/02/2018</p>
        <p> 25/02/2018</p>
        <p> 25/02/2018</p>

        <div className="flex items-center gap-2">
          <p className="text-[10px]">الجدول-الزمني</p>
          <p className="text-[10px]">الجدول-الزمني</p>
        </div>

        <div>
          <button onClick={handleOpenShow} className="text-primary underline">
            عرض
          </button>
        </div>

        <div className="flex gap-2 items-center ">
          <button className="py-1 px-3 bg-[#72E128]/20 text-[#72E128] rounded-full ">
            تحديث
          </button>
          <button onClick={handleOpenDelete}>
            <Trash className="w-4 text-red-500" />
          </button>
        </div>
      </div>
      <DeleteConfirmationDialog
        deleteUrl="aaa"
        onClose={handleCloseDelete}
        open={isOpenDelete}
      />

      <Dialog open={isOpenShow} onOpenChange={handleCloseShow}>
        <DialogContent withCrossButton className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-center my-5">الاحداث</DialogTitle>
          </DialogHeader>
          <UserActivityLogExample />{" "}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocsTable;
