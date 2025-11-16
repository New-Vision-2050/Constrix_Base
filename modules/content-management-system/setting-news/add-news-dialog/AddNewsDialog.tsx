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
  createNewsFormSchema,
  NewsFormData,
  getDefaultNewsFormValues,
} from "../schemas/news-form.schema";
import {
  AddNewsDialogProps,
  Category,
  AxiosError,
  ApiResponse,
  NewsData,
} from "../types";

export default function AddNewsDialog({
  open,
  onClose,
  onSuccess,
  newsId,
}: AddNewsDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations("content-management-system.news");
  const isEditMode = !!newsId;

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["news-categories"],
    queryFn: async () => {
      const response = await apiClient.get(
        `${baseURL}/company-dashboard/categories/list`
      );
      return response.data;
    },
    enabled: open,
  });

  // Fetch news data when editing
  const { data: newsData, isLoading: isFetching } = useQuery<
    ApiResponse<NewsData>
  >({
    queryKey: ["news", newsId],
    queryFn: async () => {
      const response = await apiClient.get(
        `${baseURL}/company-dashboard/news/${newsId}`
      );
      return response.data;
    },
    enabled: isEditMode && open,
  });

  const form = useForm({
    resolver: zodResolver(createNewsFormSchema(t, isEditMode)),
    defaultValues: getDefaultNewsFormValues(),
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

  // Populate form with news data when editing
  useEffect(() => {
    if (isEditMode && newsData?.data?.payload) {
      const news = newsData.data.payload;

      setValue("title_ar", news.title_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("title_en", news.title_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("content_ar", news.content_ar || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("content_en", news.content_en || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("category_id", news.category_id?.toString() || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("publish_date", news.publish_date || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("end_date", news.end_date || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [isEditMode, newsData, open, setValue]);

  const onSubmit = async (data: NewsFormData) => {
    try {
      const formData = new FormData();
      formData.append("title[ar]", data.title_ar);
      formData.append("title[en]", data.title_en);
      formData.append("content[ar]", data.content_ar);
      formData.append("content[en]", data.content_en);
      formData.append("category_id", data.category_id);
      formData.append("publish_date", data.publish_date);
      formData.append("end_date", data.end_date);

      if (data.thumbnail_image instanceof File) {
        formData.append("thumbnail_image", data.thumbnail_image);
      }
      if (data.main_image instanceof File) {
        formData.append("main_image", data.main_image);
      }

      if (isEditMode && newsId) {
        await apiClient.put(
          `${baseURL}/company-dashboard/news/${newsId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        if (!data.thumbnail_image || !data.main_image) {
          toast.error(t("form.imagesRequired"));
          return;
        }
        await apiClient.post(`${baseURL}/company-dashboard/news`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success(
        isEditMode ? t("form.updateSuccess") : t("form.createSuccess")
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error: unknown) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} news:`,
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

  const categories = categoriesData?.data?.payload || [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-5xl w-full bg-sidebar border-gray-700 max-h-[90vh] overflow-y-auto ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? t("editNews") : t("addNews")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Fields and Image Uploads Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Title Fields */}
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs" required>
                        {t("form.titleAr")}
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
                <FormField
                  control={control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs" required>
                        {t("form.titleEn")}
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

              {/* Right Column - Image Uploads */}
              <div className="grid grid-cols-2 gap-4">
                <ImageUpload
                  label={t("form.thumbnailImage")}
                  maxSize="3MB - الحجم الأقصى"
                  dimensions="2160 × 2160"
                  required={!isEditMode}
                  onChange={(file) => setValue("thumbnail_image", file)}
                  initialValue={newsData?.data?.payload?.thumbnail_image?.url}
                  minHeight="100px"
                />
                <ImageUpload
                  label={t("form.mainImage")}
                  maxSize="3MB - الحجم الأقصى"
                  dimensions="2160 × 2160"
                  required={!isEditMode}
                  onChange={(file) => setValue("main_image", file)}
                  initialValue={newsData?.data?.payload?.main_image?.url}
                  minHeight="100px"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {t("form.category")}
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
                            placeholder={t("form.categoryPlaceholder")}
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
            {/* Category and Dates Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="publish_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {t("form.publishDate")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
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

              <FormField
                control={control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {t("form.endDate")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
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

            {/* Content Fields */}
            <div className="space-y-4">
              <FormField
                control={control}
                name="content_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {t("form.contentAr")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting || isFetching}
                        rows={6}
                        className="mt-1 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="content_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {t("form.contentEn")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting || isFetching}
                        rows={6}
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
