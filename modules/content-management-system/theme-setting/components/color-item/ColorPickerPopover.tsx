"use client";

import { useState, useEffect, ReactNode } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/table/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

/**
 * ColorPickerPopover component
 * Popover with color picker that opens above the trigger element
 * 
 * @param open - Popover open state
 * @param onOpenChange - Handler for open state changes
 * @param color - Current color value
 * @param onChange - Handler for color changes
 * @param label - Label for the color being edited
 * @param children - Trigger element
 */
interface ColorPickerPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  color: string;
  onChange: (color: string) => void;
  label: string;
  children: ReactNode;
}

export default function ColorPickerPopover({
  open,
  onOpenChange,
  color,
  onChange,
  label,
  children,
}: ColorPickerPopoverProps) {
  const t = useTranslations("content-management-system.themeSetting.colorPickerPopover");
  const [tempColor, setTempColor] = useState(color);
  const [inputError, setInputError] = useState<string | null>(null);

  // Hex color validation regex
  const isValidHexColor = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  // Sync temp color with prop when popover opens
  useEffect(() => {
    if (open) {
      setTempColor(color);
      setInputError(null);
    }
  }, [open, color]);

  const handleInputChange = (value: string) => {
    setTempColor(value);
    
    // Validate hex color format
    if (value && !isValidHexColor(value)) {
      setInputError(t("invalidHex"));
    } else {
      setInputError(null);
    }
  };

  const handleSave = () => {
    // Only save if valid hex color
    if (isValidHexColor(tempColor)) {
      onChange(tempColor);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setTempColor(color);
    setInputError(null);
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-4" 
        align="start"
        side="top"
      >
        <div className="space-y-3">
          {/* Color picker */}
          <HexColorPicker
            color={isValidHexColor(tempColor) ? tempColor : color}
            onChange={(newColor) => {
              setTempColor(newColor);
              setInputError(null);
            }}
            className="!w-[200px] !h-[150px]"
          />

          {/* Hex input field with validation */}
          <div className="space-y-1">
            <Input
              type="text"
              value={tempColor}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="#000000"
              className={`font-mono text-sm ${inputError ? 'border-destructive' : ''}`}
              variant="secondary"
            />
            {inputError && (
              <p className="text-xs text-destructive">{inputError}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              size="sm"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              size="sm"
              disabled={!isValidHexColor(tempColor)}
              className="bg-gradient-to-r from-pink-500 to-pink-600"
            >
              {t("save")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
