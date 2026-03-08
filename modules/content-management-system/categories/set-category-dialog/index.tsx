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
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { CompanyDashboardCategoriesApi } from "@/services/api/company-dashboard/categories";
import { toast } from "sonner";
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from "@/services/api/company-dashboard/categories/types/params";
import {
  createCategoryFormSchema,
  CategoryFormData,
  getDefaultCategoryFormValues,
} from "../schemas/category-form.schema";
import { CategoryTypes } from "../enums/Category-types";


interface SetCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categoryId?: string;
}

export default function SetCategoryDialog({
  open,
  onClose,
  onSuccess,
  categoryId,
}: SetCategoryDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations("content-management-system.categories.form");
  const isEditMode = !!categoryId;

  // Fetch category data when editing
  const { data: categoryData, isLoading: isFetching, refetch } = useQuery({
    queryKey: ["company-dashboard-category", categoryId],
    queryFn: () => CompanyDashboardCategoriesApi.show(categoryId!),
    enabled: isEditMode && open,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    staleTime: Infinity,
  });

  // Fetch category types
  const { data: categoryTypesData } = useQuery({
    queryKey: ["company-dashboard-category-types"],
    queryFn: () => CompanyDashboardCategoriesApi.categoriesTypes({
      category_type: CategoryTypes.CATEGORY_WEBSITE_TYPE,
    }),
    enabled: open,
  });

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(createCategoryFormSchema(t)),
    defaultValues: getDefaultCategoryFormValues(),
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

  // Populate form with category data when editing
  useEffect(() => {
    if (isEditMode && categoryData?.data?.payload) {
      const category = categoryData.data.payload;

      setValue("name_ar", category.name_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("name_en", category.name_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      // Set category_type if available - adjust based on your API response structure
      // Note: category_type field might not exist in ECM_Category, so we check safely
      const categoryType = (category as any).category_type || (category as any).type;
      if (categoryType) {
        // If category_type is an object, extract the id, otherwise use the value directly
        const categoryTypeId = typeof categoryType === 'object' && categoryType?.id
          ? categoryType.id
          : categoryType;
        setValue("category_type", categoryTypeId, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    }
  }, [isEditMode, categoryData, open, setValue]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditMode && categoryId) {
        // Update existing category
        const updateParams: UpdateCategoryParams = {
          name_ar: data.name_ar,
          name_en: data.name_en,
          category_type: data.category_type,
        };

        await CompanyDashboardCategoriesApi.update(categoryId, updateParams);
        refetch();
      } else {
        // Create new category
        const createParams: CreateCategoryParams = {
          name_ar: data.name_ar,
          name_en: data.name_en,
          category_type: data.category_type,
        };

        await CompanyDashboardCategoriesApi.create(createParams);
      }

      toast.success(
        isEditMode
          ? t("updateSuccess") || "Category updated successfully!"
          : t("createSuccess") || "Category created successfully!"
      );
      onSuccess?.();
      reset();
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
          // Display first validation error
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage || t("validationError"));
          return;
        }
      }

      toast.error(
        isEditMode
          ? t("updateError") ||
          "Failed to update category. Please try again."
          : t("createError") ||
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
        className={`max-w-2xl w-full bg-sidebar border-gray-700 ${isRtl ? "rtl" : "ltr"
          }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? t("editCategory") : t("addCategory")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Category Name Arabic */}
            <FormField
              control={control}
              name="name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs" required>
                    {t("nameAr") || "Category Name Arabic"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      variant="secondary"
                      disabled={isSubmitting || isFetching}
                      className="mt-1"
                      placeholder={t("nameArPlaceholder") || "Enter category name in Arabic"}
                      {...field}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />

            {/* Category Name English */}
            <FormField
              control={control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs" required>
                    {t("nameEn") || "Category Name English"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      variant="secondary"
                      disabled={isSubmitting || isFetching}
                      className="mt-1"
                      placeholder={t("nameEnPlaceholder") || "Enter category name in English"}
                      {...field}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />

            {/* Category Type */}
            <FormField
              control={control}
              name="category_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs" required>
                    {t("type") || "Type"}
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting || isFetching}
                    >
                      <SelectTrigger
                        className={`mt-1 bg-sidebar border-white text-white h-12 
                       ${isRtl ? "text-right" : "text-left"}`}
                       dir={isRtl ? "ltr" : "rtl"}
                        showClear={!!field.value}
                        onClear={() => field.onChange("")}
                      >
                        <SelectValue
                          placeholder={t("typePlaceholder") || "Select type"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryTypesData?.data?.payload?.map((option: any) => (
                          <SelectItem key={option.id} value={option.id.toString()}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                {t("save") || "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
