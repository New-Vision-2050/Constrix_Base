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
import { CompanyDashboardCategoriesApi } from "@/services/api/company-dashboard/categories";
import { CompanyDashboardNewsApi } from "@/services/api/company-dashboard/news";
import { ShowNewsResponse } from "@/services/api/company-dashboard/news/types/response";
import {
  UpdateNewsParams,
  CreateNewsParams,
} from "@/services/api/company-dashboard/news/types/params";
import {
  createNewsFormSchema,
  NewsFormData,
  getDefaultNewsFormValues,
} from "../schemas/news-form.schema";
import { AddNewsDialogProps, Category, AxiosError } from "../types";
import { CategoryTypes } from "../../categories/enums/Category-types";

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
  const { data: categoriesData } = useQuery({
    queryKey: ["news-categories"],
    queryFn: async () => {
      const response = await CompanyDashboardCategoriesApi.list({
        category_type: CategoryTypes.NEWS_WEBSITE_TYPE,
      });
      return response.data;
    },
    enabled: open,
  });

  // Fetch news data when editing
  const { data: newsData, isLoading: isFetching } = useQuery<ShowNewsResponse>({
    queryKey: ["news", newsId],
    queryFn: async () => {
      const response = await CompanyDashboardNewsApi.show(newsId!);
      return response.data;
    },
    enabled: open && isEditMode,
  });

  const form = useForm({
    resolver: zodResolver(createNewsFormSchema(t, isEditMode)),
    defaultValues: getDefaultNewsFormValues(),
  });

  const {
    control,
    handleSubmit,
    reset,
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

  // Reset form to default values when dialog opens or newsId changes
  useEffect(() => {
    if (open) {
      reset(getDefaultNewsFormValues());
    }
  }, [open, newsId, reset]);

  // Populate form with news data when editing
  useEffect(() => {
    if (isEditMode && newsData?.payload) {
      const news = newsData.payload;
      const categoryId = news.category_id || news.category_website_cms_id;

      reset({
        title_ar: news.title_ar || "",
        title_en: news.title_en || "",
        content_ar: news.content_ar || "",
        content_en: news.content_en || "",
        category_id: categoryId?.toString() || "",
        publish_date: news.publish_date || "",
        end_date: news.end_date || "",
        thumbnail_image: news.thumbnail || null, // Will be set via initialValue in ImageUpload
        main_image: news.main_image || null, // Will be set via initialValue in ImageUpload
      });
    }
  }, [isEditMode, newsData, reset]);

  const onSubmit = async (data: NewsFormData) => {
    try {
      if (isEditMode && newsId) {
        // For update: only include images if they are File objects (new uploads)
        // If they are strings (existing URLs), omit them to keep the previous photos
        const updateParams: UpdateNewsParams = {
          title_ar: data.title_ar,
          title_en: data.title_en,
          content_ar: data.content_ar,
          content_en: data.content_en,
          category_website_cms_id: data.category_id,
          publish_date: data.publish_date,
          end_date: data.end_date,
        };

        // Only include images if they are File objects (new uploads)
        if (data.thumbnail_image instanceof File) {
          updateParams.thumbnail = data.thumbnail_image;
        }
        if (data.main_image instanceof File) {
          updateParams.main_image = data.main_image;
        }

        await CompanyDashboardNewsApi.update(newsId, updateParams);
      } else {
        // For create: images are required
        if (!data.thumbnail_image || !data.main_image) {
          toast.error(t("form.imagesRequired"));
          return;
        }

        const createParams: CreateNewsParams = {
          title_ar: data.title_ar,
          title_en: data.title_en,
          content_ar: data.content_ar,
          content_en: data.content_en,
          category_website_cms_id: data.category_id,
          publish_date: data.publish_date,
          end_date: data.end_date,
          thumbnail:
            data.thumbnail_image instanceof File ? data.thumbnail_image : null,
          main_image: data.main_image instanceof File ? data.main_image : null,
        };

        await CompanyDashboardNewsApi.create(createParams);
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

  // Map categories to match Category interface
  const categories: Category[] =
    categoriesData?.payload?.map((category) => ({
      id: category.id,
      name_ar:
        typeof category.name_ar === "string" ? category.name_ar : undefined,
      name_en:
        typeof category.name_en === "string" ? category.name_en : undefined,
      name: typeof category.name === "string" ? category.name : undefined,
    })) || [];

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
              {/* Right Column - Image Uploads */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="thumbnail_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          label={t("form.thumbnailImage")}
                          maxSize="3MB - الحجم الأقصى"
                          dimensions="2160 × 2160"
                          required={!isEditMode}
                          onChange={(file) => field.onChange(file)}
                          initialValue={
                            typeof field.value === "string"
                              ? field.value
                              : newsData?.payload?.thumbnail
                          }
                          minHeight="100px"
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="main_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          label={t("form.mainImage")}
                          maxSize="3MB - الحجم الأقصى"
                          dimensions="2160 × 2160"
                          required={!isEditMode}
                          onChange={(file) => field.onChange(file)}
                          initialValue={
                            typeof field.value === "string"
                              ? field.value
                              : newsData?.payload?.main_image
                          }
                          minHeight="100px"
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                          dir={isRtl ? "rtl" : "ltr"}
                        >
                          <SelectValue
                            placeholder={t("form.categoryPlaceholder")}
                            className={isRtl ? "text-right" : "text-left"}
                            dir={isRtl ? "rtl" : "ltr"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: Category) => {
                            const displayName = isRtl
                              ? category.name_ar || category.name || ""
                              : category.name_en || category.name || "";
                            return (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                                dir={isRtl ? "rtl" : "ltr"}
                              >
                                {typeof displayName === "string"
                                  ? displayName
                                  : String(displayName || "")}
                              </SelectItem>
                            );
                          })}
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
                        min={new Date().toISOString().split("T")[0]}
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
                    <FormLabel className="text-xs">
                      {t("form.endDate")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        variant="secondary"
                        disabled={isSubmitting || isFetching}
                        className="mt-1"
                        min={new Date().toISOString().split("T")[0]}
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
