"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Box, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "sonner";
import { useEffect } from "react";
import { createOurServicesFormSchema, getDefaultOurServicesFormValues, OurServicesFormData } from "./schemas/our-services-form.schema";
import { Department } from "./types";
import MainSection from "./components/main-section";
import DepartmentsList from "./components/departments-list";
import { useQuery } from "@tanstack/react-query";
import { CompanyDashboardServicesApi } from "@/services/api/company-dashboard/services";
import { MultiSelectOption } from "@/components/shared/searchable-multi-select";
import { CompanyDashboardOurServicesApi } from "@/services/api/company-dashboard/our-services";
import { OurServicesData } from "@/services/api/company-dashboard/our-services/types/response";
import Loading from "@/components/shared/Loading";

/**
 * Main Our Services Module - Manages form state and CRUD operations
 */
export default function OurServicesModule({ initialData }: { initialData: OurServicesData }) {
  const tForm = useTranslations("content-management-system.services.form");
  const { control, handleSubmit, watch, setValue, formState } = useForm<OurServicesFormData>({
    resolver: zodResolver(createOurServicesFormSchema(tForm)),
    defaultValues: getDefaultOurServicesFormValues(),
  });

  // set initial data
  useEffect(() => {
    if (initialData) {
      setValue("mainTitle", initialData.title);
      setValue("mainDescription", initialData.description);

      // Transform API data to form data structure
      const transformedDepartments: Department[] = initialData.departments.map((dept) => ({
        id: dept.id,
        titleAr: dept.title_ar,
        titleEn: dept.title_en,
        descriptionAr: dept.description_ar,
        descriptionEn: dept.description_en,
        designType: dept.type,
        services: dept.website_services.map((service) => ({
          id: service.id,
          value: service.id,
        })),
      }));

      setValue("departments", transformedDepartments);
    }
  }, [initialData, setValue]);

  // get services list
  const { data: servicesListData, isLoading: isServicesListLoading } = useQuery({
    queryKey: ["company-dashboard-services-list"],
    queryFn: async () => {
      const response = await CompanyDashboardServicesApi.list();
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
  const servicesList: MultiSelectOption[] = servicesListData?.payload?.map((service) => ({ value: service.id, label: service.name ?? service.name_ar ?? service.name_en ?? "" })) || [];
  // get design types list
  const { data: designTypesListData, isLoading: isDesignTypesListLoading } = useQuery({
    queryKey: ["company-dashboard-design-types-list"],
    queryFn: async () => {
      const response = await CompanyDashboardOurServicesApi.getDesignTypes();
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
  const designTypesList: MultiSelectOption[] = designTypesListData?.payload?.map((designType) => ({ value: designType.id, label: designType.name ?? designType.name_ar ?? designType.name_en ?? "" })) || [];

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
          // type: department.designType,//until later API which return design types merged
          type: "cards",//until later API which return design types merged
          website_service_ids: department.services.map((service) => service.value),
        }))
      };

      await CompanyDashboardOurServicesApi.updateCurrent(payload);
      toast.success(tForm("saveSuccess"));
    } catch {
      toast.error(tForm("saveError"));
    }
  };


  // loading state
  // isServicesListLoading || isDesignTypesListLoading
  if (isServicesListLoading) {
    return <Loading message={tForm("loadingData")} />;
  }

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
          designTypesList={designTypesList}
        />
        <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={formState.isSubmitting} className="w-48">
          {tForm("save")}
        </Button>
      </Box>
    </Box>
  );
}
