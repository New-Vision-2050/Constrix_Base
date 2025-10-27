"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import LanguageTabs from "@/components/shared/LanguageTabs";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { BrandsApi } from "@/services/api/ecommerce/brands";
import { toast } from "sonner";
import {
  CreateBrandParams,
  UpdateBrandParams,
} from "@/services/api/ecommerce/brands/types/params";

const createBrandSchema = (t: (key: string) => string) =>
  z.object({
    name_ar: z
      .string()
      .min(1, { message: t("brand.brandNameRequired") || "Brand name in Arabic is required" })
      .min(2, { message: t("brand.brandNameMinLength") || "Brand name must be at least 2 characters" }),
    name_en: z
      .string()
      .min(1, { message: t("brand.brandNameRequired") || "Brand name in English is required" })
      .min(2, { message: t("brand.brandNameMinLength") || "Brand name must be at least 2 characters" }),
    description_ar: z
      .string()
      .min(1, { message: t("brand.descriptionRequired") || "Description in Arabic is required" }),
    description_en: z
      .string()
      .min(1, { message: t("brand.descriptionRequired") || "Description in English is required" }),
    image: z
      .any()
      .nullable()
      .refine(
        (file) => file === null || file === undefined || file instanceof File,
        {
          message: t("brand.imageRequired"),
        }
      ),
  });

type BrandFormData = z.infer<ReturnType<typeof createBrandSchema>>;

interface AddBrandDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  brandId?: string; // Add brandId for edit mode
}

export default function AddBrandDialog({
  open,
  onClose,
  onSuccess,
  brandId,
}: AddBrandDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!brandId;
  const [activeTab, setActiveTab] = useState("ar");

  // Fetch brand data when editing
  const { data: brandData, isLoading: isFetching } = useQuery({
    queryKey: ["brand", brandId],
    queryFn: () => BrandsApi.show(brandId!),
    enabled: isEditMode && open,
  });

  const form = useForm<BrandFormData>({
    resolver: zodResolver(createBrandSchema(t)),
    defaultValues: {
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      image: null,
    },
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

  // Populate form with brand data when editing
  useEffect(() => {
    if (isEditMode && brandData?.data?.payload) {
      const brand = brandData.data.payload;

      setValue("name_ar", brand.name_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("name_en", brand.name_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("description_ar", brand.description_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("description_en", brand.description_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [isEditMode, brandData, open, setValue]);

  const onSubmit = async (data: BrandFormData) => {
    try {
      if (isEditMode && brandId) {
        // Update existing brand
        const updateParams: UpdateBrandParams = {
          "name[ar]": data.name_ar,
          "name[en]": data.name_en,
          "description[ar]": data.description_ar || "",
          "description[en]": data.description_en || "",
        };

        // Only include image if it's a File object (new upload)
        if (data.image instanceof File) {
          updateParams.brand_image = data.image;
        }

        await BrandsApi.update(brandId, updateParams);
      } else {
        // Create new brand
        if (!data.image) {
          toast.error(t("brand.imageRequired"));
          return;
        }

        const createParams: CreateBrandParams = {
          "name[ar]": data.name_ar,
          "name[en]": data.name_en,
          "description[ar]": data.description_ar || "",
          "description[en]": data.description_en || "",
          brand_image: data.image,
        };

        await BrandsApi.create(createParams);
      }

      toast.success(
        isEditMode
          ? t("brand.updateSuccess") || "Brand updated successfully!"
          : t("brand.createSuccess") || "Brand created successfully!"
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} brand:`,
        error
      );

      // Handle 422 validation errors from server
      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          // Display first validation error
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage || t("brand.validationError"));
          return;
        }
      }

      toast.error(
        isEditMode
          ? t("brand.updateError") ||
              "Failed to update brand. Please try again."
          : t("brand.createError") ||
              "Failed to create brand. Please try again."
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
        className={`max-w-4xl w-full bg-sidebar border-gray-700 ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? t("brand.editBrand") : t("brand.addBrand")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6">
              {/* Right Column - Image Upload */}
              <div className="flex flex-col  w-full">
                <ImageUpload
                  label={t("brand.imageLabel")}
                  maxSize="5MB - الحجم الأقصى"
                  dimensions="1920 × 1080"
                  required={!isEditMode}
                  onChange={(file) => setValue("image", file)}
                  initialValue={brandData?.data?.payload?.file?.url}
                  minHeight="250px"
                />
              </div>
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                <LanguageTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  arabicContent={
                    <>
                      {/* Brand Name Arabic */}
                      <FormField
                        control={control}
                        name="name_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs" required>
                              {t("brand.brandName")}
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
                              {t("brand.description")}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={isSubmitting || isFetching}
                                rows={2}
                                className="mt-1 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormErrorMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  }
                  englishContent={
                    <>
                      {/* Brand Name English */}
                      <FormField
                        control={control}
                        name="name_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs" required>
                              {t("brand.brandName")}
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

                      {/* Description English */}
                      <FormField
                        control={control}
                        name="description_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs" required>
                              {t("brand.description")}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={isSubmitting || isFetching}
                                rows={2}
                                className="mt-1 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormErrorMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  }
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
              >
                {(isSubmitting || isFetching) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("brand.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
