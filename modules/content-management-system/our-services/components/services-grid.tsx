"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { OurServicesFormData } from "../schemas/our-services-form.schema";
import { DepartmentService } from "../types";

interface ServicesGridProps {
  control: Control<OurServicesFormData>;
  services: DepartmentService[];
  departmentIndex: number;
  isSubmitting: boolean;
}

export default function ServicesGrid({
  control,
  services,
  departmentIndex,
  isSubmitting,
}: ServicesGridProps) {
  const tForm = useTranslations("content-management-system.services.form");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service, serviceIndex) => (
        <FormField
          key={service.id}
          control={control}
          name={`departments.${departmentIndex}.services.${serviceIndex}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">
                {tForm("serviceNumber")} {serviceIndex + 1}
              </FormLabel>
              <FormControl>
                <Input
                  variant="secondary"
                  disabled={isSubmitting}
                  className="mt-1"
                  placeholder={tForm("servicePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
