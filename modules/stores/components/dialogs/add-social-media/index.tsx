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
import FormLabel from "@/components/shared/FormLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { SocialMediaApi } from "@/services/api/ecommerce/social-media";
import { toast } from "sonner";
import {
  CreateSocialMediaParams,
  UpdateSocialMediaParams,
} from "@/services/api/ecommerce/social-media/types/params";

const createSocialMediaSchema = (t: (key: string) => string) =>
  z.object({
    social_icons_id: z.string().min(1, t("socialMedia.platformRequired")),
    url: z.string().min(1, t("socialMedia.linkRequired")),
  });

type SocialMediaFormData = z.infer<ReturnType<typeof createSocialMediaSchema>>;

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

  // Fetch available social icons/platforms
  const { data: platformsData, isLoading: isLoadingPlatforms } = useQuery({
    queryKey: ["social-icons-list"],
    queryFn: () => SocialMediaApi.list(),
    enabled: open,
  });

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
      social_icons_id: "",
      url: "",
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

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      reset({
        social_icons_id: "",
        url: "",
      });
    }
  }, [open, reset]);

  // Populate form with social media data when editing
  useEffect(() => {
    if (isEditMode && socialMediaData?.data?.payload && open) {
      const socialMedia = socialMediaData.data.payload;

      reset({
        social_icons_id: socialMedia.social_icons_id || "",
        url: socialMedia.url || "",
      });
    }
  }, [isEditMode, socialMediaData, open, reset]);

  // Get platforms from API response (these are social icons)
  const platforms: any[] = platformsData?.data?.payload || [];

  const onSubmit = async (data: SocialMediaFormData) => {
    try {
      if (isEditMode && socialMediaId) {
        // Update existing social media
        const updateParams: UpdateSocialMediaParams = {
          social_icons_id: data.social_icons_id,
          url: data.url,
        };

        await SocialMediaApi.update(socialMediaId, updateParams);
      } else {
        // Create new social media
        const createParams: CreateSocialMediaParams = {
          social_icons_id: data.social_icons_id,
          url: data.url,
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
        isEditMode ? t("socialMedia.updateError") : t("socialMedia.createError")
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
            {isEditMode ? t("socialMedia.edit") : t("socialMedia.create")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Platform */}
            <div>
              <FormLabel required className="text-xs">
                {t("socialMedia.platform")}
              </FormLabel>
              <div className="relative">
                <Select
                  value={watch("social_icons_id")}
                  onValueChange={(value) => setValue("social_icons_id", value)}
                  disabled={isSubmitting || isFetching || isLoadingPlatforms}
                >
                  <SelectTrigger className="mt-1 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder={t("socialMedia.selectPlatform")} />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              {errors.social_icons_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.social_icons_id.message}
                </p>
              )}
              </div>
            </div>

            {/* Link */}
            <div>
              <FormLabel required className="text-xs">
                {t("socialMedia.link")}
              </FormLabel>
              <Input
                id="url"
                variant="secondary"
                {...register("url")}
                disabled={isSubmitting || isFetching}
                placeholder="https://example.com"
                className="mt-1"
              />
              {errors.url && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.url.message}
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
