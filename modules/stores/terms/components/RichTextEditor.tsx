"use client";

import React from "react";
import { Textarea } from "@/modules/table/components/ui/textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
}: RichTextEditorProps) {
  return (
    <Textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "أدخل المحتوى هنا..."}
      rows={12}
      disabled={disabled}
      className="resize-none bg-sidebar border-white text-white"
    />
  );
}
