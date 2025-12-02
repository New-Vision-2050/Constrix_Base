"use client";

import { Control, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button, IconButton } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { OurServicesFormData } from "../schemas/our-services-form.schema";
import FormSelect from "./shared/FormSelect";
import { MultiSelectOption } from "@/components/shared/searchable-multi-select";

interface ServicesGridProps {
  control: Control<OurServicesFormData>;
  departmentIndex: number;
  isSubmitting: boolean;
  servicesList: MultiSelectOption[];
}

/**
 * Services grid component displaying service input fields
 * Displays services in a responsive 2-column grid layout
 * Supports RTL/LTR automatically through MUI Grid
 * Allows adding and removing services dynamically
 */
export default function ServicesGrid({
  control,
  departmentIndex,
  isSubmitting,
  servicesList,
}: ServicesGridProps) {
  const tForm = useTranslations("content-management-system.services.form");

  const { fields, append, remove } = useFieldArray({
    control,
    name: `departments.${departmentIndex}.services`,
  });

  const handleAddService = () => {
    append({ id: crypto.randomUUID(), value: "" });
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((service, serviceIndex) => (
          <div key={service.id} className="flex items-start gap-2">
            <FormSelect
              control={control}
              name={`departments.${departmentIndex}.services.${serviceIndex}.value`}
              label={`${tForm("serviceNumber")} ${serviceIndex + 1}`}
              options={servicesList.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
              placeholder={tForm("servicePlaceholder")}
              disabled={isSubmitting}
            />
            <IconButton
              onClick={() => remove(serviceIndex)}
              disabled={isSubmitting || fields.length === 1}
              color="error"
              size="small"
              className="mt-2"
              aria-label={tForm("removeService") || "Remove service"}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddService}
        disabled={isSubmitting}
        className="mt-4"
      >
        {tForm("addService") || "Add Service"}
      </Button>
    </div>
  );
}
