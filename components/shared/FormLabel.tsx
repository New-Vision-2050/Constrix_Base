import React from "react";
import { Label } from "@/components/ui/label";

interface FormLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export default function FormLabel({
  htmlFor,
  children,
  required = false,
  className = "text-gray-500 text-sm mb-2 block",
}: FormLabelProps) {
  return (
    <Label htmlFor={htmlFor} className={className}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
  );
}
