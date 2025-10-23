"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, X } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { BannersApi } from "@/services/api/ecommerce/banners";
import { toast } from "sonner";
import {
  CreateBannerParams,
  UpdateBannerParams,
} from "@/services/api/ecommerce/banners/types/params";

const createBannerSchema = (t: (key: string) => string) =>
  z.object({
    name_ar: z
      .string()
      .min(1, t("banner.bannerNameRequired") || "Banner name is required"),
    name_en: z
      .string()
      .min(1, t("banner.bannerNameRequired") || "Banner name is required"),
    type: z.string().min(1, t("banner.typeRequired") || "Type is required"),
    banner_image: z
      .any()
      .nullable()
      .refine(
        (file) => file === null || file === undefined || file instanceof File,
        {
          message: t("banner.imageRequired") || "Invalid image file",
        }
      ),
  });

type BannerFormData = z.infer<ReturnType<typeof createBannerSchema>>;

// Banner type options
const BANNER_TYPES = [
  { value: "الرئيسية", label: "الرئيسية" },
  { value: "التواصل", label: "التواصل" },
  { value: "الوصول حقنا", label: "الوصول حقنا" },
  { value: "الخصومات", label: "الخصومات" },
];

interface AddBannerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  bannerId?: string;
}

export default function AddBannerDialog({
  open,
  onClose,
  onSuccess,
  bannerId,
}: AddBannerDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!bannerId;
  const [activeTab, setActiveTab] = useState("ar");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch banner data when editing
  const { data: bannerData, isLoading: isFetching } = useQuery({
    queryKey: ["banner", bannerId],
    queryFn: () => BannersApi.show(bannerId!),
    enabled: isEditMode && open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BannerFormData>({
    resolver: zodResolver(createBannerSchema(t)),
    defaultValues: {
      name_ar: "",
      name_en: "",
      type: "",
      banner_image: null,
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

  // Populate form with banner data when editing
  useEffect(() => {
    if (isEditMode && bannerData?.data?.payload) {
      const banner = bannerData.data.payload;

      setValue("name_ar", banner.name || "");
      setValue("name_en", banner.name || "");
      setValue("type", banner.type || "");

      // Set image preview if exists
      if (banner.file?.url) {
        setImagePreview(banner.file.url);
      }
    }
  }, [isEditMode, bannerData, setValue]);

  const onSubmit = async (data: BannerFormData) => {
    try {
      if (isEditMode && bannerId) {
        // Update existing banner
        const updateParams: UpdateBannerParams = {
          "name[ar]": data.name_ar,
          "name[en]": data.name_en,
          type: data.type,
          banner_image: data.banner_image,
        };

        await BannersApi.update(bannerId, updateParams);

        toast.success(
          t("banner.updateSuccess") || "Banner updated successfully!"
        );
      } else {
        // Create new banner
        if (!data.banner_image) {
          toast.error(t("banner.imageRequired") || "Image is required");
          return;
        }

        const createParams: CreateBannerParams = {
          "name[ar]": data.name_ar,
          "name[en]": data.name_en,
          type: data.type,
          banner_image: data.banner_image,
        };

        await BannersApi.create(createParams);

        toast.success(
          t("banner.createSuccess") || "Banner created successfully!"
        );
      }

      onSuccess?.();
      reset();
      setImagePreview(null);
      setActiveTab("ar");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    } catch (error: any) {
      // Handle 422 validation errors from server
      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => {
              const fieldName = field.replace(/\[|\]/g, " ").trim();
              return `${fieldName}: ${(messages as string[]).join(", ")}`;
            })
            .join("\n");

          toast.error(
            errorMessages || t("banner.validationError") || "Validation error"
          );
          return;
        }
      }

      // Handle 404 errors
      if (error?.response?.status === 404) {
        toast.error(
          t("banner.notFound") || "Banner not found. It may have been deleted."
        );
        onClose();
        return;
      }

      // Handle 403 errors
      if (error?.response?.status === 403) {
        toast.error(
          t("banner.permissionDenied") ||
            "You don't have permission to perform this action."
        );
        return;
      }

      // Handle network errors
      if (!error?.response) {
        toast.error(
          t("banner.networkError") ||
            "Network error. Please check your connection."
        );
        return;
      }

      // Generic error message
      toast.error(
        isEditMode
          ? t("banner.updateError") ||
              "Failed to update banner. Please try again."
          : t("banner.createError") ||
              "Failed to create banner. Please try again."
      );
    }
  };

  const handleFileSelect = (file: File) => {
    setValue("banner_image", file);
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
    setValue("banner_image", null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      reset();
      setImagePreview(null);
      setActiveTab("ar");
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
            {isEditMode
              ? t("banner.editBanner") || "تعديل البانر"
              : t("banner.addBanner") || "إضافة بانر"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            {/* Right Column - Image Upload */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <Label className="text-xs block text-center mb-2">
                  {t("banner.imageLabel") || "صورة البانر"}
                </Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center hover:border-gray-500 transition-colors min-h-[300px]">
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
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        onClick={handleRemoveImage}
                        title={t("banner.removeImage")}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-700 rounded-lg flex flex-col items-center justify-center mb-4">
                      <Upload className="w-10 h-10" />
                    </div>
                  )}

                  <p className="text-xs text-center mb-1">
                    {t("banner.maxSize") || "3MB - الحجم الأقصى"}
                  </p>
                  <p className="text-xs text-gray-400 text-center mb-4">
                    {t("banner.dimensions") || "1920 × 600"}
                  </p>

                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={isSubmitting || isFetching}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {t("banner.attach") || "إرفاق"}
                  </Button>
                </div>
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
                  <TabsTrigger value="ar" className="text-sm">
                    اللغة العربية (AR)
                  </TabsTrigger>
                  <TabsTrigger value="en" className="text-sm">
                    اللغة الإنجليزية (EN)
                  </TabsTrigger>
                </TabsList>

                {/* Arabic Tab */}
                <TabsContent value="ar" className="space-y-4">
                  {/* Banner Name Arabic */}
                  <div>
                    <Label htmlFor="name_ar" className="text-xs">
                      {t("banner.bannerName") || "اسم البانر"}
                    </Label>
                    <Input
                      id="name_ar"
                      variant="secondary"
                      {...register("name_ar")}
                      disabled={isSubmitting || isFetching}
                      className="mt-1 bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12"
                    />
                    {errors.name_ar && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name_ar.message}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <Label htmlFor="type-ar" className="text-xs">
                      {t("banner.type") || "النوع"}
                    </Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSubmitting || isFetching}
                        >
                          <SelectTrigger
                            id="type-ar"
                            className="mt-1 bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12"
                          >
                            <SelectValue
                              placeholder={t("banner.selectType") || "اختر النوع"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {BANNER_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* English Tab */}
                <TabsContent value="en" className="space-y-4">
                  {/* Banner Name English */}
                  <div>
                    <Label htmlFor="name_en" className="text-xs">
                      {t("banner.bannerName") || "Banner Name"}
                    </Label>
                    <Input
                      id="name_en"
                      variant="secondary"
                      {...register("name_en")}
                      disabled={isSubmitting || isFetching}
                      className="mt-1 bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12"
                    />
                    {errors.name_en && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name_en.message}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <Label htmlFor="type-en" className="text-xs">
                      {t("banner.type") || "Type"}
                    </Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSubmitting || isFetching}
                        >
                          <SelectTrigger
                            id="type-en"
                            className="mt-1 bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12"
                          >
                            <SelectValue
                              placeholder={t("banner.selectType") || "Select Type"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {BANNER_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.type.message}
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
              {t("banner.save") || "حفظ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
