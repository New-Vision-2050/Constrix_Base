"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Grid } from "@mui/material";
import { OurServicesFormData } from "../schemas/our-services-form.schema";
import { DepartmentService } from "../types";
import FormTextField from "./shared/FormTextField";

interface ServicesGridProps {
  control: Control<OurServicesFormData>;
  services: DepartmentService[];
  departmentIndex: number;
  isSubmitting: boolean;
}

/**
 * Services grid component displaying service input fields
 * Displays services in a responsive 2-column grid layout
 * Supports RTL/LTR automatically through MUI Grid
 */
export default function ServicesGrid({
  control,
  services,
  departmentIndex,
  isSubmitting,
}: ServicesGridProps) {
  const tForm = useTranslations("content-management-system.services.form");

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service, serviceIndex) => (
        <FormTextField
          key={service.id}
          control={control}
          name={`departments.${departmentIndex}.services.${serviceIndex}.value`}
          label={`${tForm("serviceNumber")} ${serviceIndex + 1}`}
          placeholder={tForm("servicePlaceholder")}
          disabled={isSubmitting}
        />
      ))}
    </div>
  );
}
