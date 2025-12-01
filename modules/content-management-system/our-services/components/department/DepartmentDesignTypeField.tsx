"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { Box } from "@mui/material";
import { OurServicesFormData } from "../../schemas/our-services-form.schema";
import FormSelect from "../shared/FormSelect";

// Design type options with bilingual labels
const DESIGN_TYPE_OPTIONS = [
  { value: "hexagonal", labelAr: "شكل سداسي", labelEn: "Hexagonal Shape" },
  { value: "circular", labelAr: "شكل دائري", labelEn: "Circular Shape" },
  { value: "square", labelAr: "شكل مربع", labelEn: "Square Shape" },
];

interface DepartmentDesignTypeFieldProps {
  control: Control<OurServicesFormData>;
  departmentIndex: number;
  isSubmitting: boolean;
}

/**
 * Department design type selector
 * Automatically adapts to RTL/LTR based on locale
 */
export default function DepartmentDesignTypeField({
  control,
  departmentIndex,
  isSubmitting,
}: DepartmentDesignTypeFieldProps) {
  const isRtl = useIsRtl();
  const tForm = useTranslations("content-management-system.services.form");

  // Map options with localized labels
  const options = DESIGN_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: isRtl ? option.labelAr : option.labelEn,
  }));

  return (
    <Box>
      <FormSelect
        control={control}
        name={`departments.${departmentIndex}.designType`}
        label={tForm("designType")}
        placeholder={tForm("designTypePlaceholder")}
        options={options}
        disabled={isSubmitting}
        required
      />
    </Box>
  );
}

