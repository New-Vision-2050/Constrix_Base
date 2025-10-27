"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Form } from "@/modules/table/components/ui/form";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import LanguageTabs from "@/components/shared/LanguageTabs";
import ProductFormFields from "./components/ProductFormFields";
import ProductInventoryFields from "./components/ProductInventoryFields";
import ProductPricingFields from "./components/ProductPricingFields";
import ProductImageUpload from "./components/ProductImageUpload";
import ProductVideoUrl from "./components/ProductVideoUrl";
import ProductSeoFields from "./components/ProductSeoFields";
import { ProductsApi } from "@/services/api/ecommerce/products";
import { useTableReload } from "@/modules/table/hooks/useTableReload";

// Product schema matching API requirements
const createProductSchema = (t: any) =>
  z
    .object({
      // Language-specific fields (using underscore instead of brackets for form state)
      name_ar: z.string().min(1, { message: t("product.validation.nameAr") }),
      name_en: z.string().min(1, { message: t("product.validation.nameEn") }),
      description_ar: z
        .string()
        .min(1, { message: t("product.validation.descriptionAr") }),
      description_en: z
        .string()
        .min(1, { message: t("product.validation.descriptionEn") }),

      // Basic fields
      sku: z.string().min(1, { message: t("product.validation.sku") }),
      is_visible: z.boolean().default(true),

      // Inventory fields
      category_id: z
        .string()
        .min(1, { message: t("product.validation.category") }),
      sub_category_id: z.string().optional(),
      sub_sub_category_id: z.string().optional(),
      brand_id: z.string().optional(),
      country_ids: z.array(z.string()).optional(),
      type: z.string().min(1, { message: t("product.validation.type") }),
      warehouse_id: z
        .string()
        .min(1, { message: t("product.validation.warehouse") }),
      unit: z.string().optional(),
      price: z.string().min(1, { message: t("product.validation.price") }),
      currency: z.string().optional(),
      gender: z.string().min(1, { message: t("product.validation.gender") }),

      // Pricing fields
      min_order_quantity: z
        .string()
        .min(1, { message: t("product.validation.minOrderQuantity") }),
      stock: z.string().optional(),
      discount_type: z
        .string()
        .min(1, { message: t("product.validation.discountType") }),
      discount_value: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val || val === "") return true;
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0;
          },
          { message: t("product.validation.discountValue") }
        ),
      vat_percentage: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val || val === "") return true;
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0 && num <= 100;
          },
          { message: t("product.validation.vatPercentage") }
        ),
      price_includes_vat: z.boolean().default(false),
      shipping_amount: z.string().optional(),
      shipping_included_in_price: z.boolean().default(false),

      // Video URL
      video_url: z.string().optional(),

      // Image fields
      main_photo: z.any().optional(),
      other_photos: z.array(z.any()).optional(),

      // SEO fields
      meta_title: z.string().optional(),
      meta_description: z.string().optional(),
      meta_keywords: z.string().optional(),
      meta_photo: z.any().optional(),
    })
    .refine(
      (data) => {
        // Unit is required only when type is "normal"
        if (data.type === "normal" && (!data.unit || data.unit.trim() === "")) {
          return false;
        }
        return true;
      },
      {
        message: t("product.validation.unit"),
        path: ["unit"], // This will show the error on the unit field
      }
    );

type ProductFormData = z.infer<ReturnType<typeof createProductSchema>>;

