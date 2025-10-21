"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { CategoriesApi } from "@/services/api/ecommerce/categories";
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from "@/services/api/ecommerce/categories/types/params";
import { useQuery } from "@tanstack/react-query";

// Form validation schema
const formSchema = z.object({
  name_ar: z.string().min(1, "اسم القسم بالعربية مطلوب"),
  name_en: z.string().min(1, "Category name in English is required"),
  parent_category_id: z.string().min(1, "القسم الفرعي مطلوب"),
  main_category_id: z.string().min(1, "القسم الرئيسي مطلوب"),
  priority: z.string().min(1, "الاولوية مطلوبة"),
});

type FormData = z.infer<typeof formSchema>;

// Priority options array
const PRIORITY_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

interface AddSubSubCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryId?: string;
}

export default function AddSubSubCategoryDialog({
  open,
  onClose,
  onSuccess,
  categoryId,
}: AddSubSubCategoryDialogProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const isEditMode = !!categoryId;

  // Fetch main categories (depth=0)
  const { data: mainCategoriesData, isLoading: isLoadingMainCategories } =
    useQuery({
      queryKey: ["main-categories"],
      queryFn: () => CategoriesApi.list({ depth: "0" }),
    });

  // Fetch sub categories based on selected main category (depth=1)
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<
    string | null
  >(null);

  const { data: subCategoriesData, isLoading: isLoadingSubCategories } =
    useQuery({
      queryKey: ["sub-categories", selectedMainCategoryId],
      queryFn: () =>
        CategoriesApi.list({
          depth: "1",
          parent_id: selectedMainCategoryId!,
        }),
      enabled: !!selectedMainCategoryId,
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_ar: "",
      name_en: "",
      parent_category_id: "",
      main_category_id: "",
      priority: "1",
    },
  });

  const watchMainCategory = watch("main_category_id");

  // Update selected main category when it changes
  useEffect(() => {
    if (watchMainCategory) {
      setSelectedMainCategoryId(watchMainCategory);
      // Reset sub category selection when main category changes
      if (!isEditMode) {
        setValue("parent_category_id", "");
      }
    }
  }, [watchMainCategory, setValue, isEditMode]);

  // Fetch edit data
  useEffect(() => {
    if (categoryId && open) {
      setIsFetching(true);
      CategoriesApi.show(categoryId)
        .then((response) => {
          const data = response.data.payload;
          setValue("name_ar", data.name || "");
          setValue("name_en", data.name || "");
          setValue("priority", data.priority?.toString() || "1");
          setValue("parent_category_id", data.parent?.id || "");

          // Set main category (parent's parent) from API response
          if (data.parent?.parent?.id) {
            setValue("main_category_id", data.parent.parent.id);
            setSelectedMainCategoryId(data.parent.parent.id);
          }
        })
        .catch((error) => {
          toast.error(t("category.fetchError") || "Failed to load category");
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [categoryId, open, setValue, t]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
      setActiveTab("ar");
      setSelectedMainCategoryId(null);
    }
  }, [open, reset]);

  // Show validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError?.message || t("category.validationError"));
    }
  }, [errors, t]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      if (isEditMode && categoryId) {
        const updateData: UpdateCategoryParams = {
          "name[ar]": data.name_ar,
          "name[en]": data.name_en,
          priority: Number(data.priority),
          parent_id: data.parent_category_id,
        };
        await CategoriesApi.update(categoryId, updateData);
        toast.success(
          t("category.updateSuccess") || "Category updated successfully"
        );
      } else {
        const createData: CreateCategoryParams = {
          "name[ar]": data.name_ar,
          "name[en]": data.name_en,
          priority: Number(data.priority),
          parent_id: data.parent_category_id,
        };
        await CategoriesApi.create(createData);
        toast.success(
          t("category.createSuccess") || "Category created successfully"
        );
      }

      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      // Handle 422 validation errors
      if (error?.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {};
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => {
            const fieldName = field.replace(/\[|\]/g, " ").trim();
            return `${fieldName}: ${(messages as string[]).join(", ")}`;
          })
          .join("\n");

        toast.error(errorMessages || t("category.validationError"));
        return;
      }

      // Handle 404 errors
      if (error?.response?.status === 404) {
        toast.error(t("category.notFound") || "Category not found");
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
    } finally {
      setIsSubmitting(false);
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
              ? t("category.editSubSubCategory") || "تعديل قسم فرعي فرعي"
              : t("category.addSubSubCategory") || "إضافة قسم فرعي فرعي"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "ar" | "en")}
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

            {/* Main Category Select */}
            <div>
              <Label htmlFor="main_category_id" className="text-xs ">
                {activeTab === "ar" ? "القسم الرئيسي" : "Main Category"}
              </Label>
              <Controller
                name="main_category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      isSubmitting || isFetching || isLoadingMainCategories
                    }
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
              {errors.main_category_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.main_category_id.message}
                </p>
              )}
            </div>

            {/* Sub Category Select (Parent) */}
            <div>
              <Label htmlFor="parent_category_id" className="text-xs ">
                {activeTab === "ar" ? "القسم الفرعي" : "Sub Category"}
              </Label>
              <Controller
                name="parent_category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      isSubmitting ||
                      isFetching ||
                      isLoadingSubCategories ||
                      !selectedMainCategoryId
                    }
                  >
                    <SelectTrigger className="mt-1 bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12">
                      <SelectValue
                        placeholder={
                          activeTab === "ar"
                            ? "اختر القسم الفرعي"
                            : "Select sub category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategoriesData?.data?.payload?.map(
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

            {/* Priority Select */}
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
