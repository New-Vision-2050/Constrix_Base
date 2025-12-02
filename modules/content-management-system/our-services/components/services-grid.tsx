"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { OurServicesFormData } from "../schemas/our-services-form.schema";
import FormMultiSelect from "./shared/FormMultiSelect";
import { MultiSelectOption } from "@/components/shared/searchable-multi-select";

interface ServicesGridProps {
  control: Control<OurServicesFormData>;
  departmentIndex: number;
  isSubmitting: boolean;
  servicesList: MultiSelectOption[];
}

/**
 * Services multi-select component
 * Allows selecting multiple services from a dropdown
 * Supports RTL/LTR automatically through MUI
 */
export default function ServicesGrid({
  control,
  departmentIndex,
  isSubmitting,
  servicesList,
}: ServicesGridProps) {
  const tForm = useTranslations("content-management-system.services.form");

  return (
    <div className="w-full">
      <FormMultiSelect
        control={control}
        name={`departments.${departmentIndex}.services`}
        label={tForm("services")}
        options={servicesList.map((item) => ({
          value: item.value,
          label: item.label,
        }))}
        placeholder={tForm("selectServices")}
        disabled={isSubmitting}
      />
    </div>
  );
}
