"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { BrandsApi } from "@/services/api/ecommerce/brands";
import { CreateBrandParams } from "@/services/api/ecommerce/brands/types/params";

const createBrandSchema = (t: (key: string) => string) =>
  z.object({
    name_ar: z
      .string()
      .min(1, t("brand.brandNameRequired"))
      .min(2, t("brand.brandNameMinLength")),
    name_en: z.string().optional(),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),
  });

type BrandFormData = z.infer<ReturnType<typeof createBrandSchema>>;

interface AddBrandDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddBrandDialog({
  open,
  onClose,
  onSuccess,
}: AddBrandDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    resolver: zodResolver(createBrandSchema(t)),
    defaultValues: {
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
    },
  });

  const onSubmit = async (data: BrandFormData) => {
    try {
      const createParams: CreateBrandParams = {
        name: {
          ar: data.name_ar,
          en: data.name_en || "",
        },
        description: {
          ar: data.description_ar || "",
          en: data.description_en || "",
        },
      };

      await BrandsApi.create(createParams);

      onSuccess?.();
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating brand:", error);
      // You might want to add toast notification here
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
            {t("brand.addBrand")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Arabic Name */}
            <div>
              <Label htmlFor="name_ar" className="text-sm text-gray-400">
                {t("brand.brandName")} ({t("labels.arabic")})
              </Label>
              <Input
                id="name_ar"
                variant="secondary"
                {...register("name_ar")}
                placeholder="اسم العلامة التجارية"
                disabled={isSubmitting}
              />
              {errors.name_ar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name_ar.message}
                </p>
              )}
            </div>

            {/* English Name */}
            <div>
              <Label htmlFor="name_en" className="text-sm text-gray-400">
                {t("brand.brandName")} ({t("labels.english")})
              </Label>
              <Input
                id="name_en"
                variant="secondary"
                {...register("name_en")}
                placeholder="Brand Name"
                disabled={isSubmitting}
              />
              {errors.name_en && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name_en.message}
                </p>
              )}
            </div>

            {/* Arabic Description */}
            <div>
              <Label htmlFor="description_ar" className="text-sm text-gray-400">
                {t("labels.description")} ({t("labels.arabic")})
              </Label>
              <Textarea
                id="description_ar"
                {...register("description_ar")}
                placeholder="وصف العلامة التجارية"
                disabled={isSubmitting}
                rows={3}
              />
              {errors.description_ar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description_ar.message}
                </p>
              )}
            </div>

            {/* English Description */}
            <div>
              <Label htmlFor="description_en" className="text-sm text-gray-400">
                {t("labels.description")} ({t("labels.english")})
              </Label>
              <Textarea
                id="description_en"
                {...register("description_en")}
                placeholder="Brand Description"
                disabled={isSubmitting}
                rows={3}
              />
              {errors.description_en && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description_en.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("labels.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
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