export default function AddProductView() {
  const t = useTranslations();
  const isRtl = useIsRtl();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("ar");
  const { reloadTable } = useTableReload("products-list-table");

  const productSchema = createProductSchema(t);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      sku: "",
      is_visible: true,
      category_id: "",
      sub_category_id: "",
      sub_sub_category_id: "",
      brand_id: "",
      country_ids: [],
      type: "",
      warehouse_id: "",
      unit: "",
      price: "",
      currency: "SAR",
      gender: "",

      // Pricing fields
      min_order_quantity: "",
      stock: "",
      discount_type: "",
      discount_value: "",
      vat_percentage: "",
      price_includes_vat: false,
      shipping_amount: "",
      shipping_included_in_price: false,

      // Video URL
      video_url: "",

      // Image fields
      main_photo: null,
      other_photos: [],

      // SEO fields
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      meta_photo: null,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      console.log("Form data before formatting:", data);

      // Simulate progress for better UX
      setUploadProgress(10);

      // Format the data for API submission - convert underscore to bracket notation
      const formattedData = {
        "name[ar]": data.name_ar || "",
        "name[en]": data.name_en || "",
        "description[ar]": data.description_ar || "",
        "description[en]": data.description_en || "",
        sku: data.sku || "",
        is_visible: data.is_visible ? 1 : 0,
        category_id: data.category_id || "",
        sub_category_id: data.sub_category_id || "",
        sub_sub_category_id: data.sub_sub_category_id || "",
        brand_id: data.brand_id || "",
        country_ids: data.country_ids || [],
        type: data.type || "",
        warehouse_id: data.warehouse_id || "",
        unit: data.unit || "",
        price: data.price || "",
        currency: data.currency || "",
        gender: data.gender || "",

        // Pricing fields
        min_order_quantity: data.min_order_quantity || "",
        stock: data.stock || "",
        discount_type: data.discount_type || "",
        discount_value: data.discount_value || "",
        vat_percentage: data.vat_percentage || "",
        price_includes_vat: data.price_includes_vat ? 1 : 0,
        shipping_amount: data.shipping_amount ? 1 : 0,
        shipping_included_in_price: data.shipping_included_in_price ? 1 : 0,

        // Video URL
        video_url: data.video_url || "",

        // Image fields
        main_photo: data.main_photo || null,
        other_photos: data.other_photos || [],

        // SEO fields
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        meta_keywords: data.meta_keywords || "",
        meta_photo: data.meta_photo || null,
      };

      console.log("Formatted data for API:", formattedData);

      setUploadProgress(30);

      // Call the API to create the product
      const response = await ProductsApi.create(formattedData as any);

      setUploadProgress(90);

      setUploadProgress(100);
      toast.success("تم إضافة المنتج بنجاح!");

      // Reload the products table
      reloadTable();

      setTimeout(() => {
        router.push("/stores/products");
      }, 500);
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast.error(
        error?.response?.data?.message || "فشل في إضافة المنتج. حاول مرة أخرى."
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const onInvalid = (errors: any) => {
    console.log("Validation errors:", errors);
    toast.error("يرجى ملء جميع الحقول المطلوبة بشكل صحيح");
  };

  const handleCancel = () => {
    router.push("/stores/products");
  };

  return (
    <div className="w-full" dir="rtl">
      <div className="max-w-8xl mx-auto p-6">
        {/* Page Header */}
        <h2 className="text-white text-lg font-semibold mb-6">
          إضافة منتج جديد
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
          >
            {/* Basic Info Card */}
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <LanguageTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                arabicContent={<ProductFormFields form={form} language="ar" />}
                englishContent={<ProductFormFields form={form} language="en" />}
              />
            </div>

            {/* Inventory Fields Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              الاعداد العام
            </h3>
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductInventoryFields form={form} />
            </div>

            {/* Pricing Fields Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              التسعير وغيرها
            </h3>

            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductPricingFields form={form} />
            </div>

            {/* Product Images Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              صور المنتج
            </h3>
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductImageUpload form={form} />
            </div>

            {/* Product Video URL Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              فيديو المنتج
            </h3>
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductVideoUrl form={form} />
            </div>

            {/* SEO Fields Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              قسم تحسين محركات البحث
            </h3>
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductSeoFields form={form} />
            </div>
            {/* Upload Progress Bar */}
            {isSubmitting && (
              <div className="mb-6 bg-gradient-to-r from-sidebar to-sidebar/80 border border-primary/30 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-white text-base font-medium">
                      جاري رفع البيانات...
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-2xl font-bold">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <div className="relative w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary via-primary/80 to-primary h-3 rounded-full transition-all duration-500 ease-out relative"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400 text-center">
                  {uploadProgress < 30 && "جاري تجهيز البيانات..."}
                  {uploadProgress >= 30 &&
                    uploadProgress < 90 &&
                    "جاري رفع البيانات إلى الخادم..."}
                  {uploadProgress >= 90 &&
                    uploadProgress < 100 &&
                    "جاري إتمام العملية..."}
                  {uploadProgress === 100 && "تم الحفظ بنجاح!"}
                </div>
              </div>
            )}
            {/* Action Buttons - Hidden during submission */}
            {!isSubmitting && (
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-6"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-primary hover:bg-primary/90"
                >
                  حفظ المنتج
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
