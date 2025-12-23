"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Controller } from "react-hook-form";
import ImageUpload from "@/components/shared/ImageUpload";
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
  }, [isEditMode, newsData, open, reset]);

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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      dir={isRtl ? "rtl" : "ltr"}
    >
      <DialogTitle
        sx={{ textAlign: "center", fontSize: "1.125rem", fontWeight: 600 }}
      >
        {isEditMode ? t("editNews") : t("addNews")}
      </DialogTitle>

      <DialogContent sx={{ maxHeight: "90vh", overflow: "auto" }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* Title Fields and Image Uploads Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Right Column - Image Uploads */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Controller
                    control={control}
                    name="thumbnail_image"
                    render={({ field, fieldState }) => (
                      <Box>
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
                        {fieldState.error && (
                          <FormHelperText error>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    control={control}
                    name="main_image"
                    render={({ field, fieldState }) => (
                      <Box>
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
                        {fieldState.error && (
                          <FormHelperText error>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Left Column - Title Fields */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Controller
                  control={control}
                  name="title_ar"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={t("form.titleAr")}
                      required
                      disabled={isSubmitting || isFetching}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      size="small"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="title_en"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={t("form.titleEn")}
                      required
                      disabled={isSubmitting || isFetching}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={12}>
              <Controller
                control={control}
                name="category_id"
                render={({ field, fieldState }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                  >
                    <InputLabel required>{t("form.category")}</InputLabel>
                    <Select
                      {...field}
                      label={t("form.category")}
                      disabled={isSubmitting || isFetching}
                    >
                      {categories.map((category: Category) => {
                        const displayName = isRtl
                          ? category.name_ar || category.name || ""
                          : category.name_en || category.name || "";
                        return (
                          <MenuItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {typeof displayName === "string"
                              ? displayName
                              : String(displayName || "")}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          {/* Dates Row */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                control={control}
                name="publish_date"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="date"
                    label={t("form.publishDate")}
                    required
                    disabled={isSubmitting || isFetching}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                control={control}
                name="end_date"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="date"
                    label={t("form.endDate")}
                    required
                    disabled={isSubmitting || isFetching}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Content Fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <Controller
              control={control}
              name="content_ar"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t("form.contentAr")}
                  required
                  multiline
                  rows={6}
                  disabled={isSubmitting || isFetching}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="content_en"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t("form.contentEn")}
                  required
                  multiline
                  rows={6}
                  disabled={isSubmitting || isFetching}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || isFetching}
          fullWidth
          onClick={handleSubmit(onSubmit)}
          startIcon={
            (isSubmitting || isFetching) && <CircularProgress size={16} />
          }
        >
          {t("form.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
