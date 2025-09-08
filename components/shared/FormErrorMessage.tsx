"use client";

import React from "react";
import { useFormField } from "@/modules/table/components/ui/form";
import ErrorTypography from "./ErrorTypography";

interface FormErrorMessageProps {
  className?: string;
}

export default function FormErrorMessage({ className }: FormErrorMessageProps) {
  const { error } = useFormField();

  return (
    <ErrorTypography className={className}>{error?.message}</ErrorTypography>
  );
}
