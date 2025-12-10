"use client";

import React, { useState, useEffect } from "react";
import FormLabel from "@/components/shared/FormLabel";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export default function ColorPicker({
  label,
  value,
  onChange,
  className = "",
}: ColorPickerProps) {
  const [hex, setHex] = useState("#FFFFFF");

  // Initialize from value
  useEffect(() => {
    if (value) {
      setHex(value.toUpperCase());
    }
  }, [value]);

  // Handle hex input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(newHex)) {
      setHex(newHex.toUpperCase());
      if (newHex.length === 7) {
        onChange(newHex.toUpperCase());
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hex}
          onChange={(e) => {
            const newHex = e.target.value.toUpperCase();
            setHex(newHex);
            onChange(newHex);
          }}
          className="w-12 h-12 rounded-lg border-2 border-white/20 cursor-pointer flex-shrink-0"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
            appearance: "none",
            backgroundColor: "transparent",
            border: "2px solid rgba(255, 255, 255, 0.2)",
          }}
        />
        <Input
          type="text"
          value={hex}
          onChange={handleHexChange}
          variant="secondary"
          inputClassName="flex-1 font-mono"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );
}
