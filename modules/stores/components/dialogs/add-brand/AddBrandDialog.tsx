"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, X } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { BrandsApi } from "@/services/api/ecommerce/brands";
import { toast } from "sonner";
import {
  CreateBrandParams,
  UpdateBrandParams,
} from "@/services/api/ecommerce/brands/types/params";

const createBrandSchema = (t: (key: string) => string) =>
  z.object({
    name_ar: z.string().optional(),
    name_en: z.string().optional(),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch brand data when editing
  const { data: brandData, isLoading: isFetching } = useQuery({
    queryKey: ["brand", brandId],
    queryFn: () => BrandsApi.show(brandId!),
    enabled: isEditMode && open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    resolver: zodResolver(createBrandSchema(t)),
    defaultValues: {
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      image: null,
    },
  });

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

      setValue("name_ar", brand.name || "");
      setValue("name_en", brand.name || "");
      setValue("description_ar", brand.description || "");
      setValue("description_en", brand.description || "");
    }
  }, [isEditMode, brandData, setValue]);

  const onSubmit = async (data: BrandFormData) => {
    try {
      if (isEditMode && brandId) {
        // Update existing brand
        const updateParams: UpdateBrandParams = {
          "name[ar]": data.name_ar,
          "name[en]": data.name_en,
          "description[ar]": data.description_ar || "",
          "description[en]": data.description_en || "",
          brand_image: data.image || undefined,
        };

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
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
          ? t("brand.updateError") || "Failed to update brand. Please try again."
          : t("brand.createError") || "Failed to create brand. Please try again."
      );
    }
  };

  const handleFileSelect = (file: File) => {
    setValue("image", file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setValue("image", null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      reset();
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            {/* Right Column - Image Upload */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <Label className="text-xs block text-center mb-2">
                  {t("brand.imageLabel")}
                </Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center hover:border-gray-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    }}
                    disabled={isSubmitting || isFetching}
                  />

                  {imagePreview ? (
                    <div className="relative w-32 h-32 mb-4">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        onClick={handleRemoveImage}
                        title={t("brand.removeImage")}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-700 rounded-lg flex flex-col items-center justify-center mb-4">
                      <Upload className="w-10 h-10 " />
                    </div>
                  )}

                  <p className="text-xs text-center mb-1">
                    {t("brand.dragDropImage")}
                  </p>
                  <p className="text-xs text-gray-500 text-center mb-4">
                    {t("brand.supportedFormats")}
                  </p>
                </div>

                {!imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-4 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                    onClick={handleUpload}
                    disabled={isSubmitting || isFetching}
                  >
                    {t("brand.attachImage")}
                  </Button>
                )}
              </div>
            </div>
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
                dir="rtl"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-sidebar">
                  <TabsTrigger value="ar" className="text-sm ">
                    اللغة العربية (AR)
                  </TabsTrigger>
                  <TabsTrigger value="en" className="text-sm">
                    اللغة الإنجليزية (EN)
                  </TabsTrigger>
                </TabsList>

                {/* Arabic Tab */}
                <TabsContent value="ar" className="space-y-4">
                  {/* Brand Name Arabic */}
                  <div>
                    <Label htmlFor="name_ar" className="text-xs">
                      {t("brand.brandName")}
                    </Label>
                    <Input
                      id="name_ar"
                      variant="secondary"
                      {...register("name_ar")}
                      disabled={isSubmitting || isFetching}
                      className="mt-1"
                    />
                    {errors.name_ar && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name_ar.message}
                      </p>
                    )}
                  </div>

                  {/* Description Arabic */}
                  <div>
                    <Label htmlFor="description_ar" className="text-xs">
                      {t("brand.description")}
                    </Label>
                    <Textarea
                      id="description_ar"
                      {...register("description_ar")}
                      disabled={isSubmitting || isFetching}
                      rows={2}
                      className="mt-1 resize-none"
                    />
                    {errors.description_ar && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description_ar.message}
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* English Tab */}
                <TabsContent value="en" className="space-y-4">
                  {/* Brand Name English */}
                  <div>
                    <Label htmlFor="name_en" className="text-xs ">
                      {t("brand.brandName")}
                    </Label>
                    <Input
                      id="name_en"
                      variant="secondary"
                      {...register("name_en")}
                      disabled={isSubmitting || isFetching}
                      className="mt-1"
                    />
                    {errors.name_en && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name_en.message}
                      </p>
                    )}
                  </div>

                  {/* Description English */}
                  <div>
                    <Label htmlFor="description_en" className="text-xs ">
                      {t("brand.description")}
                    </Label>
                    <Textarea
                      id="description_en"
                      {...register("description_en")}
                      disabled={isSubmitting || isFetching}
                      rows={2}
                      className="mt-1 resize-none"
                    />
                    {errors.description_en && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description_en.message}
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
      </DialogContent>
    </Dialog>
  );
}
