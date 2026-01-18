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
import { Input } from "@/modules/table/components/ui/input";
import FormLabel from "@/components/shared/FormLabel";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { toast } from "sonner";
import { apiClient } from "@/config/axios-config";

const createFeatureSchema = (t: (key: string) => string) =>
  z.object({
    type: z.string().optional(),
    title: z.string().min(1, { message: "العنوان مطلوب" }),
    description: z.string().min(1, { message: "الوصف مطلوب" }),
  });

type FeatureFormData = z.infer<ReturnType<typeof createFeatureSchema>>;

interface NewFeatureDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  featureId?: string;
}

export function NewFeatureDialog({
  open,
  onClose,
  onSuccess,
  featureId,
}: NewFeatureDialogProps) {
  const t = useTranslations();
  const isEditMode = !!featureId;

  const { data: featureData, isLoading: isFetching } = useQuery({
    queryKey: ["feature", featureId],
    queryFn: () => apiClient.get(`/ecommerce/dashboard/features/${featureId}`),
    enabled: isEditMode && open,
  });

  const form = useForm<FeatureFormData>({
    resolver: zodResolver(createFeatureSchema(t)),
    defaultValues: {
      type: "contact_us",
      title: "",
      description: "",
    },
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
      reset({
        type: "contact_us",
        title: "",
        description: "",
      });
    }
  }, [open, reset]);

  useEffect(() => {
    if (isEditMode && featureData?.data?.payload && open) {
      const feature = featureData.data.payload;
      reset({
        type: feature.type || "contact_us",
        title: feature.title || "",
        description: feature.description || "",
      });
    }
  }, [isEditMode, featureData, open, reset]);

  const onSubmit = async (data: FeatureFormData) => {
    try {
      const payload = {
        type: "contact_us",
        title: data.title,
        description: data.description,
      };

      const url =
        isEditMode && featureId
          ? `/ecommerce/dashboard/features/${featureId}`
          : "/ecommerce/dashboard/features";

      await apiClient.post(url, payload);

      toast.success(
        isEditMode ? "تم تحديث الميزة بنجاح" : "تم إنشاء الميزة بنجاح"
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

      toast.error(isEditMode ? "فشل في تحديث الميزة" : "فشل في إنشاء الميزة");
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
      <DialogContent className="max-w-2xl w-full bg-sidebar border-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? "تعديل ميزة" : "اضافة ميزة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <FormLabel required>العنوان</FormLabel>
            <Input
              {...form.register("title")}
              className="bg-sidebar text-white"
              placeholder="عنوان الميزة"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <FormLabel required>الوصف</FormLabel>
            <Textarea
              {...form.register("description")}
              className="bg-sidebar text-white min-h-[120px]"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isFetching}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
          >
            {(isSubmitting || isFetching) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitting || isFetching ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
