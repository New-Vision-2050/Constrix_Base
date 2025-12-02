"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
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
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import FileUploadButton from "@/components/shared/FileUploadButton";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  createMainSettingsFormSchema,
  MainSettingsFormData,
  getDefaultMainSettingsFormValues,
  mapApiResponseToFormData,
} from "../schema/main-settings-form.schema";
import { CompanyDashboardHomepageSettingsApi } from "@/services/api/company-dashboard/homepage-settings";
import { GetCurrentHomepageSettingsResponse } from "@/services/api/company-dashboard/homepage-settings/types/response";

// Homepage icons options
const HOMEPAGE_ICONS_OPTIONS = [
  { value: "companies", label: "الشركات" },
  { value: "accreditations", label: "الاعتمادات" },
  { value: "certificates", label: "الشهادات" },
];

export default function MainSettingsForm() {
  const t = useTranslations("content-management-system.mainSettings.form");

  // Fetch current settings using react-query
  const { data: settingsData, isLoading: isFetching } =
    useQuery<GetCurrentHomepageSettingsResponse>({
      queryKey: ["homepage-settings", "current"],
      queryFn: async () => {
        const response = await CompanyDashboardHomepageSettingsApi.getCurrent();
        return response.data;
      },
      retry: false,
    });

  const form = useForm<MainSettingsFormData>({
    resolver: zodResolver(createMainSettingsFormSchema(t)),
    defaultValues: getDefaultMainSettingsFormValues(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Populate form with settings data when fetched
  useEffect(() => {
    if (settingsData?.payload) {
      const formData = mapApiResponseToFormData(settingsData.payload);
      reset(formData);
    }
  }, [settingsData, reset]);

  // Show toast for validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);

  const onSubmit = async (data: MainSettingsFormData) => {
    try {
      const payload: {
        web_video_link?: string | null;
        web_video_file?: File;
        mobile_video_link?: string | null;
        mobile_video_file?: File;
        video_profile_file?: File;
        description_ar?: string | null;
        description_en?: string | null;
        is_companies?: 0 | 1;
        is_approvals?: 0 | 1;
        is_certificates?: 0 | 1;
      } = {
        web_video_link: data.web_video_link || null,
        mobile_video_link: data.mobile_video_link || null,
        description_ar: data.description_ar || null,
        description_en: data.description_en || null,
        is_companies: (data.is_companies === 1 ? 1 : 0) as 0 | 1,
        is_approvals: (data.is_approvals === 1 ? 1 : 0) as 0 | 1,
        is_certificates: (data.is_certificates === 1 ? 1 : 0) as 0 | 1,
      };

      // Only include file fields if they are File objects
      if (data.web_video_file instanceof File) {
        payload.web_video_file = data.web_video_file;
      }
      if (data.mobile_video_file instanceof File) {
        payload.mobile_video_file = data.mobile_video_file;
      }
      if (data.video_profile_file instanceof File) {
        payload.video_profile_file = data.video_profile_file;
      }

      await CompanyDashboardHomepageSettingsApi.updateCurrent(payload);
      toast.success(t("updateSuccess") || "Settings updated successfully!");

      // Refresh data after successful update
      const response = await CompanyDashboardHomepageSettingsApi.getCurrent();
      if (response.data?.payload) {
        const formData = mapApiResponseToFormData(response.data.payload);
        reset(formData);
      }
    } catch (error: unknown) {
      console.error("Error updating settings:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (
          error as {
            response?: {
              status?: number;
              data?: { errors?: Record<string, string[]> };
            };
          }
        ).response?.status === "number" &&
        (error as { response: { status: number } }).response.status === 422
      ) {
        const validationErrors = (
          error as {
            response?: { data?: { errors?: Record<string, string[]> } };
          }
        ).response?.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage || t("validationError"));
          return;
        }
      }

      toast.error(
        t("updateError") || "Failed to update settings. Please try again."
      );
    }
  };

  if (isFetching) {
    return (
      <div className="px-6 py-4 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Section */}
          <div className="bg-sidebar rounded-lg p-6 space-y-6 border-b border-gray-700 pb-6">
            <h2 className="text-lg font-semibold text-white">
              {t("mainSection") || "القسم الرئيسي"}
            </h2>

            <div className="space-y-2">
              <FormLabel className="text-xs">
                {t("videoLinkWeb") || "رابط الفيديو (الوضع الافتراضي الويب)"}
              </FormLabel>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                {/* 80% width - Web Video Link */}
                <div className="lg:col-span-4">
                  <FormField
                    control={control}
                    name="web_video_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            variant="secondary"
                            disabled={isSubmitting || isFetching}
                            className="mt-1"
                            placeholder={
                              t("videoLinkWebPlaceholder") || "Enter video URL"
                            }
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* 20% width - File Upload */}
                <div className="lg:col-span-1 flex items-center gap-2">
                  <p className="text-xs text-gray-400">
                    {t("canAttachVideoInstead") ||
                      "يمكن أرفاق فيديو بدلا من استخدام الرابط"}
                  </p>
                  <FormField
                    control={control}
                    name="web_video_file"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploadButton
                            onChange={(file) => field.onChange(file)}
                            accept="video/mp4,video/webm,video/ogg"
                            maxSize="100MB"
                            initialValue={field.value}
                            disabled={isSubmitting || isFetching}
                            className="mt-1"
                          />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Video Link */}
            <div className="space-y-2">
              <FormLabel className="text-xs">
                {t("videoLinkMobile") || "رابط الفيديو (وضع الجوال)"}
              </FormLabel>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                {/* 80% width - Mobile Video Link */}
                <div className="lg:col-span-4">
                  <FormField
                    control={control}
                    name="mobile_video_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            variant="secondary"
                            disabled={isSubmitting || isFetching}
                            className="mt-1"
                            placeholder={
                              t("videoLinkMobilePlaceholder") ||
                              "Enter video URL"
                            }
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* 20% width - File Upload */}
                <div className="lg:col-span-1 flex items-center gap-2">
                  <p className="text-xs text-gray-400">
                    {t("canAttachVideoInstead") ||
                      "يمكن أرفاق فيديو بدلا من استخدام الرابط"}
                  </p>
                  <FormField
                    control={control}
                    name="mobile_video_file"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploadButton
                            onChange={(file) => field.onChange(file)}
                            accept="video/mp4,video/webm,video/ogg"
                            maxSize="100MB"
                            initialValue={field.value}
                            disabled={isSubmitting || isFetching}
                            className="mt-1"
                          />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Description Arabic */}
            <FormField
              control={control}
              name="description_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs" required>
                    {t("descriptionAr") ||
                      "وصف الشريحة الرئيسية عربي (زر المزيد)"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting || isFetching}
                      rows={6}
                      className="mt-1 resize-none bg-sidebar border-white text-white"
                      placeholder={
                        t("descriptionArPlaceholder") || "Enter description"
                      }
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
                    {t("descriptionEn") ||
                      "وصف الشريحة الرئيسية الانجليزية (زر المزيد)"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting || isFetching}
                      rows={6}
                      className="mt-1 resize-none bg-sidebar border-white text-white"
                      placeholder={
                        t("descriptionEnPlaceholder") || "Enter description"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Page Sections */}
          <div className="bg-sidebar rounded-lg p-6 space-y-6 border-b border-gray-700 pb-6">
            <h2 className="text-lg font-semibold text-white">
              {t("pageSections") || "اقسام الصفحة"}
            </h2>

            {/* Homepage Sections */}
            <div className="space-y-4">
              <FormLabel className="text-2xs pt-2">
                {t("homepageIcons") || "أيقونات الصفحة الرئيسية"}
              </FormLabel>
              <div className="flex flex-wrap gap-4 mt-2">
                {/* Companies Section */}
                <FormField
                  control={control}
                  name="is_companies"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value === 1}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? 1 : 0);
                            }}
                            className="h-5 w-5 rounded border-2 border-gray-400 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 data-[state=checked]:text-white"
                          />
                          <span className="text-sm font-medium select-none transition-colors">
                            {
                              HOMEPAGE_ICONS_OPTIONS.find(
                                (o) => o.value === "companies"
                              )?.label
                            }
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Approvals Section */}
                <FormField
                  control={control}
                  name="is_approvals"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value === 1}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? 1 : 0);
                            }}
                            className="h-5 w-5 rounded border-2 border-gray-400 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 data-[state=checked]:text-white"
                          />
                          <span className="text-sm font-medium select-none transition-colors">
                            {
                              HOMEPAGE_ICONS_OPTIONS.find(
                                (o) => o.value === "accreditations"
                              )?.label
                            }
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Certificates Section */}
                <FormField
                  control={control}
                  name="is_certificates"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value === 1}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? 1 : 0);
                            }}
                            className="h-5 w-5 rounded border-2 border-gray-400 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 data-[state=checked]:text-white"
                          />
                          <span className="text-sm font-medium select-none transition-colors">
                            {
                              HOMEPAGE_ICONS_OPTIONS.find(
                                (o) => o.value === "certificates"
                              )?.label
                            }
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Company Profile File */}
            <div className="space-y-2">
              <FormLabel className="text-xs">
                {t("companyProfile") || "الملف التعريفي للشركة"}
              </FormLabel>
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name="video_profile_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploadButton
                          onChange={(file) => field.onChange(file)}
                          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          maxSize="100MB"
                          initialValue={field.value}
                          disabled={isSubmitting || isFetching}
                          className="mt-1"
                        />
                      </FormControl>
                      <FormErrorMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isFetching}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            >
              {(isSubmitting || isFetching) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("saveChanges") || "حفظ التعديل"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
