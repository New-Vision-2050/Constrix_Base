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
import { Textarea } from "@/modules/table/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import { Loader2 } from "lucide-react";
import ImageUpload from "@/components/shared/ImageUpload";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import {
  createFounderFormSchema,
  FounderFormData,
  getDefaultFounderFormValues,
} from "../schemas/founder-form.schema";
import {
  AddFounderDialogProps,
  AxiosError,
  ApiResponse,
  FounderData,
} from "../types";

export default function AddFounderDialog({
  open,
  onClose,
  onSuccess,
  founderId,
}: AddFounderDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations("content-management-system.founder");
  const isEditMode = !!founderId;

  // Fetch founder data when editing
  const { data: founderData, isLoading: isFetching } = useQuery<
    ApiResponse<FounderData>
  >({
    queryKey: ["founder", founderId],
    queryFn: async () => {
      const response = await apiClient.get(
        `${baseURL}/company-dashboard/founders/${founderId}`
      );
      return response.data;
    },
    enabled: isEditMode && open,
  });

  const form = useForm({
    resolver: zodResolver(createFounderFormSchema(t, isEditMode)),
    defaultValues: getDefaultFounderFormValues(),
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

  // Populate form with founder data when editing
  useEffect(() => {
    if (isEditMode && founderData?.data?.payload) {
      const founder = founderData.data.payload;

      setValue("name_ar", founder.name_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("name_en", founder.name_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("job_title_ar", founder.job_title_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("job_title_en", founder.job_title_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("description_ar", founder.description_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("description_en", founder.description_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [isEditMode, founderData, open, setValue]);

  const onSubmit = async (data: FounderFormData) => {
    try {
      const formData = new FormData();
      formData.append("name[ar]", data.name_ar);
      formData.append("name[en]", data.name_en);
      formData.append("job_title[ar]", data.job_title_ar);
      formData.append("job_title[en]", data.job_title_en);
      formData.append("description[ar]", data.description_ar);
      formData.append("description[en]", data.description_en);

      if (data.profile_image instanceof File) {
        formData.append("profile_image", data.profile_image);
      }

      if (isEditMode && founderId) {
        await apiClient.put(
          `${baseURL}/company-dashboard/founders/${founderId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        if (!data.profile_image) {
          toast.error(t("form.profileImageRequired"));
          return;
        }
        await apiClient.post(
          `${baseURL}/company-dashboard/founders`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      toast.success(
        isEditMode ? t("form.updateSuccess") : t("form.createSuccess")
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error: unknown) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} founder:`,
        error
      );

      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 422) {
        const validationErrors = axiosError.response.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage || t("form.validationError"));
          return;
        }
      }

      toast.error(isEditMode ? t("form.updateError") : t("form.createError"));
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
        className={`max-w-5xl w-full bg-sidebar max-h-[90vh] overflow-y-auto ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? t("editFounder") : t("addFounder")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Left Column - Form Fields */}
            <div className="grid grid-cols-2 gap-6 ">
              <ImageUpload
                label={t("form.profileImage")}
                maxSize="3MB - الحجم الأقصى"
                dimensions="2160 × 2160"
                required={!isEditMode}
                onChange={(file) => setValue("profile_image", file)}
                initialValue={founderData?.data?.payload?.profile_image?.url}
                minHeight="100px"
              />
              <div className="grid grid-cols-1 gap-6 ">
                <FormField
                  control={control}
                  name="name_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs" required>
                        {t("form.nameAr")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          variant="secondary"
                          disabled={isSubmitting || isFetching}
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />

                {/* Name English */}
                <FormField
                  control={control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs" required>
                        {t("form.nameEn")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          variant="secondary"
                          disabled={isSubmitting || isFetching}
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 ">
              {/* Job Title English */}
              <FormField
                control={control}
                name="job_title_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {t("form.jobTitleEn")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        variant="secondary"
                        disabled={isSubmitting || isFetching}
                        className="mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
              {/* Job Title Arabic */}
              <FormField
                control={control}
                name="job_title_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {t("form.jobTitleAr")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        variant="secondary"
                        disabled={isSubmitting || isFetching}
                        className="mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
              {/* Description Arabic */}
              <FormField
                control={control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {t("form.descriptionAr")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting || isFetching}
                        rows={4}
                        className="mt-1 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />

              {/* Description English */}
              <FormField
                control={control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {t("form.descriptionEn")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting || isFetching}
                        rows={4}
                        className="mt-1 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full text-white"
              >
                {(isSubmitting || isFetching) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("form.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
