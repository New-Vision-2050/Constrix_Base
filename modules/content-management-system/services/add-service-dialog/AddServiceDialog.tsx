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
import { toast } from "sonner";
import { CompanyDashboardServicesApi } from "@/services/api/company-dashboard/services";
import { CompanyDashboardCategoriesApi } from "@/services/api/company-dashboard/categories";
import {
  createServiceFormSchema,
  ServiceFormData,
  getDefaultServiceFormValues,
} from "../schemas/service-form.schema";
import {
  AddServiceDialogProps,
  Category,
  AxiosError,
  PreviousWork,
} from "../types";
import { ShowServiceResponse } from "@/services/api/company-dashboard/services/types/response";
import { CreateServiceParams } from "@/services/api/company-dashboard/services/types/params";
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

  // Fetch categories from API
  const { data: categoriesData } = useQuery({
    queryKey: ["company-dashboard-categories"],
    queryFn: async () => {
      const response = await CompanyDashboardCategoriesApi.list();
      return response.data;
    },
    enabled: open,
  });

  // Map categories to match Category interface
  const categories: Category[] =
    categoriesData?.payload?.map((category) => ({
      id: category.id,
      name_ar: category.name_ar,
      name_en: category.name_en,
      name: category.name,
    })) || [];

  // Fetch service data when editing
  const { data: serviceData, isLoading: isFetching, refetch } =
    useQuery<ShowServiceResponse>({
      queryKey: ["service", serviceId],
      queryFn: async () => {
        const response = await CompanyDashboardServicesApi.show(serviceId!);
        return response.data;
      },
      enabled: isEditMode && open && !!serviceId,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
      staleTime: Infinity,
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
    if (isEditMode && serviceData?.payload) {
      const service = serviceData.payload;

      reset({
        name_ar: service.name_ar || "",
        name_en: service.name_en || "",
        request_id: service.reference_number || "",
        category_id: service.category_website_cms_id?.toString() || "",
        description_ar: service.description_ar || "",
        description_en: service.description_en || "",
        status: service.status == 1,
        icon_image: service.icon || null,
        main_image: service.main_image || null,
        previous_works:
          service.previous_work?.map(
            (
              work: {
                id: string;
                description: string;
                image?: string;
              },
              index: number
            ) => ({
              id: work.id || `${index + 1}`,
              description: work.description || "",
              image: (work.image || null) as File | string | null,
            })
          ) || [],
      });
    }
  }, [isEditMode, serviceData, open, reset]);

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
      const params: CreateServiceParams = {
        name_ar: data.name_ar,
        name_en: data.name_en,
        category_website_cms_id: data.category_id,
        description_ar: data.description_ar,
        description_en: data.description_en,
        status: data.status,
        icon: data.icon_image instanceof File ? data.icon_image : null,
        main_image: data.main_image instanceof File ? data.main_image : null,
        previous_work:
          data.previous_works?.map((work) => ({
            description: work.description,
            image: work.image instanceof File ? work.image : null,
          })) || [],
      };

      if (data.request_id) {
        params.reference_number = data.request_id;
      }

      if (isEditMode && serviceId) {
        await CompanyDashboardServicesApi.update(serviceId, params);
      } else {
        await CompanyDashboardServicesApi.create(params);
      }

      toast.success(
        isEditMode ? tForm("updateSuccess") : tForm("createSuccess")
      );
      refetch();
      onSuccess?.();
      reset({});
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-6xl w-full bg-sidebar max-h-[90vh] overflow-y-auto overflow-x-hidden`}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold ">
            {isEditMode
              ? t("editService") || "Edit service"
              : t("addService") || "Add new service"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Featured Services Toggle - Top Section */}
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold">
                {tForm("featuredServicesTitle") ||
                  "Featured service (show on homepage)"}
              </h3>
              <FormField
                control={control}
                name="status"
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

            {/* Image Uploads and Service Names - 12 Column Grid */}
            <div className="grid grid-cols-12 gap-4">
              {/* Icon Image - 3 columns */}
              <div className="col-span-3">
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
                              : serviceData?.payload?.icon
                          }
                          minHeight="200px"
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Main Image - 3 columns */}
              <div className="col-span-3">
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
                              : serviceData?.payload?.main_image
                          }
                          minHeight="200px"
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Service Names - 6 columns */}
              <div className="col-span-6 space-y-4">
                <FormField
                  control={control}
                  name="name_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs " required>
                        {tForm("nameAr")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          variant="secondary"
                          disabled={isSubmitting || isFetching}
                          className="mt-1 bg-sidebar  border-gray-700"
                          placeholder={tForm("nameArPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs " required>
                        {tForm("nameEn")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          variant="secondary"
                          disabled={isSubmitting || isFetching}
                          className="mt-1 bg-sidebar  border-gray-700"
                          placeholder={tForm("nameEnPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <FormField
                control={control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs " required>
                      {tForm("category")}
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting || isFetching}
                      >
                        <SelectTrigger
                          className="mt-1 bg-sidebar border-gray-700  h-12"
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
              {/* Request ID */}
              <FormField
                control={control}
                name="request_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs ">
                      {tForm("requestId")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        variant="secondary"
                        disabled={isSubmitting || isFetching}
                        className="mt-1 bg-sidebar  border-gray-700"
                        placeholder={tForm("requestIdPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Service Details */}
            <div className="grid grid-cols-1 gap-4">
              {/* Description Arabic */}
              <FormField
                control={control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs " required>
                      {tForm("descriptionAr")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting || isFetching}
                        rows={6}
                        className="mt-1 resize-none bg-sidebar  border-gray-700"
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
                    <FormLabel className="text-xs " required>
                      {tForm("descriptionEn")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting || isFetching}
                        rows={6}
                        className="mt-1 resize-none bg-sidebar  border-gray-700"
                        placeholder={tForm("descriptionEnPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Previous Works Section */}
            <PreviousWorksList
              control={control}
              previousWorks={previousWorks}
              isSubmitting={isSubmitting || isFetching}
              onAdd={addPreviousWork}
              onRemove={removePreviousWork}
              initialPreviousWorks={serviceData?.payload?.previous_work?.map((work) => ({
                id: work.id,
                description: work.description,
                image: work.image ? { url: work.image } : undefined,
              }))}
            />

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full "
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
