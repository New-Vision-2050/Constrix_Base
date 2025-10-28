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
import FormLabel from "@/components/shared/FormLabel";
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
  z
    .object({
      coupon_type: z.string().min(1, "نوع القسيمة مطلوب"),
      code: z.string().min(1, "رمز القسيمة مطلوب"),
      title: z.string().min(1, "عنوان القسيمة مطلوب"),
      customer_id: z.string().optional().nullable(),
      max_usage_per_user: z.coerce.number().optional().nullable(),
      discount_type: z.enum(["percentage", "fixed"]),
      discount_amount: z.coerce.number().min(0, "مبلغ الخصم يجب أن يكون صفر أو أكبر"),
      min_purchase: z.coerce.number().min(0, "الحد الأدنى للشراء يجب أن يكون صفر أو أكبر"),
      max_discount: z.coerce.number().min(0, "الحد الأقصى للخصم يجب أن يكون صفر أو أكبر"),
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
    })
    .refine(
      (data) => {
        if (!data.start_date || !data.expire_date) return true;
        const startDate = new Date(data.start_date);
        const expireDate = new Date(data.expire_date);
        return expireDate > startDate;
      },
      {
        message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء",
        path: ["expire_date"],
      }
    );

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
      customer_id: "",
      max_usage_per_user: "" as any,
      discount_type: "fixed",
      discount_amount: "" as any,
      min_purchase: "" as any,
      max_discount: "" as any,
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
        customer_id: coupon.customer_id || "",
        max_usage_per_user: coupon.max_usage_per_user || null,
        discount_type: coupon.discount_type || "fixed",
        discount_amount: coupon.discount_amount || 0,
        min_purchase: coupon.min_purchase || 0,
        max_discount: coupon.max_discount || 0,
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
      // Handle validation errors (422)
      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          // Display all validation errors
          Object.entries(validationErrors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages.join(", ") : messages;
            toast.error(`${field}: ${errorMessage}`);
          });
          return;
        }
      }
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
      // Handle validation errors (422)
      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          // Display all validation errors
          Object.entries(validationErrors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages.join(", ") : messages;
            toast.error(`${field}: ${errorMessage}`);
          });
          return;
        }
      }
      toast.error(error?.response?.data?.message || "فشل في تحديث القسيمة");
    },
  });

  const onSubmit = async (data: CouponFormData) => {
    // Always send customer_id as null
    const submitData = {
      ...data,
      customer_id: null,
    };
    
    if (isEditMode) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
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
            {isEditMode ? t("coupon.editCoupon") : t("coupon.addCoupon")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Row 1: نوع القسيمة, رمز القسيمة, عنوان القسيمة */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="coupon_type" required>
                {t("coupon.couponType")}
              </FormLabel>
              <Controller
                name="coupon_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      className="mt-1 bg-sidebar border-white text-white h-12"
                      showClear={!!field.value}
                      onClear={() => field.onChange("")}
                    >
                      <SelectValue placeholder={t("coupon.selectCouponType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free_delivery">{t("coupon.freeDelivery")}</SelectItem>
                      <SelectItem value="first_order">{t("coupon.firstOrder")}</SelectItem>
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
              <FormLabel htmlFor="code" required>
                {t("coupon.code")}
              </FormLabel>
              <Input
                id="code"
                variant="secondary"
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
              <FormLabel htmlFor="title" required>
                {t("coupon.title")}
              </FormLabel>
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

          {/* Row 2: العميل, الحد الأقصى لعدد المستخدم, نوع الخصم */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="customer_id">
                {t("coupon.customer")}
              </FormLabel>
              <Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      className="mt-1 bg-sidebar border-white text-white h-12"
                      showClear={!!field.value}
                      onClear={() => field.onChange("")}
                    >
                      <SelectValue placeholder={t("coupon.selectCustomer")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">أحمد محمد</SelectItem>
                      <SelectItem value="2">فاطمة علي</SelectItem>
                      <SelectItem value="3">محمد حسن</SelectItem>
                      <SelectItem value="4">سارة خالد</SelectItem>
                      <SelectItem value="5">عمر يوسف</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <FormLabel htmlFor="max_usage_per_user">
                {t("coupon.maxUsagePerUser")}
              </FormLabel>
              <Input
                id="max_usage_per_user"
                type="number"
                variant="secondary"
                {...register("max_usage_per_user", { valueAsNumber: true })}
                disabled={isLoading}
                className="bg-[#1a1a2e] border-gray-700"
              />
            </div>

            <div>
              <FormLabel htmlFor="discount_type" required>
                {t("coupon.discountType")}
              </FormLabel>
              <Controller
                name="discount_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      className="mt-1 bg-sidebar border-white text-white h-12"
                      showClear={!!field.value}
                      onClear={() => field.onChange("percentage")}
                    >
                      <SelectValue placeholder={t("coupon.selectDiscountType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">{t("coupon.percentage")}</SelectItem>
                      <SelectItem value="fixed">{t("coupon.fixed")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Row 3: مبلغ الخصم, الحد الأدنى للشراء (SAR), الحد الأقصى للخصم (SAR) */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="discount_amount" required>
                {t("coupon.discountAmount")}
              </FormLabel>
              <Input
                id="discount_amount"
                type="number"
                variant="secondary"
                {...register("discount_amount", { valueAsNumber: true })}
                disabled={isLoading}
                className="bg-[#1a1a2e] border-gray-700"
              />
            </div>

            <div>
              <FormLabel htmlFor="min_purchase" required>
                {t("coupon.minPurchase")}
              </FormLabel>
              <Input
                id="min_purchase"
                type="number"
                variant="secondary"
                {...register("min_purchase", { valueAsNumber: true })}
                disabled={isLoading}
                className="bg-[#1a1a2e] border-gray-700"
              />
              {errors.min_purchase && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.min_purchase.message}
                </p>
              )}
            </div>

            <div>
              <FormLabel htmlFor="max_discount" required>
                {t("coupon.maxDiscount")}
              </FormLabel>
              <Input
                id="max_discount"
                type="number"
                variant="secondary"
                {...register("max_discount", { valueAsNumber: true })}
                disabled={isLoading}
                className="bg-[#1a1a2e] border-gray-700"
              />
              {errors.max_discount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.max_discount.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: تاريخ البدء, تاريخ الإنتهاء, empty */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="start_date" required>
                {t("coupon.startDate")}
              </FormLabel>
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
              <FormLabel htmlFor="expire_date" required>
                {t("coupon.expireDate")}
              </FormLabel>
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

            {/* Empty third column */}
            <div></div>
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
              {t("coupon.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-12 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("coupon.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
