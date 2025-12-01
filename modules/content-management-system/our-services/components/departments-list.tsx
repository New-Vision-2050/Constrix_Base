"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Box, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { OurServicesFormData } from "../schemas/our-services-form.schema";
import { Department } from "../types";
import DepartmentSection from "./department-section";

interface DepartmentsListProps {
  control: Control<OurServicesFormData>;
  departments: Department[];
  isSubmitting: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

/**
 * Departments list container component
 * Manages multiple department sections with add/remove functionality
 */
export default function DepartmentsList({
  control,
  departments,
  isSubmitting,
  onAdd,
  onRemove,
}: DepartmentsListProps) {
  const t = useTranslations("content-management-system.services");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Render all departments */}
        {departments.map((department, deptIndex) => (
          <DepartmentSection
            key={department.id}
            control={control}
            department={department}
            departmentIndex={deptIndex}
            totalDepartments={departments.length}
            isSubmitting={isSubmitting}
            onRemove={() => onRemove(deptIndex)}
          />
        ))}

        {/* Add department button */}
        <Button
          type="button"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          fullWidth
          sx={{ mt: 2 }}
        >
          {t("addDepartment")}
        </Button>
      </Box>
    </Paper>
  );
}
