"use client";

import { Control } from "react-hook-form";
import { Box, Stack } from "@mui/material";
import { OurServicesFormData } from "../schemas/our-services-form.schema";
import { Department } from "../types";
import DepartmentHeader from "./department/DepartmentHeader";
import DepartmentTitleFields from "./department/DepartmentTitleFields";
import DepartmentDescriptionFields from "./department/DepartmentDescriptionFields";
import DepartmentDesignTypeField from "./department/DepartmentDesignTypeField";
import ServicesGrid from "./services-grid";
import { MultiSelectOption } from "@/components/shared/searchable-multi-select";

interface DepartmentSectionProps {
  control: Control<OurServicesFormData>;
  department: Department;
  departmentIndex: number;
  totalDepartments: number;
  isSubmitting: boolean;
  onRemove: () => void;
  servicesList: MultiSelectOption[];
  designTypesList: MultiSelectOption[];
}

/**
 * Department section component
 * Composed of smaller sub-components following SRP
 */
export default function DepartmentSection({
  control,
  department,
  departmentIndex,
  totalDepartments,
  isSubmitting,
  onRemove,
  servicesList,
  designTypesList,
}: DepartmentSectionProps) {
  return (
    <Box sx={{ pt: 3, mb: 4 }}>
      <DepartmentHeader
        departmentIndex={departmentIndex}
        totalDepartments={totalDepartments}
        onRemove={onRemove}
      />

      <Stack spacing={3}>
        <DepartmentTitleFields
          control={control}
          departmentIndex={departmentIndex}
          isSubmitting={isSubmitting}
        />
        <DepartmentDescriptionFields
          control={control}
          departmentIndex={departmentIndex}
          isSubmitting={isSubmitting}
        />
        <DepartmentDesignTypeField
          control={control}
          departmentIndex={departmentIndex}
          isSubmitting={isSubmitting}
          designTypesList={designTypesList}
        />
        <ServicesGrid
          control={control}
          departmentIndex={departmentIndex}
          isSubmitting={isSubmitting}
          servicesList={servicesList}
        />
      </Stack>
    </Box>
  );
}
