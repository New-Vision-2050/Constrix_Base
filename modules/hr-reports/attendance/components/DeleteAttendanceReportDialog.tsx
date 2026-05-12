"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InfoIcon from "@/public/icons/info";

export type DeleteAttendanceReportDialogProps = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function DeleteAttendanceReportDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteAttendanceReportDialogProps) {
  const t = useTranslations("HRReports.attendanceReport.table");
  const tDeleteConfirm = useTranslations("common.deleteConfirmation");

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !loading) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center justify-center mb-4">
          <DialogTitle asChild>
            <div className="relative w-full">
              <button
                type="button"
                className="absolute top-0 rtl:left-0 ltr:right-0 text-gray-400 hover:text-foreground"
                onClick={onClose}
                disabled={loading}
              >
                ✕
              </button>
              <div className="flex justify-center">
                <InfoIcon />
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <h3 className="text-center text-2xl font-medium text-foreground">
            {t("deleteReportConfirm")}
          </h3>
        </DialogDescription>
        <DialogFooter className="!items-center !justify-center gap-3 sm:justify-center">
          <Button
            variant="destructive"
            className="w-32 h-10"
            loading={loading}
            onClick={() => void onConfirm()}
          >
            {tDeleteConfirm("delete")}
          </Button>
          <Button
            variant="outline"
            className="w-32 h-10"
            disabled={loading}
            onClick={onClose}
          >
            {tDeleteConfirm("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
