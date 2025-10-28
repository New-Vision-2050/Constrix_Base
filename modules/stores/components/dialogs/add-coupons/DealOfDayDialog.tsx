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
import { DealDaysApi } from "@/services/api/ecommerce/deal-days";
import { ProductsApi } from "@/services/api/ecommerce/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const createDealSchema = (t: (key: string) => string) =>
  z.object({
    name: z.object({
      ar: z.string().min(1, "اسم الصفقة بالعربية مطلوب"),
      en: z.string().min(1, "اسم الصفقة بالإنجليزية مطلوب"),
    }),
    product_id: z.string().min(1, "المنتج مطلوب"),
    discount_type: z.enum(["percentage", "amount"]),
    discount_value: z.number().min(0, "قيمة الخصم يجب أن تكون أكبر من صفر"),
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

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");
  const [selectedDiscountType, setSelectedDiscountType] = useState<string>("percentage");

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
  } = useForm<DealFormData>({
    resolver: zodResolver(createDealSchema(t)),
    defaultValues: {
      name: {
        ar: "",
        en: "",
      },
      product_id: "",
      discount_type: "percentage",
      discount_value: 0,
    },
  });

  // Fetch deal data for edit mode
  const { data: dealData, isLoading: isFetchingDeal } = useQuery({
    queryKey: ["deal-day", dealId],
    queryFn: () => DealDaysApi.show(dealId!),
    enabled: !!dealId && open,
  });

  // Populate form when editing
  useEffect(() => {
    if (dealData?.data?.payload) {
      const deal = dealData.data.payload;
      const productId = deal.product_id || deal.product?.id || "";
      reset({
        name: {
          ar: deal.name?.ar || "",
          en: deal.name?.en || "",
        },
        product_id: productId,
        discount_type: deal.discount_type || "percentage",
        discount_value: deal.discount_value || 0,
      });
      setSelectedProductId(productId);
      setSelectedDiscountType(deal.discount_type || "percentage");
    }
  }, [dealData, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: DealFormData) => DealDaysApi.create(data),
    onSuccess: () => {
      toast.success("تم إضافة صفقة اليوم بنجاح");
      onSuccess?.();
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "فشل في إضافة صفقة اليوم");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: DealFormData) => DealDaysApi.update(dealId!, data),
    onSuccess: () => {
      toast.success("تم تحديث صفقة اليوم بنجاح");
      onSuccess?.();
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "فشل في تحديث صفقة اليوم");
    },
  });

  const onSubmit = async (data: DealFormData) => {
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
    isFetchingDeal || createMutation.isPending || updateMutation.isPending;

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
            {isEditMode ? "تعديل صفقة اليوم" : "إضافة صفقة اليوم"}
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

          {/* Arabic Name */}
          {activeTab === "ar" && (
            <div>
              <Label htmlFor="name.ar" className="text-gray-400 text-sm">
                الرئيسية <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name.ar"
                placeholder="الرئيسية"
                variant="secondary"
                className="bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12"
                {...register("name.ar")}
                disabled={isLoading}
              />
              {errors.name?.ar && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.ar.message}
                </p>
              )}
            </div>
          )}

          {/* English Name */}
          {activeTab === "en" && (
            <div>
              <Label htmlFor="name.en" className="text-gray-400 text-sm">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name.en"
                placeholder="Title"
                variant="secondary"
                className="bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12"
                {...register("name.en")}
                disabled={isLoading}
              />
              {errors.name?.en && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.en.message}
                </p>
              )}
            </div>
          )}

          {/* Product Dropdown */}
          <div>
            <Label htmlFor="product_id" className="text-gray-400 text-sm">
              المنتج <span className="text-red-500">*</span>
            </Label>
            <input type="hidden" {...register("product_id")} />
            <Select
              value={selectedProductId}
              onValueChange={(value) => {
                setSelectedProductId(value);
                setValue("product_id", value, { shouldValidate: true });
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12">
                <SelectValue placeholder="اختر المنتج" />
              </SelectTrigger>
              <SelectContent className="bg-sidebar border-gray-700">
                {products.map((product: any) => (
                  <SelectItem
                    key={product.id}
                    value={product.id}
                    className="text-white hover:bg-gray-800"
                  >
                    {product.name?.ar || product.name_ar || product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product_id && (
              <p className="text-red-500 text-xs mt-1">{errors.product_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Discount Type */}
            <div>
              <Label htmlFor="discount_type" className="text-gray-400 text-sm">
                نوع الخصم <span className="text-red-500">*</span>
              </Label>
              <input type="hidden" {...register("discount_type")} />
              <Select
                value={selectedDiscountType}
                onValueChange={(value) => {
                  setSelectedDiscountType(value);
                  setValue("discount_type", value as "percentage" | "amount", { shouldValidate: true });
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12">
                  <SelectValue placeholder="اختر نوع الخصم" />
                </SelectTrigger>
                <SelectContent className="bg-sidebar border-gray-700">
                  <SelectItem value="percentage" className="text-white hover:bg-gray-800">
                    نسبة مئوية
                  </SelectItem>
                  <SelectItem value="amount" className="text-white hover:bg-gray-800">
                    مبلغ ثابت
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.discount_type && (
                <p className="text-red-500 text-xs mt-1">{errors.discount_type.message}</p>
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
                className="bg-[#0a1628]/50 border-[#1e3a5f] text-white h-12"
                {...register("discount_value", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.discount_value && (
                <p className="text-red-500 text-xs mt-1">{errors.discount_value.message}</p>
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
