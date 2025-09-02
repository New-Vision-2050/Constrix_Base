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

const createWarehouseSchema = () =>
  z.object({
    productName: z
      .string()
      .min(1, "اسم المنتج مطلوب")
      .min(2, "اسم المنتج يجب أن يكون على الأقل حرفين"),
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
    applyDiscountToProduct: z.boolean().default(false),
  });

type WarehouseFormData = z.infer<ReturnType<typeof createWarehouseSchema>>;

interface WarehouseData {
  product_name: string;
  discount_percentage: number;
  apply_discount_to_product: boolean;
}

interface AddWarehouseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: WarehouseData) => void;
}

export default function AddWarehouseDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddWarehouseDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(createWarehouseSchema()),
    defaultValues: {
      productName: "",
      discountPercentage: "",
      applyDiscountToProduct: false,
    },
  });

  const watchedApplyDiscountToProduct = watch("applyDiscountToProduct");

  const onSubmit = async (data: WarehouseFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const submitData: WarehouseData = {
        product_name: data.productName,
        discount_percentage: Number(data.discountPercentage),
        apply_discount_to_product: data.applyDiscountToProduct,
      };

      console.log("Submitting warehouse data:", submitData);

      onSuccess?.(submitData);

      reset();
      onClose();
    } catch (error) {
      console.error("Error creating warehouse:", error);
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
            اضافة مخزن
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-sm text-gray-400">
                  اسم المنتج
                </Label>
                <select
                  id="productName"
                  {...register("productName")}
                  className="w-full p-3 bg-sidebar border border-gray-700 rounded-md text-white"
                  disabled={isSubmitting}
                >
                  <option value="ايفون 16 برو ماكس">ايفون 16 برو ماكس</option>
                  <option value="سامسونج جالاكسي">سامسونج جالاكسي</option>
                  <option value="هواوي بي 50">هواوي بي 50</option>
                </select>
                {errors.productName && (
                  <p className="text-red-500 text-sm">
                    {errors.productName.message}
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

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="applyDiscountToProduct"
                  checked={watchedApplyDiscountToProduct}
                  onCheckedChange={(checked) =>
                    setValue("applyDiscountToProduct", checked === true)
                  }
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="applyDiscountToProduct"
                  className="text-sm font-medium cursor-pointer text-white"
                >
                  تفعيل التخفيض على المنتج
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
