"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Form,
} from "@/modules/table/components/ui/form";
import { Loader2 } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import {
  createProjectFormSchema,
  ProjectFormData,
  getDefaultProjectFormValues,
} from "../../schema/project-form.schema";
import ProjectDetailsSection from "./ProjectDetailsSection";
import ProjectDetailsArray from "./ProjectDetailsArray";
import { CompanyDashboardProjectsApi } from "@/services/api/company-dashboard/projects";
import { CompanyDashboardProjectTypesApi } from "@/services/api/company-dashboard/project-types";
import { CompanyDashboardServicesApi } from "@/services/api/company-dashboard/services";

// Project type options - can be extended later
const PROJECT_TYPE_OPTIONS = [
  { value: "saas", label: "SAAS" },
  { value: "web", label: "Web Application" },
  { value: "mobile", label: "Mobile App" },
];

// Service options - should be fetched from API
const SERVICE_OPTIONS = [
  { value: "1", label: "Service 1" },
  { value: "2", label: "Service 2" },
];

/**
 * Set Project Dialog Component
 * Main dialog component for creating/editing projects
 * Follows Open/Closed Principle - extensible via props
 */
interface SetProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectId?: string;
}

export default function SetProjectDialog({
  open,
  onClose,
  onSuccess,
  projectId,
}: SetProjectDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations("content-management-system.projects.addProjectForm");
  const isEditMode = !!projectId;

  // Fetch project data when editing
  const { data: projectData, isLoading: isFetching, refetch } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return CompanyDashboardProjectsApi.show(projectId!);
    },
    enabled: isEditMode && open,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    staleTime: Infinity,
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(createProjectFormSchema(t)),
    defaultValues: getDefaultProjectFormValues(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  // Fetch project types (cached for 5 minutes to avoid unnecessary refetches)
  const { data: projectTypesData } = useQuery({
    queryKey: ["company-dashboard-project-types"],
    queryFn: () => CompanyDashboardProjectTypesApi.list(),
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes
  });
  const projectTypesOptions = useMemo(() => projectTypesData?.data?.payload?.map((projectType: any) => ({
    value: projectType.id,
    label: projectType.name,
  })) || [], [projectTypesData]);

  // Fetch services (cached for 5 minutes to avoid unnecessary refetches)
  const { data: servicesData } = useQuery({
    queryKey: ["company-dashboard-services"],
    queryFn: () => CompanyDashboardServicesApi.list(),
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes
  });
  const servicesOptions = useMemo(() => servicesData?.data?.payload?.map((service: any) => ({
    value: service.id,
    label: service.name,
  })) || [], [servicesData]);

  // Show toast for validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);

  // Populate form with project data when editing
  useEffect(() => {
    if (isEditMode && projectData?.data?.payload) {
      const project = projectData.data.payload;

      // Set core project fields
      setValue("name_ar", project.name_ar || "");
      setValue("name_en", project.name_en || "");
      setValue("title_ar", project.name_ar || ""); // Title maps to name for now
      setValue("title_en", project.name_en || "");
      setValue("description_ar", project.description_ar || "");
      setValue("description_en", project.description_en || "");
      // set type
      setValue("type", project.website_project_setting_id || "");

      // Set featured status based on project status
      setValue("is_featured", project.status === 1);

      // Transform project_details to form details array format
      if (project.project_details && project.project_details.length > 0) {
        const formDetails = project.project_details.map((detail) => {
          return {
            detail_ar: detail?.name_ar || "",
            detail_en: detail?.name_en || "",
            service_id: detail.website_service_id || "",
          };
        });
        setValue("details", formDetails);
      }
    }
  }, [isEditMode, projectData, open, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // TODO: Replace with actual API calls
      const payload = {
        main_image: data.main_image,
        secondary_images: data.sub_images,
        website_project_setting_id: data.type,
        title_ar: data.title_ar,
        title_en: data.title_en,
        name_ar: data.name_ar,
        name_en: data.name_en,
        description_ar: data.description_ar,
        description_en: data.description_en,
        project_details: data.details.map((detail) => ({
          name_ar: detail.detail_ar,
          name_en: detail.detail_en,
          website_service_id: detail.service_id,
        })),
      };
      if (isEditMode && projectId) {
        await CompanyDashboardProjectsApi.update(projectId, payload);
        toast.success(t("updateSuccess") || "Project updated successfully!");
      } else {
        await CompanyDashboardProjectsApi.create(payload);
        toast.success(t("createSuccess") || "Project created successfully!");
      }

      onSuccess?.();
      reset();
      refetch();
      onClose();
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} project:`,
        error
      );

      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage || t("validationError"));
          return;
        }
      }

      toast.error(
        isEditMode
          ? t("updateError") || "Failed to update project. Please try again."
          : t("createError") || "Failed to create project. Please try again."
      );
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-sidebar border-gray-700 p-4 sm:p-6 ${isRtl ? "rtl" : "ltr"
          }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-0 text-white hover:bg-gray-700"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? t("editProject") : t("addProject")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Project Details Section (includes Featured Services) */}
            <ProjectDetailsSection
              control={control}
              isSubmitting={isSubmitting}
              isFetching={isFetching}
              t={t}
              projectTypeOptions={projectTypesOptions}
              mainImageInitialValue={projectData?.data?.payload?.main_image}
              subImagesInitialValue={projectData?.data?.payload?.secondary_images}
            />

            {/* Details Array Section */}
            <ProjectDetailsArray
              control={control}
              isSubmitting={isSubmitting}
              isFetching={isFetching}
              t={t}
              serviceOptions={servicesOptions}
            />

            {/* Save Button */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
              >
                {(isSubmitting || isFetching) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("save") || "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
