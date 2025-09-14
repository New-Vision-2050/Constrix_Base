"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, QrCode } from "lucide-react";
import MultiSelectField from "@/modules/form-builder/components/fields/MultiSelectField";

const createDiscountCouponSchema = () =>
  z.object({
    selectedProducts: z
      .array(z.string())
      .min(1, "يجب اختيار منتج واحد على الأقل"),
    discountPercentage: z
      .string()
      .min(1, "نسبة التخفيض مطلوبة")
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && num >= 0 && num <= 100;
        },
        { message: "يجب أن تكون نسبة التخفيض بين 0 و 100" }
      ),
    endDate: z.string().min(1, "تاريخ انتهاء الخصم مطلوب"),
    couponCode: z
      .string()
      .min(1, "كود الخصم مطلوب")
      .min(3, "كود الخصم يجب أن يكون على الأقل 3 أحرف"),
    activateDiscount: z.boolean().default(false),
  });

type DiscountCouponFormData = z.infer<
  ReturnType<typeof createDiscountCouponSchema>
>;

interface DiscountCouponData {
  selected_products: string[];
  discount_percentage: number;
  end_date: string;
  coupon_code: string;
  activate_discount: boolean;
}

interface AddDiscountCouponDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: DiscountCouponData) => void;
}

export default function AddDiscountCouponDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddDiscountCouponDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DiscountCouponFormData>({
    resolver: zodResolver(createDiscountCouponSchema()),
    defaultValues: {
      selectedProducts: [],
      discountPercentage: "",
      endDate: "",
      couponCode: "",
      activateDiscount: false,
    },
  });

  const watchedActivateDiscount = watch("activateDiscount");

  const onSubmit = async (data: DiscountCouponFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const submitData: DiscountCouponData = {
        selected_products: data.selectedProducts,
        discount_percentage: Number(data.discountPercentage),
        end_date: data.endDate,
        coupon_code: data.couponCode,
        activate_discount: data.activateDiscount,
      };

      console.log("Submitting discount coupon data:", submitData);

      onSuccess?.(submitData);

      reset();
      onClose();
    } catch (error) {
      console.error("Error creating discount coupon:", error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-4xl w-full bg-sidebar border-gray-700 ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            اضافة كود خصم
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">المنتجات</Label>
                <MultiSelectField
                  field={{
                    name: "selectedProducts",
                    type: "multiSelect",
                    label: "",
                    placeholder: "اختر المنتجات",
                    required: true,
                    options: [
                      { value: "nlikin", label: "Nlikin كفر" },
                      { value: "hammer", label: "HAMMER SCREEN PROTECTOR" },
                      { value: "samsung", label: "Samsung Galaxy Case" },
                      { value: "iphone", label: "iPhone 14 Pro Max Case" },
                      { value: "wireless", label: "Wireless Charger" },
                    ],
                  }}
                  value={watch("selectedProducts") || []}
                  onChange={(value) => setValue("selectedProducts", value)}
                  onBlur={() => {}}
                  error={errors.selectedProducts?.message}
                  touched={!!errors.selectedProducts}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="discountPercentage"
                  className="text-sm text-gray-400"
                >
                  نسبة التخفيض ( % )
                </Label>
                <Input
                  id="discountPercentage"
                  variant="secondary"
                  type="number"
                  {...register("discountPercentage")}
                  placeholder="10"
                  disabled={isSubmitting}
                  min="0"
                  max="100"
                />
                {errors.discountPercentage && (
                  <p className="text-red-500 text-sm">
                    {errors.discountPercentage.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm text-gray-400">
                  تاريخ انتهاء الخصم
                </Label>
                <Input
                  id="endDate"
                  variant="secondary"
                  type="date"
                  {...register("endDate")}
                  disabled={isSubmitting}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="couponCode" className="text-sm text-gray-400">
                  كود الخصم
                </Label>
                <div className="relative">
                  <Input
                    id="couponCode"
                    variant="secondary"
                    type="text"
                    {...register("couponCode")}
                    placeholder="A516D101125"
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <QrCode className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors.couponCode && (
                  <p className="text-red-500 text-sm">
                    {errors.couponCode.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="activateDiscount"
                  checked={watchedActivateDiscount}
                  onCheckedChange={(checked) =>
                    setValue("activateDiscount", checked === true)
                  }
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="activateDiscount"
                  className="text-sm font-medium cursor-pointer text-white"
                >
                  تفعيل التخفيض على المنتجات
                </Label>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-sidebar p-6 rounded-lg">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">
                  مراجعة
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">سعر المنتج الاساسي</span>
                    <span className="text-white">4,100 ريال</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">التخفيض</span>
                    <span className="text-white">410 ريال</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                    <span className="text-red-400 font-semibold">
                      سعر المنتج بعد
                      <br />
                      تطبيق التخفيض
                    </span>
                    <span className="text-red-400 font-semibold text-lg">
                      3,690 ريال
                    </span>
                  </div>
                </div>
              </div>
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
              الغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  جاري الحفظ...
                </span>
              ) : (
                "حفظ"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
