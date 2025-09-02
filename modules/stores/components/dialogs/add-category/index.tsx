"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { CategoriesApi } from "@/services/api/ecommerce/categories";
import { CreateCategoryParams } from "@/services/api/ecommerce/categories/types/params";
import { I18nField } from "@/types/common/args/I18nFIeld";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const createCategorySchema = (t: (key: string) => string) =>
  z.object({
    nameAr: z
      .string()
      .min(1, t("category.categoryNameRequired"))
      .min(2, t("category.categoryNameMinLength")),
    nameEn: z.string().optional(),
    descriptionAr: z.string().optional(),
    descriptionEn: z.string().optional(),
  });

type CategoryFormData = z.infer<ReturnType<typeof createCategorySchema>>;

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddCategoryDialog({
  open,
  onClose,
  onSuccess,
}: AddCategoryDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(createCategorySchema(t)),
    defaultValues: {
      nameAr: "",
      nameEn: "",
      descriptionAr: "",
      descriptionEn: "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const name: I18nField = {
        ar: data.nameAr,
        en: data.nameEn || undefined,
      };

      const description: I18nField | undefined =
        data.descriptionAr || data.descriptionEn
          ? {
              ar: data.descriptionAr || "",
              en: data.descriptionEn || undefined,
            }
          : undefined;

      const createParams: CreateCategoryParams = {
        name,
        description,
      };

      await CategoriesApi.create(createParams);

      onSuccess?.();
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating category:", error);
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
            {t("category.addCategory")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Arabic Name */}
            <div className="space-y-2">
              <Label htmlFor="nameAr" className="text-sm text-gray-400">
                {t("category.categoryName")} ({t("labels.arabic")}) *
              </Label>
              <Input
                id="nameAr"
                variant="secondary"
                {...register("nameAr")}
                placeholder="أدخل اسم الفئة"
                disabled={isSubmitting}
                dir="rtl"
              />
              {errors.nameAr && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nameAr.message}
                </p>
              )}
            </div>

            {/* English Name */}
            <div className="space-y-2">
              <Label htmlFor="nameEn" className="text-sm text-gray-400">
                {t("category.categoryName")} ({t("labels.english")})
              </Label>
              <Input
                id="nameEn"
                variant="secondary"
                {...register("nameEn")}
                placeholder="Enter category name"
                disabled={isSubmitting}
                dir="ltr"
              />
            </div>

            {/* Arabic Description */}
            <div className="space-y-2">
              <Label htmlFor="descriptionAr" className="text-sm text-gray-400">
                {t("category.categoryDescription")} ({t("labels.arabic")})
              </Label>
              <Textarea
                id="descriptionAr"
                {...register("descriptionAr")}
                placeholder="أدخل وصف الفئة"
                disabled={isSubmitting}
                dir="rtl"
                className="bg-sidebar border-gray-600 text-white resize-none"
                rows={3}
              />
            </div>

            {/* English Description */}
            <div className="space-y-2">
              <Label htmlFor="descriptionEn" className="text-sm text-gray-400">
                {t("category.categoryDescription")} ({t("labels.english")})
              </Label>
              <Textarea
                id="descriptionEn"
                {...register("descriptionEn")}
                placeholder="Enter category description"
                disabled={isSubmitting}
                dir="ltr"
                className="bg-sidebar border-gray-600 text-white resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              {t("category.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  {t("category.saving")}
                </span>
              ) : (
                t("category.save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
