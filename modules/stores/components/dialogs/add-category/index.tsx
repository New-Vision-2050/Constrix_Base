"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { CategoriesApi } from "@/services/api/ecommerce/categories";
import { CreateCategoryParams } from "@/services/api/ecommerce/categories/types/params";

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
    name: z
      .string()
      .min(1, t("category.categoryNameRequired"))
      .min(2, t("category.categoryNameMinLength")),
    description: z.string().optional(),
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
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const createParams: CreateCategoryParams = {
        name: data.name,
        description: data.description || undefined,
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
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-400">
                {t("category.categoryName")} *
              </Label>
              <Input
                id="name"
                variant="secondary"
                {...register("name")}
                placeholder={t("category.categoryNamePlaceholder") ?? ""}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm text-gray-400">
                {t("category.categoryDescription")}
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder={t("category.categoryDescriptionPlaceholder") ?? ""}
                disabled={isSubmitting}
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
