"use client";

import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * ColorPickerDialog component
 * Modal dialog with color picker and hex input
 * 
 * @param open - Dialog open state
 * @param onClose - Handler for closing dialog
 * @param color - Current color value
 * @param onChange - Handler for color changes
 * @param label - Label for the color being edited
 */
interface ColorPickerDialogProps {
  open: boolean;
  onClose: () => void;
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export default function ColorPickerDialog({
  open,
  onClose,
  color,
  onChange,
  label,
}: ColorPickerDialogProps) {
  const [tempColor, setTempColor] = useState(color);

  // Sync temp color with prop when dialog opens
  useEffect(() => {
    if (open) {
      setTempColor(color);
    }
  }, [open, color]);

  const handleSave = () => {
    onChange(tempColor);
    onClose();
  };

  const handleCancel = () => {
    setTempColor(color);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Color picker */}
          <HexColorPicker
            color={tempColor}
            onChange={setTempColor}
            className="w-full !h-48"
          />

          {/* Hex input field */}
          <Input
            type="text"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            placeholder="#000000"
            className="font-mono"
          />

          {/* Action buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-gradient-to-r from-pink-500 to-pink-600"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

