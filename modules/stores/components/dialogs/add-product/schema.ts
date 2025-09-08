import { z } from "zod";

// Zod schema for product tax
export const productTaxSchema = z.object({
  country_id: z.number().min(1, "يجب اختيار الدولة"),
  tax_number: z.string().min(1, "رقم الضريبة مطلوب"),
  tax_percentage: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      "نسبة الضريبة يجب أن تكون بين 0 و 100"
    ),
  is_active: z.number().min(0).max(1),
});

// Zod schema for product detail
export const productDetailSchema = z.object({
  label: z.string().min(1, "التسمية مطلوبة"),
  value: z.string().min(1, "القيمة مطلوبة"),
});

// Zod schema for custom field
export const productCustomFieldSchema = z.object({
  field_name: z.string().min(1, "اسم الحقل مطلوب"),
  field_value: z.string().min(1, "قيمة الحقل مطلوبة"),
});

// Zod schema for SEO
export const productSeoSchema = z
  .object({
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    meta_keywords: z.string().optional(),
  })
  .optional();

// Main product schema
export const createProductSchema = z.object({
  name: z.string().min(1, "اسم المنتج مطلوب"),
  description: z.string().min(1, "وصف المنتج مطلوب"),
  price: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "السعر يجب أن يكون رقم موجب"
    ),
  sku: z.string().min(1, "رمز المنتج مطلوب"),
  stock: z.number().min(0, "الكمية لا يمكن أن تكون سالبة"),
  warehouse_id: z.string().min(1, "المستودع مطلوب"),
  requires_shipping: z.number().min(0).max(1),
  unlimited_quantity: z.number().min(0).max(1),
  is_taxable: z.number().min(0).max(1),
  price_includes_vat: z.number().min(0).max(1),
  vat_percentage: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      "نسبة الضريبة يجب أن تكون بين 0 و 100"
    ),
  is_visible: z.number().min(0).max(1),
  category_id: z.string().min(1, "الفئة مطلوبة"),
  brand_id: z.string().optional(),
  sub_category_id: z.string().optional(),
  type: z.enum(["physical", "digital"], {
    errorMap: () => ({ message: "نوع المنتج يجب أن يكون مادي أو رقمي" }),
  }),

  // Files
  main_image: z
    .any()
    .refine((file) => file instanceof File, "الصورة الرئيسية مطلوبة"),
  other_images: z.array(z.any()).optional(),

  // Arrays
  taxes: z.array(productTaxSchema).min(0),
  details: z.array(productDetailSchema).min(0),
  custom_fields: z.array(productCustomFieldSchema).min(0),

  // SEO
  seo: productSeoSchema,

  // Optional
  associated_product_ids: z.array(z.string()).optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
