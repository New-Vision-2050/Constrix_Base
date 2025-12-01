"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Grid } from "@mui/material";
import { OurServicesFormData } from "../../schemas/our-services-form.schema";
import FormTextField from "../shared/FormTextField";

interface DepartmentDescriptionFieldsProps {
  control: Control<OurServicesFormData>;
  departmentIndex: number;
  isSubmitting: boolean;
}

/**
 * Department description fields component (Arabic and English)
 * Handles multiline text input for descriptions
 */
export default function DepartmentDescriptionFields({
  control,
  departmentIndex,
  isSubmitting,
}: DepartmentDescriptionFieldsProps) {
  const tForm = useTranslations("content-management-system.services.form");

  return (
    <Grid container spacing={2}>
      {/* Arabic Description */}
      <Grid item xs={12} md={6}>
        <FormTextField
          control={control}
          name={`departments.${departmentIndex}.descriptionAr`}
          label={tForm("departmentDescriptionAr")}
          placeholder={tForm("departmentDescriptionArPlaceholder")}
          disabled={isSubmitting}
          required
          multiline
          rows={4}
        />
      </Grid>

      {/* English Description */}
      <Grid item xs={12} md={6}>
        <FormTextField
          control={control}
          name={`departments.${departmentIndex}.descriptionEn`}
          label={tForm("departmentDescriptionEn")}
          placeholder={tForm("departmentDescriptionEnPlaceholder")}
          disabled={isSubmitting}
          required
          multiline
          rows={4}
        />
      </Grid>
    </Grid>
  );
}

