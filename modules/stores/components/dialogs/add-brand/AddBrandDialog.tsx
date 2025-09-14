"use client";

import React, { useEffect } from "react";
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
import { Textarea } from "@/modules/table/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { BrandsApi } from "@/services/api/ecommerce/brands";
import {
  CreateBrandParams,
  UpdateBrandParams,
} from "@/services/api/ecommerce/brands/types/params";

const createBrandSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("brand.brandNameRequired"))
      .min(2, t("brand.brandNameMinLength")),
    description: z.string().optional(),
  });

type BrandFormData = z.infer<ReturnType<typeof createBrandSchema>>;

interface AddBrandDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  brandId?: string; // Add brandId for edit mode
}

export default function AddBrandDialog({
  open,
  onClose,
  onSuccess,
  brandId,
}: AddBrandDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!brandId;

  // Fetch brand data when editing
  const { data: brandData, isLoading: isFetching } = useQuery({
    queryKey: ["brand", brandId],
    queryFn: () => BrandsApi.show(brandId!),
    enabled: isEditMode && open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    resolver: zodResolver(createBrandSchema(t)),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Populate form with brand data when editing
  useEffect(() => {
    if (isEditMode && brandData?.data?.payload) {
      const brand = brandData.data.payload;

      setValue("name", brand.name || "");
      setValue("description", brand.description || "");
    }
  }, [isEditMode, brandData, setValue]);

  const onSubmit = async (data: BrandFormData) => {
    try {
      if (isEditMode && brandId) {
        // Update existing brand
        const updateParams: UpdateBrandParams = {
          name: data.name,
          description: data.description || "",
        };

        await BrandsApi.update(brandId, updateParams);
      } else {
        // Create new brand
        const createParams: CreateBrandParams = {
          name: data.name,
          description: data.description || "",
        };

        await BrandsApi.create(createParams);
      }

      onSuccess?.();
      reset();
      onClose();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} brand:`,
        error
      );
      // You might want to add toast notification here
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
            {isEditMode ? t("brand.editBrand") : t("brand.addBrand")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Brand Name */}
            <div>
              <Label htmlFor="name" className="text-sm text-gray-400">
                {t("brand.brandName")}
              </Label>
              <Input
                id="name"
                variant="secondary"
                {...register("name")}
                placeholder={t("brand.brandName")}
                disabled={isSubmitting || isFetching}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm text-gray-400">
                {t("labels.description")}
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder={t("labels.description")}
                disabled={isSubmitting || isFetching}
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isFetching}
            >
              {t("labels.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || isFetching}>
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
