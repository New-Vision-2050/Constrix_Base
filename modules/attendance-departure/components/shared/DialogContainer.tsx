"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogContainerProps } from "../../types/attendance";
import { useTheme } from "next-themes";

/**
 * Shared component for displaying dialogs with consistent styling
 */
const DialogContainer: React.FC<DialogContainerProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const bgColor = isDarkMode ? "#140F35" : "#FFFFFF";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const titleColor = isDarkMode ? "text-white" : "text-gray-900";
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${textColor}`} 
        style={{ backgroundColor: bgColor }}
      >
        <DialogHeader>
          <DialogTitle className={`text-2xl text-center font-bold ${titleColor}`}>
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
