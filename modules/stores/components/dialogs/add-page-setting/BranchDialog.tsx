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
import { toast } from "sonner";
import { apiClient } from "@/config/axios-config";

const createBranchSchema = (t: (key: string) => string) =>
  z.object({
    branch_name: z.string().min(1, { message: "اسم الفرع مطلوب" }),
    country: z.string().min(1, { message: "الدولة مطلوبة" }),
    address: z.string().min(1, { message: "العنوان مطلوب" }),
    phone: z.string().min(1, { message: "رقم الهاتف مطلوب" }),
    email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  });

type BranchFormData = z.infer<ReturnType<typeof createBranchSchema>>;

interface BranchDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  branchId?: string;
}

export function BranchDialog({
  open,
  onClose,
  onSuccess,
  branchId,
}: BranchDialogProps) {
  const t = useTranslations();
  const isEditMode = !!branchId;

  const { data: branchData, isLoading: isFetching } = useQuery({
    queryKey: ["branch", branchId],
    queryFn: () => apiClient.get(`/ecommerce/dashboard/branches/${branchId}`),
    enabled: isEditMode && open,
  });

  const form = useForm<BranchFormData>({
    resolver: zodResolver(createBranchSchema(t)),
    defaultValues: {
      branch_name: "",
      country: "",
      address: "",
      phone: "",
      email: "",
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
        branch_name: "",
        country: "",
        address: "",
        phone: "",
        email: "",
      });
    }
  }, [open, reset]);

  useEffect(() => {
    if (isEditMode && branchData?.data?.payload && open) {
      const branch = branchData.data.payload;
      reset({
        branch_name: branch.branch_name || "",
        country: branch.country || "",
        address: branch.address || "",
        phone: branch.phone || "",
        email: branch.email || "",
      });
    }
  }, [isEditMode, branchData, open, reset]);

  const onSubmit = async (data: BranchFormData) => {
    try {
      const url =
        isEditMode && branchId
          ? `/ecommerce/dashboard/branches/${branchId}`
          : "/ecommerce/dashboard/branches";
      
      await apiClient.post(url, data);

      toast.success(
        isEditMode ? "تم تحديث الفرع بنجاح" : "تم إنشاء الفرع بنجاح"
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
        isEditMode ? "فشل في تحديث الفرع" : "فشل في إنشاء الفرع"
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
      <DialogContent className="max-w-2xl w-full bg-sidebar border-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? "تعديل فرع" : "اضافة فرع جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel required>اسم الفرع</FormLabel>
              <Input
                {...form.register("branch_name")}
                className="bg-sidebar text-white"
                placeholder="اسم الفرع"
              />
              {errors.branch_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.branch_name.message}
                </p>
              )}
            </div>

            <div>
              <FormLabel required>الدولة</FormLabel>
              <Input
                {...form.register("country")}
                className="bg-sidebar text-white"
                placeholder="الدولة"
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <FormLabel required>العنوان</FormLabel>
              <Input
                {...form.register("address")}
                className="bg-sidebar text-white"
                placeholder="العنوان"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <FormLabel required>رقم الهاتف</FormLabel>
              <Input
                {...form.register("phone")}
                className="bg-sidebar text-white"
                placeholder="رقم الهاتف"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <FormLabel required>البريد الإلكتروني</FormLabel>
              <Input
                {...form.register("email")}
                type="email"
                className="bg-sidebar text-white"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
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
            {isSubmitting || isFetching ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
