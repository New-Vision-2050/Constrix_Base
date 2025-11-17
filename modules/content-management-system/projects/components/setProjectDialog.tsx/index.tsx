"use client";

import React, { useEffect } from "react";
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
import FeaturedServicesSection from "./FeaturedServicesSection";
import ProjectDetailsSection from "./ProjectDetailsSection";
import ProjectDetailsArray from "./ProjectDetailsArray";

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
  const { data: projectData, isLoading: isFetching } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return ProjectsApi.show(projectId!);
      return { data: { payload: null } };
    },
    enabled: isEditMode && open,
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

  const isFeatured = watch("is_featured");

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
      // TODO: Map API response to form data
      // setValue("title_ar", project.title_ar || "");
      // ... etc
    }
  }, [isEditMode, projectData, open, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // TODO: Replace with actual API calls
      if (isEditMode && projectId) {
        // await ProjectsApi.update(projectId, data);
        toast.success(t("updateSuccess") || "Project updated successfully!");
      } else {
        // await ProjectsApi.create(data);
        toast.success(t("createSuccess") || "Project created successfully!");
      }

      onSuccess?.();
      reset();
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
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-sidebar border-gray-700 p-4 sm:p-6 ${
          isRtl ? "rtl" : "ltr"
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
            {/* Featured Services Section */}
            <FeaturedServicesSection
              control={control}
              isSubmitting={isSubmitting}
              isFetching={isFetching}
              t={t}
              mainImageInitialValue={undefined}
              subImagesInitialValue={undefined}
            />

            {/* Project Details Section */}
            <ProjectDetailsSection
              control={control}
              isSubmitting={isSubmitting}
              isFetching={isFetching}
              t={t}
              projectTypeOptions={PROJECT_TYPE_OPTIONS}
            />

            {/* Details Array Section */}
            <ProjectDetailsArray
              control={control}
              isSubmitting={isSubmitting}
              isFetching={isFetching}
              t={t}
              serviceOptions={SERVICE_OPTIONS}
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
