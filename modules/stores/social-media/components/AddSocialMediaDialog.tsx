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
import { SocialMediaApi } from "@/services/api/ecommerce/social-media";
import { toast } from "sonner";
import {
  CreateSocialMediaParams,
  UpdateSocialMediaParams,
} from "@/services/api/ecommerce/social-media/types/params";

const createSocialMediaSchema = (t: (key: string) => string) =>
  z.object({
    platform: z.string().min(1, t("socialMedia.platformRequired")),
    link: z.string().min(1, t("socialMedia.linkRequired")),
  });

type SocialMediaFormData = z.infer<
  ReturnType<typeof createSocialMediaSchema>
>;

interface AddSocialMediaDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  socialMediaId?: string;
}

export default function AddSocialMediaDialog({
  open,
  onClose,
  onSuccess,
  socialMediaId,
}: AddSocialMediaDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!socialMediaId;

  // Fetch social media data when editing
  const { data: socialMediaData, isLoading: isFetching } = useQuery({
    queryKey: ["social-media", socialMediaId],
    queryFn: () => SocialMediaApi.show(socialMediaId!),
    enabled: isEditMode && open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SocialMediaFormData>({
    resolver: zodResolver(createSocialMediaSchema(t)),
    defaultValues: {
      platform: "",
      link: "",
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

  // Populate form with social media data when editing
  useEffect(() => {
    if (isEditMode && socialMediaData?.data?.payload) {
      const socialMedia = socialMediaData.data.payload;

      setValue("platform", socialMedia.platform || "");
      setValue("link", socialMedia.link || "");
    }
  }, [isEditMode, socialMediaData, setValue]);

  const platforms = [
    { value: "facebook", label_ar: "فيسبوك", label_en: "Facebook" },
    { value: "instagram", label_ar: "إنستغرام", label_en: "Instagram" },
    { value: "twitter", label_ar: "تويتر", label_en: "Twitter" },
    { value: "linkedin", label_ar: "لينكد إن", label_en: "LinkedIn" },
    { value: "youtube", label_ar: "يوتيوب", label_en: "YouTube" },
    { value: "tiktok", label_ar: "تيك توك", label_en: "TikTok" },
    { value: "snapchat", label_ar: "سناب شات", label_en: "Snapchat" },
    { value: "whatsapp", label_ar: "واتساب", label_en: "WhatsApp" },
  ];

  const onSubmit = async (data: SocialMediaFormData) => {
    try {
      if (isEditMode && socialMediaId) {
        // Update existing social media
        const updateParams: any = {
          platform: data.platform,
          link: data.link,
        };

        await SocialMediaApi.update(socialMediaId, updateParams);
      } else {
        // Create new social media
        const createParams: any = {
          platform: data.platform,
          link: data.link,
        };

        await SocialMediaApi.create(createParams);
      }

      toast.success(
        isEditMode
          ? t("socialMedia.updateSuccess")
          : t("socialMedia.createSuccess")
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} social media:`,
        error
      );

      // Handle 422 validation errors from server
      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage);
          return;
        }
      }

      toast.error(
        isEditMode
          ? t("socialMedia.updateError")
          : t("socialMedia.createError")
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
              ? t("socialMedia.edit")
              : t("socialMedia.create")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Platform */}
            <div>
              <Label htmlFor="platform" className="text-xs">
                {t("socialMedia.platform")} *
              </Label>
              <Select
                value={watch("platform")}
                onValueChange={(value) => setValue("platform", value)}
                disabled={isSubmitting || isFetching}
              >
                <SelectTrigger className="mt-1 bg-gray-900 border-gray-700 text-white">
                  <SelectValue
                    placeholder={t("socialMedia.selectPlatform")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {isRtl ? platform.label_ar : platform.label_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.platform && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.platform.message}
                </p>
              )}
            </div>

            {/* Link */}
            <div>
              <Label htmlFor="link" className="text-xs">
                {t("socialMedia.link")} *
              </Label>
              <Input
                id="link"
                variant="secondary"
                {...register("link")}
                disabled={isSubmitting || isFetching}
                placeholder="example.com"
                className="mt-1"
              />
              {errors.link && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.link.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isFetching}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {t("labels.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isFetching}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            >
              {(isSubmitting || isFetching) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("labels.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
