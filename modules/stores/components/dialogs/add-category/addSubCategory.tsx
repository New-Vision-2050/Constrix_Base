"use client";

import React, { useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
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
    parent_category_id: z.string().optional(),
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

export default function AddSubCategoryDialog({
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

  // Fetch category data when editing
  const { data: categoryData, isLoading: isFetching } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => CategoriesApi.show(categoryId!),
    enabled: isEditMode && open,
  });

  // Fetch main categories for parent selection
  const { data: mainCategoriesData, isLoading: isLoadingCategories } = useQuery(
    {
      queryKey: ["main-categories"],
      queryFn: () => CategoriesApi.list({ depth: "0" }),
      enabled: open,
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(createCategorySchema(t)),
    defaultValues: {
      name_ar: "",
      name_en: "",
      priority: "1",
      parent_category_id: "",
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

      setValue("name_ar", category.name || "");
      setValue("name_en", category.name || "");
      setValue("priority", String(category.priority || 1));
      setValue("parent_category_id", category.parent?.id || "");
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
          parent_id: data.parent_category_id || undefined,
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
          parent_id: data.parent_category_id || parentId,
          priority: Number(data.priority),
        };

        await CategoriesApi.create(createParams);

        toast.success(
          t("category.createSuccess") || "Category created successfully!"
        );
      }

      onSuccess?.();
      reset();
      setActiveTab("ar");
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

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-2xl w-full bg-sidebar border-gray-700 ${
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
                {/* Category Name Arabic */}
                <div>
                  <Label htmlFor="name_ar" className="text-xs ">
                    اسم القسم بالعربية
                  </Label>
                  <Input
                    id="name_ar"
                    variant="secondary"
                    {...register("name_ar")}
                    placeholder="أدخل اسم القسم"
                    disabled={isSubmitting || isFetching}
                    className="mt-1 bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12"
                  />
                  {errors.name_ar && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name_ar.message}
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* English Tab */}
              <TabsContent value="en" className="space-y-4">
                {/* Category Name English */}
                <div>
                  <Label htmlFor="name_en" className="text-xs ">
                    Category Name in English
                  </Label>
                  <Input
                    id="name_en"
                    variant="secondary"
                    {...register("name_en")}
                    placeholder="Enter category name"
                    disabled={isSubmitting || isFetching}
                    className="mt-1  text-white h-12"
                  />
                  {errors.name_en && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name_en.message}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Main Category Select - After tabs */}
            <div>
              <Label htmlFor="parent_category_id" className="text-xs ">
                {activeTab === "ar" ? "القسم الرئيسي" : "Main Category"}
              </Label>
              <Controller
                name="parent_category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || isFetching || isLoadingCategories}
                  >
                    <SelectTrigger className="mt-1 bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12">
                      <SelectValue
                        placeholder={
                          activeTab === "ar"
                            ? "اختر القسم الرئيسي"
                            : "Select main category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {mainCategoriesData?.data?.payload?.map(
                        (category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.parent_category_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parent_category_id.message}
                </p>
              )}
            </div>

            {/* Priority Select - Last */}
            <div>
              <Label htmlFor="priority" className="text-xs ">
                {activeTab === "ar" ? "الاولوية" : "Priority"}
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
                    <SelectTrigger className="mt-1 bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12">
                      <SelectValue
                        placeholder={
                          activeTab === "ar"
                            ? "اختر الأولوية"
                            : "Select priority"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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
