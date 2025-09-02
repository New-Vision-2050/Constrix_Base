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
import { Loader2 } from "lucide-react";
import MultiSelectField from "@/modules/form-builder/components/fields/MultiSelectField";

const createOrderDiscountSchema = () =>
  z.object({
    totalOrderValue: z
      .string()
      .min(1, "اجمالي قيمة الطلب مطلوب")
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && num > 0;
        },
        { message: "يجب أن تكون قيمة الطلب رقم صحيح أكبر من الصفر" }
      ),
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
    applyDiscountToOrder: z.boolean().default(false),
    selectedProducts: z
      .array(z.string())
      .min(1, "يجب اختيار منتج واحد على الأقل"),
  });

type OrderDiscountFormData = z.infer<
  ReturnType<typeof createOrderDiscountSchema>
>;

interface OrderDiscountData {
  total_order_value: number;
  discount_percentage: number;
  apply_discount_to_order: boolean;
  selected_products: string[];
}

interface AddOrderDiscountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: OrderDiscountData) => void;
}

export default function AddOrderDiscountDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddOrderDiscountDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderDiscountFormData>({
    resolver: zodResolver(createOrderDiscountSchema()),
    defaultValues: {
      totalOrderValue: "",
      discountPercentage: "",
      applyDiscountToOrder: false,
      selectedProducts: [],
    },
  });

  const watchedApplyDiscountToOrder = watch("applyDiscountToOrder");

  const onSubmit = async (data: OrderDiscountFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const submitData: OrderDiscountData = {
        total_order_value: Number(data.totalOrderValue),
        discount_percentage: Number(data.discountPercentage),
        apply_discount_to_order: data.applyDiscountToOrder,
        selected_products: data.selectedProducts,
      };

      console.log("Submitting order discount data:", submitData);

      onSuccess?.(submitData);

      reset();
      onClose();
    } catch (error) {
      console.error("Error creating order discount:", error);
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
            اضافة تخفيض على اجمالي طلب
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="totalOrderValue"
                  className="text-sm text-gray-400"
                >
                  اجمالي قيمة الطلب اكبر من
                </Label>
                <Input
                  id="totalOrderValue"
                  variant="secondary"
                  type="number"
                  {...register("totalOrderValue")}
                  placeholder="4,000"
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                />
                {errors.totalOrderValue && (
                  <p className="text-red-500 text-sm">
                    {errors.totalOrderValue.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="discountPercentage"
                  className="text-sm text-gray-400"
                >
                  نسبة التخفيض (%)
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
                <Label className="text-sm text-gray-400">المنتجات</Label>
                <MultiSelectField
                  field={{
                    name: "selectedProducts",
                    type: "multiSelect",
                    label: "",
                    placeholder: "اختر المنتجات",
                    required: true,
                    options: [
                      { value: "1", label: "HAMMER SCREEN PROTECTOR" },
                      { value: "2", label: "NLIKIN كفر ايفون" },
                      { value: "3", label: "Samsung Galaxy Case" },
                      { value: "4", label: "iPhone 14 Pro Max Case" },
                      { value: "5", label: "Wireless Charger" },
                    ],
                  }}
                  value={watch("selectedProducts") || []}
                  onChange={(value) => setValue("selectedProducts", value)}
                  onBlur={() => {}}
                  error={errors.selectedProducts?.message}
                  touched={!!errors.selectedProducts}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="applyDiscountToOrder"
                  checked={watchedApplyDiscountToOrder}
                  onCheckedChange={(checked) =>
                    setValue("applyDiscountToOrder", checked === true)
                  }
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="applyDiscountToOrder"
                  className="text-sm font-medium cursor-pointer text-white"
                >
                  تفعيل التخفيض على الطلب
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
                    <span className="text-gray-300">سعر الطلب الاساسي</span>
                    <span className="text-white">4,100 ريال</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">التخفيض</span>
                    <span className="text-white">410 ريال</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                    <span className="text-red-400 font-semibold">
                      سعر الطلب بعد
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
