"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Box, Grid } from "@mui/material";
import { OurServicesFormData } from "../../schemas/our-services-form.schema";
import FormTextField from "../shared/FormTextField";

interface DepartmentTitleFieldsProps {
  control: Control<OurServicesFormData>;
  departmentIndex: number;
  isSubmitting: boolean;
}

/**
 * Department title fields component (Arabic and English)
 * Separated for better code organization and reusability
 */
export default function DepartmentTitleFields({
  control,
  departmentIndex,
  isSubmitting,
}: DepartmentTitleFieldsProps) {
  const tForm = useTranslations("content-management-system.services.form");

  return (
    <Grid container spacing={2}>
      {/* Arabic Title */}
      <Grid item xs={12} md={6}>
        <FormTextField
          control={control}
          name={`departments.${departmentIndex}.titleAr`}
          label={tForm("departmentTitleAr")}
          placeholder={tForm("departmentTitleArPlaceholder")}
          disabled={isSubmitting}
          required
        />
      </Grid>

      {/* English Title */}
      <Grid item xs={12} md={6}>
        <FormTextField
          control={control}
          name={`departments.${departmentIndex}.titleEn`}
          label={tForm("departmentTitleEn")}
          placeholder={tForm("departmentTitleEnPlaceholder")}
          disabled={isSubmitting}
          required
        />
      </Grid>
    </Grid>
  );
}

