"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

export default function DepartmentsList({
  control,
  departments,
  isSubmitting,
  onAdd,
  onRemove,
}: DepartmentsListProps) {
  const t = useTranslations("content-management-system.services");

  return (
    <div className="space-y-6 bg-sidebar p-6">
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

      {/* Add Department Button */}
      <Button type="button" onClick={onAdd} className="w-full text-white ">
        <Plus className="h-4 w-4 mr-2" />
        {t("addDepartment")}
      </Button>
    </div>
  );
}
