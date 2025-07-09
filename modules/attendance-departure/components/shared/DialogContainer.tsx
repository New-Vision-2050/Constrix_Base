"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogContainerProps } from "../../types/attendance";

/**
 * Shared component for displaying dialogs with consistent styling
 */
const DialogContainer: React.FC<DialogContainerProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#140F35] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogContainer;
