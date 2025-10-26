"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
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

const createDealSchema = (t: (key: string) => string) =>
  z.object({
    product_id: z.string().min(1, "المنتج مطلوب"),
    discount_type: z.enum(["percentage", "fixed"]),
    discount_value: z.number().min(0),
    start_date: z.string(),
    end_date: z.string(),
  });

type DealFormData = z.infer<ReturnType<typeof createDealSchema>>;

interface DealOfDayDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  dealId?: string;
}

export default function DealOfDayDialog({
  open,
  onClose,
  onSuccess,
  dealId,
}: DealOfDayDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!dealId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DealFormData>({
    resolver: zodResolver(createDealSchema(t)),
    defaultValues: {
      product_id: "",
      discount_type: "percentage",
      discount_value: 0,
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = async (data: DealFormData) => {
    try {
      // API call here
      toast.success(
        isEditMode ? "تم تحديث صفقة اليوم بنجاح" : "تم إضافة صفقة اليوم بنجاح"
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      toast.error("فشل في حفظ صفقة اليوم");
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
            {isEditMode ? "تعديل صفقة اليوم" : "إضافة صفقة اليوم"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="product_id">المنتج</Label>
            <Input
              id="product_id"
              variant="secondary"
              {...register("product_id")}
              disabled={isSubmitting}
              placeholder="اختر المنتج"
            />
            {errors.product_id && (
              <p className="text-red-500 text-xs mt-1">{errors.product_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount_type">نوع الخصم</Label>
              <select
                id="discount_type"
                {...register("discount_type")}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-sidebar border border-gray-700 rounded-md text-white"
              >
                <option value="percentage">نسبة مئوية</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </div>

            <div>
              <Label htmlFor="discount_value">قيمة الخصم</Label>
              <Input
                id="discount_value"
                type="number"
                variant="secondary"
                {...register("discount_value", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">تاريخ البداية</Label>
              <Input
                id="start_date"
                type="date"
                variant="secondary"
                {...register("start_date")}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="end_date">تاريخ النهاية</Label>
              <Input
                id="end_date"
                type="date"
                variant="secondary"
                {...register("end_date")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "تحديث" : "حفظ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
