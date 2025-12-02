"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Box, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "sonner";
import { createOurServicesFormSchema, getDefaultOurServicesFormValues, OurServicesFormData } from "./schemas/our-services-form.schema";
import { Department } from "./types";
import MainSection from "./components/main-section";
import DepartmentsList from "./components/departments-list";
import { useQuery } from "@tanstack/react-query";
import { CompanyDashboardServicesApi } from "@/services/api/company-dashboard/services";
import { MultiSelectOption } from "@/components/shared/searchable-multi-select";

/**
 * Main Our Services Module - Manages form state and CRUD operations
 */
export default function OurServicesModule() {
  const tForm = useTranslations("content-management-system.services.form");
  const { control, handleSubmit, watch, setValue, formState } = useForm<OurServicesFormData>({
    resolver: zodResolver(createOurServicesFormSchema(tForm)),
    defaultValues: getDefaultOurServicesFormValues(),
  });

  const { data } = useQuery({
    queryKey: ["company-dashboard-services-list"],
    queryFn: async () => {
      const response = await CompanyDashboardServicesApi.list();
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
  const servicesList: MultiSelectOption[] = data?.payload?.map((service) => ({ value: service.id, label: service.name ?? service.name_ar ?? service.name_en ?? "" })) || [];

  const departments = watch("departments");

  const addDepartment = () => {
    const newDept: Department = {
      id: `${departments.length + 1}`,
      titleAr: "",
      titleEn: "",
      descriptionAr: "",
      descriptionEn: "",
      designType: "",
      services: Array.from({ length: 6 }, (_, i) => ({ id: `${i + 1}`, value: "" })),
    };
    setValue("departments", [...departments, newDept]);
  };

  const removeDepartment = (idx: number) => {
    departments.length > 1
      ? setValue("departments", departments.filter((_, i) => i !== idx))
      : toast.error(tForm("cannotRemoveLastDepartment"));
  };

  const onSubmit = async (data: OurServicesFormData) => {
    try {
      console.log("Form data:", data);
      // process data to send to api
      const payload = {
        title: data.mainTitle,
        description: data.mainDescription,
        status: 1,
        departments: data.departments.map((department) => ({
          title_ar: department.titleAr,
          title_en: department.titleEn,
          description_ar: department.descriptionAr,
          description_en: department.descriptionEn,
          type: department.designType,
          website_service_ids: department.services.map((service) => service.value),
        }))
      };
      toast.success(tForm("saveSuccess"));
    } catch {
      toast.error(tForm("saveError"));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ px: 4, py: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <MainSection control={control} isSubmitting={formState.isSubmitting} />
        <DepartmentsList
          control={control}
          departments={departments}
          isSubmitting={formState.isSubmitting}
          onAdd={addDepartment}
          onRemove={removeDepartment}
          servicesList={servicesList}
        />
        <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={formState.isSubmitting} className="w-48">
          {tForm("save")}
        </Button>
      </Box>
    </Box>
  );
}
