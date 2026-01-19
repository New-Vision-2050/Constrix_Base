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
import LanguageTabs from "@/components/shared/LanguageTabs";
import { Loader2, Upload, X } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { CategoriesApi } from "@/services/api/ecommerce/categories";
import { toast } from "sonner";
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from "@/services/api/ecommerce/categories/types/params";

const createCategorySchema = (t: (key: string) => string) =>
  z.object({
    name_ar: z
      .string()
      .min(
        1,
        t("category.categoryNameRequired") || "Category name is required"
      ),
    name_en: z
      .string()
      .min(
        1,
        t("category.categoryNameRequired") || "Category name is required"
      ),
    priority: z
      .string()
      .min(1, t("category.priorityRequired") || "Priority is required"),
    category_image: z
      .any()
      .nullable()
      .refine(
        (file) => file === null || file === undefined || file instanceof File,
        {
          message: t("category.imageRequired") || "Invalid image file",
        }
      ),
  });

type CategoryFormData = z.infer<ReturnType<typeof createCategorySchema>>;

// Priority options array
const PRIORITY_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categoryId?: string;
  parentId?: string;
}

export default function AddCategoryDialog({
  open,
  onClose,
  onSuccess,
  categoryId,
  parentId,
}: AddCategoryDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!categoryId;
  const [activeTab, setActiveTab] = useState("ar");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch category data when editing
  const { data: categoryData, isLoading: isFetching } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => CategoriesApi.show(categoryId!),
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
  } = useForm<CategoryFormData>({
    resolver: zodResolver(createCategorySchema(t)),
    defaultValues: {
      name_ar: "",
      name_en: "",
      priority: "",
      category_image: null,
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

  // Populate form with category data when editing
  useEffect(() => {
    if (isEditMode && categoryData?.data?.payload) {
      const category = categoryData.data.payload;

      setValue("name_ar", category?.name_ar || "");
      setValue("name_en", category?.name_en || "");
      setValue("priority", String(category?.priority || 1));
      setImagePreview(category.category_image ?? category?.file?.url ?? "");
    }
  }, [isEditMode, categoryData, setValue]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditMode && categoryId) {
        // Update existing category
        const updateParams: UpdateCategoryParams = {
          "name[ar]": data.name_ar,
          "name[en]": data.name_en,
          priority: Number(data.priority),
          category_image: data.category_image,
        };

        await CategoriesApi.update(categoryId, updateParams);

        toast.success(
          t("category.updateSuccess") || "Category updated successfully!"
        );
      } else {
        // Create new category
        const createParams: CreateCategoryParams = {
          "name[ar]": data.name_ar,
          "name[en]": data.name_en,
          parent_id: parentId,
          priority: Number(data.priority),
          category_image: data.category_image,
        };

        await CategoriesApi.create(createParams);

        toast.success(
          t("category.createSuccess") || "Category created successfully!"
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
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} category:`,
        error
      );

      // Handle 422 validation errors from server
      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          // Display all validation errors
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => {
              const fieldName = field.replace(/\[|\]/g, " ").trim();
              return `${fieldName}: ${(messages as string[]).join(", ")}`;
            })
            .join("\n");

          toast.error(
            errorMessages || t("category.validationError") || "Validation error"
          );
          return;
        }
      }

      // Handle 404 errors
      if (error?.response?.status === 404) {
        toast.error(
          t("category.notFound") ||
            "Category not found. It may have been deleted."
        );
        onClose();
        return;
      }

      // Handle 403 errors
      if (error?.response?.status === 403) {
        toast.error(
          t("category.permissionDenied") ||
            "You don't have permission to perform this action."
        );
        return;
      }

      // Handle network errors
      if (!error?.response) {
        toast.error(
          t("category.networkError") ||
            "Network error. Please check your connection."
        );
        return;
      }

      // Generic error message
      toast.error(
        isEditMode
          ? t("category.updateError") ||
              "Failed to update category. Please try again."
          : t("category.createError") ||
              "Failed to create category. Please try again."
      );
    }
  };

  const handleFileSelect = (file: File) => {
    setValue("category_image", file);
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
    setValue("category_image", null);
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
            {isEditMode
              ? t("category.editCategory") || "تعديل القسم"
              : t("category.addCategory") || "إضافة قسم"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            {/* Right Column - Image Upload */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <Label className="text-xs block text-center mb-2">
                  {t("category.imageLabel") || "صورة القسم"}
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
                        title={t("category.removeImage")}
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
                    {t("category.dragDropImage") || "اسحب وأفلت الصورة هنا"}
                  </p>
                  <p className="text-xs text-gray-500 text-center mb-4">
                    {t("category.supportedFormats") ||
                      "PNG, JPG, WEBP (MAX. 3MB)"}
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
                    {t("category.attachImage") || "إرفاق صورة"}
                  </Button>
                )}
              </div>
            </div>
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <LanguageTabs
                activeTab={activeTab}
                onTabChange={(value) => setActiveTab(value as "ar" | "en")}
                arabicContent={
                  <>
                    {/* Category Name Arabic */}
                    <Controller
                      control={control}
                      name="name_ar"
                      render={({ field }) => (
                        <div>
                          <Label htmlFor="name_ar" className="text-xs ">
                            {t("category.categoryNameAr")}
                          </Label>
                          <Input
                            {...field}
                            id="name_ar"
                            variant="secondary"
                            placeholder={t(
                              "category.categoryNamePlaceholderAr"
                            )}
                            disabled={isSubmitting || isFetching}
                            className="mt-1 bg-sidebar border-white text-white h-12"
                          />
                          {errors.name_ar && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.name_ar.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    {/* Priority Select */}
                    <div>
                      <Label htmlFor="priority" className="text-xs ">
                        {t("category.priority")}
                      </Label>
                      <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isSubmitting || isFetching}
                          >
                            <SelectTrigger
                              className="mt-1 bg-sidebar  text-white h-12"
                              showClear={!!field.value}
                              onClear={() => field.onChange("")}
                            >
                              <SelectValue
                                placeholder={t("category.priority")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {PRIORITY_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.priority && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>
                  </>
                }
                englishContent={
                  <>
                    {/* Category Name English */}
                    <Controller
                      control={control}
                      name="name_en"
                      render={({ field }) => (
                        <div>
                          <Label htmlFor="name_en" className="text-xs ">
                            {t("category.categoryNameEn")}
                          </Label>
                          <Input
                            {...field}
                            id="name_en"
                            variant="secondary"
                            placeholder={t(
                              "category.categoryNamePlaceholderEn"
                            )}
                            disabled={isSubmitting || isFetching}
                            className="mt-1 bg-sidebar border-white text-white h-12"
                          />
                          {errors.name_en && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.name_en.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    {/* Priority Select */}
                    <div>
                      <Label htmlFor="priority_en" className="text-xs ">
                        {t("category.priority")}
                      </Label>
                      <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isSubmitting || isFetching}
                          >
                            <SelectTrigger
                              className="mt-1 bg-sidebar text-white h-12"
                              showClear={!!field.value}
                              onClear={() => field.onChange("")}
                            >
                              <SelectValue
                                placeholder={t("category.priority")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {PRIORITY_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.priority && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>
                  </>
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={isSubmitting || isFetching}
              className="w-full  text-white"
            >
              {(isSubmitting || isFetching) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("category.save") || "حفظ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
