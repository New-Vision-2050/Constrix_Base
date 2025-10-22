"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/modules/table/components/ui/form";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProductFormFields from "../add/components/ProductFormFields";
import ProductInventoryFields from "../add/components/ProductInventoryFields";
import ProductPricingFields from "../add/components/ProductPricingFields";
import ProductImageUpload from "../add/components/ProductImageUpload";
import ProductVideoUrl from "../add/components/ProductVideoUrl";
import ProductSeoFields from "../add/components/ProductSeoFields";
import { ProductsApi } from "@/services/api/ecommerce/products";
import { useTableReload } from "@/modules/table/hooks/useTableReload";

// Product schema matching API requirements
const createProductSchema = (t: any) =>
  z.object({
    // Language-specific fields (using underscore instead of brackets for form state)
    name_ar: z.string().min(1, { message: t("product.validation.nameAr") }),
    name_en: z.string().min(1, { message: t("product.validation.nameEn") }),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),

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
    weight: z.string().optional(),
    unit: z.string().min(1, { message: t("product.validation.unit") }),
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
    shipping_amount: z.boolean().default(false),
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
  });

type ProductFormData = z.infer<ReturnType<typeof createProductSchema>>;

export default function EditProductView() {
  const params = useParams();
  const productId = params?.id as string;
  const t = useTranslations();
  const isRtl = useIsRtl();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("ar");
  const { reloadTable } = useTableReload("products-list-table");

  const productSchema = createProductSchema(t);

  // Fetch product data
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => ProductsApi.show(productId),
    enabled: !!productId,
  });

  const product = productData?.data?.payload;

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
      weight: "",
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
      shipping_amount: false,
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

  // Update form when product data is loaded
  React.useEffect(() => {
    if (product) {
      // Map countries array to country_ids array
      const countryIds =
        product.countries?.map((country: any) => country.id?.toString()) || [];

      form.reset({
        name_ar: product.name_ar || "",
        name_en: product.name_en || "",
        description_ar: product.description_ar || "",
        description_en: product.description_en || "",
        sku: product.sku || "",
        is_visible: product.is_visible === 1,
        category_id: product.category_id ? String(product.category_id) : "",
        sub_category_id: product.sub_category_id
          ? String(product.sub_category_id)
          : "",
        sub_sub_category_id: product.sub_sub_category_id
          ? String(product.sub_sub_category_id)
          : "",
        brand_id: product.brand_id ? String(product.brand_id) : "",
        country_ids: countryIds,
        type: product.type || "",
        warehouse_id: product.warehouse_id ? String(product.warehouse_id) : "",
        unit: product.unit || "",
        price: product.price != null ? product.price.toString() : "",
        currency: product.currency || "SAR",
        gender: product.gender || "",

        // Pricing fields
        min_order_quantity:
          product.min_order_quantity != null
            ? product.min_order_quantity.toString()
            : "",
        stock: product.stock != null ? product.stock.toString() : "",
        discount_type: product.discount_type || "percentage",
        discount_value:
          product.discount_value != null
            ? product.discount_value.toString()
            : "",
        vat_percentage:
          product.vat_percentage != null
            ? product.vat_percentage.toString()
            : "",
        price_includes_vat: product.price_includes_vat === 1,
        shipping_amount:
          product.shipping_amount === true ||
          product.shipping_amount === 1 ||
          false,
        shipping_included_in_price: product.shipping_included_in_price === true,

        // Video URL
        video_url: product.video_url || "",

        // Image fields - extract URL from API response
        main_photo: product.main_photo?.url || null,
        other_photos:
          product.other_photos?.map((photo: any) => photo.url) || [],

        // SEO fields
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
        meta_keywords: product.meta_keywords || "",
        meta_photo: product.meta_photo?.url || null,
      });
    }
  }, [product, form]);

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

      // Call the API to update the product
      const response = await ProductsApi.update(
        productId,
        formattedData as any
      );

      setUploadProgress(90);

      setUploadProgress(100);
      toast.success(t("product.dialog.edit.success"));

      // Reload the products table
      reloadTable();

      setTimeout(() => {
        router.push("/stores/products");
      }, 500);
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(
        error?.response?.data?.message || t("product.dialog.edit.error")
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const onInvalid = (errors: any) => {
    console.log("Validation errors:", errors);
    toast.error(
      t("product.validation.fillRequired") ||
        "يرجى ملء جميع الحقول المطلوبة بشكل صحيح"
    );
  };

  const handleCancel = () => {
    router.push("/stores/products");
  };

  if (isLoadingProduct) {
    return (
      <div
        className="w-full flex items-center justify-center min-h-[400px]"
        dir="rtl"
      >
        <p className="text-white">{t("product.placeholders.loading")}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="w-full flex items-center justify-center min-h-[400px]"
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-white text-lg mb-4">
            {t("product.messages.notFound") || "المنتج غير موجود"}
          </p>
          <Button onClick={() => router.push("/stores/products")}>
            {t("product.actions.backToList") || "العودة إلى القائمة"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" dir="rtl">
      <div className="max-w-8xl mx-auto p-6">
        {/* Page Header */}
        <h2 className="text-white text-lg font-semibold mb-6">
          {t("product.dialog.edit.title")}
        </h2>

        {/* Upload Progress Bar */}
        {isSubmitting && (
          <div className="mb-6 bg-gradient-to-r from-sidebar to-sidebar/80 border border-primary/30 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-white text-base font-medium">
                  {t("product.messages.updating") || "جاري تحديث البيانات..."}
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
              {uploadProgress < 30 &&
                (t("product.messages.preparing") || "جاري تجهيز البيانات...")}
              {uploadProgress >= 30 &&
                uploadProgress < 90 &&
                (t("product.messages.uploading") ||
                  "جاري رفع البيانات إلى الخادم...")}
              {uploadProgress >= 90 &&
                uploadProgress < 100 &&
                (t("product.messages.completing") || "جاري إتمام العملية...")}
              {uploadProgress === 100 &&
                (t("product.messages.updateSuccess") || "تم التحديث بنجاح!")}
            </div>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
          >
            {/* Basic Info Card */}
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
                dir="rtl"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-sidebar">
                  <TabsTrigger value="ar" className="text-sm">
                    {t("labels.arabic") || "اللغة العربية (AR)"}
                  </TabsTrigger>
                  <TabsTrigger value="en" className="text-sm">
                    {t("labels.english") || "اللغة الإنجليزية (EN)"}
                  </TabsTrigger>
                </TabsList>

                {/* Arabic Tab */}
                <TabsContent value="ar" className="space-y-6">
                  <ProductFormFields form={form} language="ar" />
                </TabsContent>

                {/* English Tab */}
                <TabsContent value="en" className="space-y-6">
                  <ProductFormFields form={form} language="en" />
                </TabsContent>
              </Tabs>
            </div>

            {/* Inventory Fields Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              {t("product.sections.generalSettings") || "الاعداد العام"}
            </h3>
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductInventoryFields form={form} />
            </div>

            {/* Pricing Fields Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              {t("product.sections.pricingAndOthers") || "التسعير وغيرها"}
            </h3>

            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductPricingFields form={form} />
            </div>

            {/* Product Images Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              {t("product.sections.productImages") || "صور المنتج"}
            </h3>
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductImageUpload form={form} />
            </div>

            {/* Product Video URL Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              {t("product.sections.productVideo") || "فيديو المنتج"}
            </h3>
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductVideoUrl form={form} />
            </div>

            {/* SEO Fields Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              {t("product.sections.seoSection") || "قسم تحسين محركات البحث"}
            </h3>
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductSeoFields form={form} />
            </div>

            {/* Action Buttons - Hidden during submission */}
            {!isSubmitting && (
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-6"
                >
                  {t("product.dialog.actions.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-primary hover:bg-primary/90"
                >
                  {t("product.actions.updateProduct") || "تحديث المنتج"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
