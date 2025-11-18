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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  createServiceFormSchema,
  ServiceFormData,
  getDefaultServiceFormValues,
} from "../schemas/service-form.schema";
import {
  AddServiceDialogProps,
  Category,
  AxiosError,
  ApiResponse,
  ServiceData,
  PreviousWork,
} from "../types";
import PreviousWorksList from "../components/previous-works-list";
import { Switch } from "@/components/ui/switch";

export default function AddServiceDialog({
  open,
  onClose,
  onSuccess,
  serviceId,
}: AddServiceDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations("content-management-system.services");
  const tForm = useTranslations("content-management-system.services.form");
  const isEditMode = !!serviceId;

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["service-categories"],
    queryFn: async () => {
      const response = await apiClient.get(
        `${baseURL}/company-dashboard/categories/list`
      );
      return response.data;
    },
    enabled: open,
  });

  // Fetch service data when editing
  const { data: serviceData, isLoading: isFetching } = useQuery<
    ApiResponse<ServiceData>
  >({
    queryKey: ["service", serviceId],
    queryFn: async () => {
      const response = await apiClient.get(
        `${baseURL}/company-dashboard/services/${serviceId}`
      );
      return response.data;
    },
    enabled: isEditMode && open,
  });

  const form = useForm({
    resolver: zodResolver(createServiceFormSchema(tForm, isEditMode)),
    defaultValues: getDefaultServiceFormValues(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const previousWorks = watch("previous_works") || [];

  // Show toast for validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);

  // Populate form with service data when editing
  useEffect(() => {
    if (isEditMode && serviceData?.data?.payload) {
      const service = serviceData.data.payload;

      setValue("name_ar", service.name_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("name_en", service.name_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("request_id", service.request_id || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("category_id", service.category_id?.toString() || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("description_ar", service.description_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("description_en", service.description_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("is_featured", service.is_featured || false, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue(
        "previous_works",
        service.previous_works?.map((work, index) => ({
          id: work.id || `${index + 1}`,
          description: work.description || "",
          image: work.image?.url || null,
        })) || [],
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );
    }
  }, [isEditMode, serviceData, open, setValue]);

  const addPreviousWork = () => {
    const newWork: PreviousWork = {
      id: `${previousWorks.length + 1}`,
      description: "",
      image: null,
    };
    setValue("previous_works", [...previousWorks, newWork]);
  };

  const removePreviousWork = (index: number) => {
    const updatedWorks = previousWorks.filter((_, i) => i !== index);
    setValue("previous_works", updatedWorks);
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const formData = new FormData();
      formData.append("name[ar]", data.name_ar);
      formData.append("name[en]", data.name_en);
      formData.append("request_id", data.request_id);
      formData.append("category_id", data.category_id);
      formData.append("description[ar]", data.description_ar);
      formData.append("description[en]", data.description_en);
      formData.append("is_featured", data.is_featured ? "1" : "0");

      if (data.icon_image instanceof File) {
        formData.append("icon_image", data.icon_image);
      }
      if (data.main_image instanceof File) {
        formData.append("main_image", data.main_image);
      }

      // Handle previous works
      if (data.previous_works && data.previous_works.length > 0) {
        data.previous_works.forEach((work, index) => {
          formData.append(`previous_works[${index}][description]`, work.description);
          if (work.image instanceof File) {
            formData.append(`previous_works[${index}][image]`, work.image);
          }
        });
      }

      if (isEditMode && serviceId) {
        await apiClient.put(
          `${baseURL}/company-dashboard/services/${serviceId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await apiClient.post(`${baseURL}/company-dashboard/services`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success(
        isEditMode ? tForm("updateSuccess") : tForm("createSuccess")
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} service:`,
        error
      );

      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 422) {
        const validationErrors = axiosError.response.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage || tForm("validationError"));
          return;
        }
      }

      toast.error(isEditMode ? tForm("updateError") : tForm("createError"));
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      reset();
      onClose();
    }
  };

  const categories = categoriesData?.data?.payload || [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-6xl w-full bg-sidebar border-gray-700 max-h-[90vh] overflow-y-auto ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? t("editService") : t("addService")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Featured Services Toggle - Top Section */}
            <div className="flex items-center justify-between bg-sidebar p-4 rounded-lg border border-gray-700">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {tForm("featuredServicesTitle")}
                </h3>
                <p className="text-xs text-gray-400">
                  {tForm("featuredServicesSubtitle")}
                </p>
              </div>
              <FormField
                control={control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting || isFetching}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Main Content - Two Columns */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Service Details */}
              <div className="space-y-4">
                {/* Service Name Arabic */}
                <FormField
                  control={control}
                  name="name_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs" required>
                        {tForm("nameAr")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          variant="secondary"
                          disabled={isSubmitting || isFetching}
                          className="mt-1"
                          placeholder={tForm("nameArPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />

                {/* Service Name English */}
                <FormField
                  control={control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs" required>
                        {tForm("nameEn")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          variant="secondary"
                          disabled={isSubmitting || isFetching}
                          className="mt-1"
                          placeholder={tForm("nameEnPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />

                {/* Request ID */}
                <FormField
                  control={control}
                  name="request_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs" required>
                        {tForm("requestId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          variant="secondary"
                          disabled={isSubmitting || isFetching}
                          className="mt-1"
                          placeholder={tForm("requestIdPlaceholder")}
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
                        {tForm("descriptionAr")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isSubmitting || isFetching}
                          rows={4}
                          className="mt-1 resize-none bg-sidebar text-white border-gray-700"
                          placeholder={tForm("descriptionArPlaceholder")}
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
                        {tForm("descriptionEn")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isSubmitting || isFetching}
                          rows={4}
                          className="mt-1 resize-none bg-sidebar text-white border-gray-700"
                          placeholder={tForm("descriptionEnPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Images and Category */}
              <div className="space-y-4">
                {/* Icon Image */}
                <FormField
                  control={control}
                  name="icon_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          label={tForm("iconImage")}
                          maxSize={tForm("imageMaxSize")}
                          dimensions={tForm("imageDimensions")}
                          required={!isEditMode}
                          onChange={(file) => field.onChange(file)}
                          initialValue={
                            typeof field.value === "string"
                              ? field.value
                              : serviceData?.data?.payload?.icon_image?.url
                          }
                          minHeight="100px"
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />

                {/* Main Image */}
                <FormField
                  control={control}
                  name="main_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          label={tForm("mainImage")}
                          maxSize={tForm("imageMaxSize")}
                          dimensions={tForm("imageDimensions")}
                          required={!isEditMode}
                          onChange={(file) => field.onChange(file)}
                          initialValue={
                            typeof field.value === "string"
                              ? field.value
                              : serviceData?.data?.payload?.main_image?.url
                          }
                          minHeight="100px"
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs" required>
                        {tForm("category")}
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSubmitting || isFetching}
                        >
                          <SelectTrigger
                            className="mt-1 bg-sidebar border-white text-white h-12"
                            showClear={!!field.value}
                            onClear={() => field.onChange("")}
                          >
                            <SelectValue
                              placeholder={tForm("categoryPlaceholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category: Category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {isRtl
                                  ? category.name_ar || category.name
                                  : category.name_en || category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Previous Works Section */}
            <PreviousWorksList
              control={control}
              previousWorks={previousWorks}
              isSubmitting={isSubmitting || isFetching}
              onAdd={addPreviousWork}
              onRemove={removePreviousWork}
              initialPreviousWorks={serviceData?.data?.payload?.previous_works}
            />

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full text-white"
              >
                {(isSubmitting || isFetching) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {tForm("save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

