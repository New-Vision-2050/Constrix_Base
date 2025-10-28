"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "@/modules/table/components/ui/input";
import FormLabel from "@/components/shared/FormLabel";
import { Loader2 } from "lucide-react";
import ImageUpload from "@/components/shared/ImageUpload";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { toast } from "sonner";
import { apiClient } from "@/config/axios-config";

const createPageSchema = (t: (key: string) => string) =>
  z.object({
    type: z.string().optional(),
    url: z
      .string()
      .optional()
      .refine((val) => !val || val === "" || /^https?:\/\/.+/.test(val), {
        message: "يجب أن يكون الرابط صحيح",
      }),
    banner_image: z.any().optional(),
    title: z
      .string()
      .min(1, { message: t("pagesSettings.validation.titleRequired") }),
    description: z
      .string()
      .min(1, { message: t("pagesSettings.validation.descriptionRequired") }),
  });

type PageFormData = z.infer<ReturnType<typeof createPageSchema>>;

interface DiscountsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  pageId?: string;
}

export function DiscountsDialog({
  open,
  onClose,
  onSuccess,
  pageId,
}: DiscountsDialogProps) {
  const t = useTranslations();
  const isEditMode = !!pageId;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: pageData, isLoading: isFetching } = useQuery({
    queryKey: ["banner", pageId],
    queryFn: () => apiClient.get(`/ecommerce/dashboard/banners/${pageId}`),
    enabled: isEditMode && open,
  });

  const form = useForm<PageFormData>({
    resolver: zodResolver(createPageSchema(t)),
    defaultValues: { type: "discount", url: "", title: "", description: "" },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);

  useEffect(() => {
    if (!open) {
      reset({ type: "discount", url: "", title: "", description: "" });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [open, reset]);

  useEffect(() => {
    if (isEditMode && pageData?.data?.payload && open) {
      const banner = pageData.data.payload;
      reset({
        type: "discount",
        url: banner.url || "",
        title: banner.title || "",
        description: banner.description || "",
      });
      if (banner.banner_image) {
        setImagePreview(banner.banner_image);
      }
    }
  }, [isEditMode, pageData, open, reset]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: PageFormData) => {
    try {
      const formData = new FormData();
      formData.append("type", "discount");
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.url) formData.append("url", data.url);
      if (imageFile) formData.append("banner_image", imageFile);

      const url =
        isEditMode && pageId
          ? `/ecommerce/dashboard/banners/${pageId}`
          : "/ecommerce/dashboard/banners";
      await apiClient.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        t(`pagesSettings.messages.${isEditMode ? "update" : "create"}Success`)
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors;
      if (error?.response?.status === 422 && validationErrors) {
        const firstError = Object.values(validationErrors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          toast.error(firstError[0] as string);
        }
        return;
      }

      toast.error(
        t(`pagesSettings.messages.${isEditMode ? "update" : "create"}Error`)
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
      <DialogContent className="max-w-4xl w-full bg-sidebar border-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {t(`pagesSettings.actions.${isEditMode ? "edit" : "add"}Banner`)}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-1">
              <ImageUpload
                label={t("pagesSettings.fields.bannerImage")}
                maxSize="3MB - الحجم الأقصى"
                dimensions="2160 × 2160"
                onChange={handleImageChange}
                initialValue={imagePreview}
                minHeight="180px"
              />
            </div>

            <div className="col-span-1">
              <div className="space-y-4">
                <div>
                  <FormLabel required>
                    {t("pagesSettings.fields.bannerTitle")}
                  </FormLabel>
                  <Input
                    {...form.register("title")}
                    className="bg-sidebar text-white"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <FormLabel>{t("pagesSettings.fields.bannerUrl")}</FormLabel>
                  <Input
                    {...form.register("url")}
                    disabled={isSubmitting || isFetching}
                    className="bg-sidebar text-white"
                  />
                  {errors.url && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.url.message}
                    </p>
                  )}
                </div>
                <div>
                  <FormLabel required>
                    {t("pagesSettings.fields.bannerDescription")}
                  </FormLabel>
                  <Textarea
                    {...form.register("description")}
                    className="bg-sidebar text-white min-h-[100px]"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isFetching}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
          >
            {(isSubmitting || isFetching) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t(
              `pagesSettings.actions.${
                isSubmitting || isFetching ? "saving" : "save"
              }`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
