"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormLabel from "@/components/shared/FormLabel";
import LanguageTabs from "@/components/shared/LanguageTabs";
import { Loader2 } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import ImageUpload from "@/components/shared/ImageUpload";
import { FlashDealsApi } from "@/services/api/ecommerce/flash-deals";

const createOfferSchema = (t: (key: string) => string) =>
  z.object({
    name: z.object({
      ar: z.string().min(1, "عنوان العرض بالعربية مطلوب"),
      en: z.string().min(1, "عنوان العرض بالإنجليزية مطلوب"),
    }),
    start_date: z
      .string()
      .min(1, "تاريخ البدء مطلوب")
      .refine(
        (date) => {
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        { message: "تاريخ البدء يجب أن يكون اليوم أو بعده" }
      ),
    end_date: z.string().min(1, "تاريخ انتهاء العرض مطلوب"),
  });

type OfferFormData = z.infer<ReturnType<typeof createOfferSchema>>;

interface OfferDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  offerId?: string;
}

export default function OfferDialog({
  open,
  onClose,
  onSuccess,
  offerId,
}: OfferDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!offerId;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OfferFormData>({
    resolver: zodResolver(createOfferSchema(t)),
    defaultValues: {
      name: {
        ar: "",
        en: "",
      },
      start_date: "",
      end_date: "",
    },
  });

  // Fetch offer data for edit mode
  const { data: offerData, isLoading: isFetchingOffer } = useQuery({
    queryKey: ["flash-deal", offerId],
    queryFn: () => FlashDealsApi.show(offerId!),
    enabled: !!offerId && open,
  });

  // Populate form when editing
  useEffect(() => {
    if (offerData?.data?.payload) {
      const offer = offerData.data.payload;
      reset({
        name: {
          ar: offer.name?.ar || offer.title_ar || offer.title || "",
          en: offer.name?.en || offer.title_en || "",
        },
        start_date: offer.start_date || "",
        end_date: offer.end_date || "",
      });
    }
  }, [offerData, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: OfferFormData) =>
      FlashDealsApi.create({ ...data, image: imageFile }),
    onSuccess: () => {
      toast.success(t("offer.createSuccess"));
      onSuccess?.();
      reset();
      setImageFile(null);
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("offer.createError"));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: OfferFormData) =>
      FlashDealsApi.update(offerId!, { ...data, image: imageFile }),
    onSuccess: () => {
      toast.success(t("offer.updateSuccess"));
      onSuccess?.();
      reset();
      setImageFile(null);
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("offer.updateError"));
    },
  });

  const onSubmit = async (data: OfferFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    const isMutating = createMutation.isPending || updateMutation.isPending;
    if (!isMutating) {
      reset();
      setImageFile(null);
      onClose();
    }
  };

  const isLoading =
    isFetchingOffer || createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && handleClose()}>
      <DialogContent
        className={`max-w-4xl w-full bg-sidebar border-gray-700 ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? t("offer.edit") : t("offer.add")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Right side - Image Upload */}
            <div>
              <ImageUpload
                label="صورة العرض"
                maxSize="3MB - الحجم الأقصى"
                dimensions="2160 × 2160"
                required={false}
                onChange={(file) => setImageFile(file)}
                value={imageFile}
                minHeight="200px"
              />
            </div>
            {/* Left side - Form Fields */}
            <div className="space-y-4">
              <LanguageTabs
                activeTab={activeTab}
                onTabChange={(value) => setActiveTab(value as "ar" | "en")}
                arabicContent={
                  <div>
                    <FormLabel htmlFor="name.ar" required>
                      {t("offer.title")}
                    </FormLabel>
                    <Input
                      id="name.ar"
                      placeholder={t("offer.title")}
                      variant="secondary"
                      className="bg-sidebar border-white text-white h-12"
                      {...register("name.ar")}
                      disabled={isLoading}
                    />
                    {errors.name?.ar && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.ar.message}
                      </p>
                    )}
                  </div>
                }
                englishContent={
                  <div>
                    <FormLabel htmlFor="name.en" required>
                      {t("offer.title")}
                    </FormLabel>
                    <Input
                      id="name.en"
                      placeholder={t("offer.title")}
                      variant="secondary"
                      className="bg-sidebar border-white text-white h-12"
                      {...register("name.en")}
                      disabled={isLoading}
                    />
                    {errors.name?.en && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.en.message}
                      </p>
                    )}
                  </div>
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="start_date" required>
                    {t("offer.startDate")}
                  </FormLabel>
                  <Input
                    id="start_date"
                    type="date"
                    variant="secondary"
                    {...register("start_date")}
                    disabled={isLoading}
                    className="bg-sidebar border-white text-white h-12"
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.start_date.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormLabel htmlFor="end_date" required>
                    {t("offer.endDate")}
                  </FormLabel>
                  <Input
                    id="end_date"
                    type="date"
                    variant="secondary"
                    {...register("end_date")}
                    disabled={isLoading}
                    className="bg-sidebar border-white text-white h-12"
                  />
                  {errors.end_date && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.end_date.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              variant="outline"
              className="px-12 py-2 bg-transparent border border-gray-600 text-white hover:bg-gray-800"
            >
              {t("offer.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-12 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("offer.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
