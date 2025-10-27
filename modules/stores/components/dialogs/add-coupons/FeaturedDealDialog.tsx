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
import { Loader2 } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import { ProductsApi } from "@/services/api/ecommerce/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const createFeaturedDealSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, "العنوان مطلوب"),
    product_id: z.string().min(1, "المنتج مطلوب"),
    discount_type: z.enum(["percentage", "amount"]),
    discount_value: z.number().min(0, "قيمة الخصم يجب أن تكون أكبر من صفر"),
    start_date: z.string().min(1, "تاريخ البدء مطلوب"),
    end_date: z.string().min(1, "تاريخ الانتهاء مطلوب"),
    min_discount_value: z.number().min(0, "الحد الأدنى لقيمة الخصم مطلوب"),
  });

type FeaturedDealFormData = z.infer<
  ReturnType<typeof createFeaturedDealSchema>
>;

interface FeaturedDealDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  dealId?: string;
}

export default function FeaturedDealDialog({
  open,
  onClose,
  onSuccess,
  dealId,
}: FeaturedDealDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!dealId;

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");
  const [selectedDiscountType, setSelectedDiscountType] =
    useState<string>("percentage");

  // Fetch products list
  const { data: productsData } = useQuery({
    queryKey: ["products-list"],
    queryFn: () => ProductsApi.list(),
  });

  const products = (productsData?.data?.payload || []) as any[];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FeaturedDealFormData>({
    resolver: zodResolver(createFeaturedDealSchema(t)),
    defaultValues: {
      title: "",
      product_id: "",
      discount_type: "percentage",
      discount_value: 0,
      start_date: "",
      end_date: "",
      min_discount_value: 0,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: FeaturedDealFormData) => {
      // Replace with actual API call
      return Promise.resolve({ data });
    },
    onSuccess: () => {
      toast.success("تم إضافة الصفقة المميزة بنجاح");
      onSuccess?.();
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "فشل في إضافة الصفقة المميزة"
      );
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: FeaturedDealFormData) => {
      // Replace with actual API call
      return Promise.resolve({ data });
    },
    onSuccess: () => {
      toast.success("تم تحديث الصفقة المميزة بنجاح");
      onSuccess?.();
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "فشل في تحديث الصفقة المميزة"
      );
    },
  });

  const onSubmit = async (data: FeaturedDealFormData) => {
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
      onClose();
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && handleClose()}>
      <DialogContent
        className={`max-w-3xl w-full bg-sidebar border-gray-700 ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? "تعديل صفقة مميزة جديدة" : "إضافة صفقة مميزة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Language Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("ar")}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === "ar"
                  ? "text-white border-primary border-b-2"
                  : "hover:text-white"
              }`}
            >
              اللغة العربية (AR)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === "en"
                  ? "text-white border-primary border-b-2"
                  : "hover:text-white"
              }`}
            >
              اللغة الانجليزية (EN)
            </button>
          </div>

          {/* Title Field */}
          <div>
            <Label htmlFor="title" className="text-gray-400 text-sm">
              {activeTab === "ar" ? "العنوان" : "Title"}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder={activeTab === "ar" ? "الرئيسية" : "Main Title"}
              variant="secondary"
              className="bg-sidebar border-white text-white h-12"
              {...register("title")}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-gray-400 text-sm">
                تاريخ البدء <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_date"
                type="date"
                variant="secondary"
                className="bg-sidebar border-white text-white h-12"
                {...register("start_date")}
                disabled={isLoading}
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="end_date" className="text-gray-400 text-sm">
                تاريخ الانتهاء <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end_date"
                type="date"
                variant="secondary"
                className="bg-sidebar border-white text-white h-12"
                {...register("end_date")}
                disabled={isLoading}
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          {/* Discount Type Dropdown */}
          <div>
            <Label htmlFor="discount_type" className="text-gray-400 text-sm">
              نوع الخصم <span className="text-red-500">*</span>
            </Label>
            <input type="hidden" {...register("discount_type")} />
            <Select
              value={selectedDiscountType}
              onValueChange={(value) => {
                setSelectedDiscountType(value);
                setValue("discount_type", value as "percentage" | "amount", {
                  shouldValidate: true,
                });
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-sidebar border-white text-white h-12">
                <SelectValue placeholder="نسبة" />
              </SelectTrigger>
              <SelectContent className="bg-sidebar border-gray-700">
                <SelectItem
                  value="percentage"
                  className="text-white hover:bg-gray-800"
                >
                  نسبة مئوية
                </SelectItem>
                <SelectItem
                  value="amount"
                  className="text-white hover:bg-gray-800"
                >
                  مبلغ ثابت
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.discount_type && (
              <p className="text-red-500 text-xs mt-1">
                {errors.discount_type.message}
              </p>
            )}
          </div>

          {/* Discount Value */}
          <div>
            <Label htmlFor="discount_value" className="text-gray-400 text-sm">
              قيمة الخصم <span className="text-red-500">*</span>
            </Label>
            <Input
              id="discount_value"
              type="number"
              variant="secondary"
              className="bg-sidebar border-white text-white h-12"
              {...register("discount_value", { valueAsNumber: true })}
              disabled={isLoading}
            />
            {errors.discount_value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.discount_value.message}
              </p>
            )}
          </div>

          {/* Min Discount Value */}
          <div>
            <Label
              htmlFor="min_discount_value"
              className="text-gray-400 text-sm"
            >
              الحد الأدنى لقيمة الخصم <span className="text-red-500">*</span>
            </Label>
            <Input
              id="min_discount_value"
              type="number"
              variant="secondary"
              className="bg-sidebar border-white text-white h-12"
              {...register("min_discount_value", { valueAsNumber: true })}
              disabled={isLoading}
            />
            {errors.min_discount_value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.min_discount_value.message}
              </p>
            )}
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
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-12 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              حفظ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
