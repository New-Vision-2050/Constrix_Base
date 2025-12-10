"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { Box } from "@mui/material";
import { OurServicesFormData } from "../../schemas/our-services-form.schema";
import FormSelect from "../shared/FormSelect";
import { MultiSelectOption } from "@/components/shared/searchable-multi-select";

interface DepartmentDesignTypeFieldProps {
  control: Control<OurServicesFormData>;
  departmentIndex: number;
  isSubmitting: boolean;
  designTypesList: MultiSelectOption[];
}

/**
 * Department design type selector
 * Automatically adapts to RTL/LTR based on locale
 */
export default function DepartmentDesignTypeField({
  control,
  departmentIndex,
  isSubmitting,
  designTypesList,
}: DepartmentDesignTypeFieldProps) {
  const isRtl = useIsRtl();
  const tForm = useTranslations("content-management-system.services.form");


  return (
    <Box>
      <FormSelect
        control={control}
        name={`departments.${departmentIndex}.designType`}
        label={tForm("designType")}
        placeholder={tForm("designTypePlaceholder")}
        options={designTypesList}
        disabled={isSubmitting}
        required
      />
    </Box>
  );
}

