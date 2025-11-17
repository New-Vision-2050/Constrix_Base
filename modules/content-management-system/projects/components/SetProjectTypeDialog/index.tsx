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
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import { Loader2 } from "lucide-react";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import {
  createProjectTypeFormSchema,
  ProjectTypeFormData,
  getDefaultProjectTypeFormValues,
} from "../../schema/project-type-form.schema";

interface SetProjectTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectTypeId?: string;
}

export default function SetProjectTypeDialog({
  open,
  onClose,
  onSuccess,
  projectTypeId,
}: SetProjectTypeDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations("content-management-system.projects.projectTypeForm");
  const isEditMode = !!projectTypeId;

  // Fetch project type data when editing
  const { data: projectTypeData, isLoading: isFetching } = useQuery<{
    data: { payload: { name_ar?: string; name_en?: string; group?: number } | null };
  }>({
    queryKey: ["company-dashboard-project-type", projectTypeId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return CompanyDashboardProjectTypesApi.show(projectTypeId!);
      return { data: { payload: null } };
    },
    enabled: isEditMode && open,
  });

  const form = useForm<ProjectTypeFormData>({
    resolver: zodResolver(createProjectTypeFormSchema(t)),
    defaultValues: getDefaultProjectTypeFormValues(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Show toast for validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);

  // Populate form with project type data when editing
  useEffect(() => {
    if (isEditMode && projectTypeData?.data?.payload) {
      const projectType = projectTypeData.data.payload;

      setValue("name_ar", projectType.name_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("name_en", projectType.name_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      if (projectType.group !== undefined) {
        setValue("group", projectType.group, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    }
  }, [isEditMode, projectTypeData, open, setValue]);

  const onSubmit = async (data: ProjectTypeFormData) => {
    try {
      // TODO: Replace with actual API calls
      if (isEditMode && projectTypeId) {
        // await CompanyDashboardProjectTypesApi.update(projectTypeId, {
        //   "name[ar]": data.name_ar,
        //   "name[en]": data.name_en,
        //   group: data.group,
        // });
        toast.success(
          t("updateSuccess") || "Project type updated successfully!"
        );
      } else {
        // await CompanyDashboardProjectTypesApi.create({
        //   "name[ar]": data.name_ar,
        //   "name[en]": data.name_en,
        //   group: data.group,
        // });
        toast.success(
          t("createSuccess") || "Project type created successfully!"
        );
      }

      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} project type:`,
        error
      );

      // Handle 422 validation errors from server
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
          ? t("updateError") ||
              "Failed to update project type. Please try again."
          : t("createError") ||
              "Failed to create project type. Please try again."
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
        className={`max-w-2xl w-full bg-sidebar border-gray-700 p-4 sm:p-6 ${
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
            {isEditMode ? t("editProjectType") : t("addProjectType")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Project Type Name Arabic */}
            <FormField
              control={control}
              name="name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs" required>
                    {t("nameAr") || "نوع المشروع بالعربي"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      variant="secondary"
                      disabled={isSubmitting || isFetching}
                      className="mt-1"
                      placeholder={t("nameArPlaceholder") || "أدخل نوع المشروع بالعربي"}
                      {...field}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />

            {/* Project Type Name English */}
            <FormField
              control={control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    {t("nameEn") || "نوع المشروع بالانجليزية"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      variant="secondary"
                      disabled={isSubmitting || isFetching}
                      className="mt-1"
                      placeholder={t("nameEnPlaceholder") || "Enter project type in English"}
                      {...field}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />

            {/* Group */}
            <FormField
              control={control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    {t("group") || "المجموعة"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      variant="secondary"
                      disabled={isSubmitting || isFetching}
                      className="mt-1"
                      placeholder={t("groupPlaceholder") || "أدخل رقم المجموعة"}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? undefined : value);
                      }}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
              >
                {(isSubmitting || isFetching) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("save") || "حفظ"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
