"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import { CouponsApi } from "@/services/api/ecommerce/coupons";

const createCouponSchema = (t: (key: string) => string) =>
  z.object({
    coupon_type: z.string().min(1, "نوع القسيمة مطلوب"),
    code: z.string().min(1, t("coupon.codeRequired")),
    title: z.string().min(1, "عنوان القسيمة مطلوب"),
    discount_type: z.enum(["percentage", "fixed"]),
    discount_amount: z.number().min(0),
    max_usage_per_user: z.number().min(1),
    max_usage_limit: z.number().min(1),
    max_purchase_amount: z.number().min(0),
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
    expire_date: z.string().min(1, "تاريخ الانتهاء مطلوب"),
  });

type CouponFormData = z.infer<ReturnType<typeof createCouponSchema>>;

interface CouponDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  couponId?: string;
}

export default function CouponDialog({
  open,
  onClose,
  onSuccess,
  couponId,
}: CouponDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!couponId;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(createCouponSchema(t)),
    defaultValues: {
      coupon_type: "",
      code: "",
      title: "",
      discount_type: "percentage",
      discount_amount: 0,
      max_usage_per_user: 1,
      max_usage_limit: 1,
      max_purchase_amount: 0,
      start_date: "",
      expire_date: "",
    },
  });

  // Fetch coupon data for edit mode
  const { data: couponData, isLoading: isFetchingCoupon } = useQuery({
    queryKey: ["coupon", couponId],
    queryFn: () => CouponsApi.show(couponId!),
    enabled: !!couponId && open,
  });

  // Populate form when editing
  useEffect(() => {
    if (couponData?.data?.payload) {
      const coupon = couponData.data.payload;
      reset({
        coupon_type: coupon.coupon_type || "",
        code: coupon.code || "",
        title: coupon.title || "",
        discount_type: coupon.discount_type || "percentage",
        discount_amount: coupon.discount_amount || 0,
        max_usage_per_user: coupon.max_usage_per_user || 1,
        max_usage_limit: coupon.max_usage_limit || 1,
        max_purchase_amount: coupon.max_purchase_amount || 0,
        start_date: coupon.start_date || "",
        expire_date: coupon.expire_date || "",
      });
    }
  }, [couponData, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CouponFormData) => CouponsApi.create(data),
    onSuccess: () => {
      toast.success("تم إضافة القسيمة بنجاح");
      onSuccess?.();
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "فشل في إضافة القسيمة");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CouponFormData) => CouponsApi.update(couponId!, data),
    onSuccess: () => {
      toast.success("تم تحديث القسيمة بنجاح");
      onSuccess?.();
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "فشل في تحديث القسيمة");
    },
  });

  const onSubmit = async (data: CouponFormData) => {
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

  const isLoading =
    isFetchingCoupon || createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-4xl w-full bg-sidebar border-gray-700 ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? "تعديل قسيمة" : "إضافة قسيمة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Row 1: نوع القسيمة, رمز القسيمة, عنوان القسيمة */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="coupon_type" className="text-gray-400 text-sm">
                نوع القسيمة <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="coupon_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="mt-1 bg-sidebar border-white text-white h-12">
                      <SelectValue placeholder="اختر نوع القسيمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free_delivery">توصيل مجاني</SelectItem>
                      <SelectItem value="first_order">الطلب الأول</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.coupon_type && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.coupon_type.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="code" className="text-gray-400 text-sm">
                رمز القسيمة <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                variant="secondary"
                placeholder="gfd5tr"
                {...register("code")}
                disabled={isLoading}
                className="bg-[#1a1a2e] border-gray-700"
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title" className="text-gray-400 text-sm">
                عنوان القسيمة <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                variant="secondary"
                className="bg-[#1a1a2e] border-gray-700"
                {...register("title")}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: الحد الأقصى لعدد المستخدم, نوع الخصم, مبلغ الخصم */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label
                htmlFor="max_usage_per_user"
                className="text-gray-400 text-sm"
              >
                الحد الأقصى لعدد المستخدم{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="max_usage_per_user"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="mt-1 bg-sidebar border-white text-white h-12">
                      <SelectValue placeholder="حد المميل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">حد المميل</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="discount_type" className="text-gray-400 text-sm">
                نوع الخصم <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="discount_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="mt-1 bg-sidebar border-white text-white h-12">
                      <SelectValue placeholder="اختر نوع الخصم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">نسبة مئوية</SelectItem>
                      <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label
                htmlFor="discount_amount"
                className="text-gray-400 text-sm"
              >
                مبلغ الخصم <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discount_amount"
                type="number"
                variant="secondary"
                placeholder="500"
                {...register("discount_amount", { valueAsNumber: true })}
                disabled={isLoading}
                className="bg-[#1a1a2e] border-gray-700"
              />
            </div>
          </div>

          {/* Row 3: الحد الأدنى للشراء ($), تاريخ البدء, تاريخ الإنتهاء */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label
                htmlFor="max_purchase_amount"
                className="text-gray-400 text-sm"
              >
                الحد الاقصي للشراء ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="max_purchase_amount"
                type="number"
                variant="secondary"
                {...register("max_purchase_amount", { valueAsNumber: true })}
                disabled={isLoading}
                className="bg-[#1a1a2e] border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="start_date" className="text-gray-400 text-sm">
                تاريخ البدء <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="start_date"
                  type="date"
                  variant="secondary"
                  {...register("start_date")}
                  disabled={isLoading}
                  className="bg-[#1a1a2e] border-gray-700"
                />
              </div>
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="expire_date" className="text-gray-400 text-sm">
                تاريخ الإنتهاء <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="expire_date"
                  type="date"
                  variant="secondary"
                  {...register("expire_date")}
                  disabled={isLoading}
                  className="bg-[#1a1a2e] border-gray-700"
                />
              </div>
              {errors.expire_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.expire_date.message}
                </p>
              )}
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
