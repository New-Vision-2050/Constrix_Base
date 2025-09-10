import { z } from "zod";
import { getSchemaTranslation } from "./utils/schema-translations";

// Helper function to get translation messages
const t = (key: string) => getSchemaTranslation(key);

// Zod schema for product tax
export const productTaxSchema = z.object({
  country_id: z.number().min(1, t("product.validation.taxes.country.required")),
  tax_number: z
    .string()
    .min(1, t("product.validation.taxes.taxNumber.required")),
  tax_percentage: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      t("product.validation.taxes.taxPercentage.range")
    ),
  is_active: z.number().min(0).max(1),
});

// Zod schema for product detail
export const productDetailSchema = z.object({
  label: z.string().min(1, t("product.validation.details.label.required")),
  value: z.string().min(1, t("product.validation.details.value.required")),
});

// Zod schema for custom field
export const productCustomFieldSchema = z.object({
  field_name: z
    .string()
    .min(1, t("product.validation.customFields.fieldName.required")),
  field_value: z
    .string()
    .min(1, t("product.validation.customFields.fieldValue.required")),
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
  name: z.string().min(1, t("product.validation.name.required")),
  description: z.string().min(1, t("product.validation.description.required")),
  price: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      t("product.validation.price.required")
    ),
  sku: z.string().min(1, t("product.validation.sku.required")),
  stock: z.number().min(0, t("product.validation.stock.negative")),
  warehouse_id: z.string().min(1, t("product.validation.warehouse.required")),
  requires_shipping: z.number().min(0).max(1),
  unlimited_quantity: z.number().min(0).max(1),
  is_taxable: z.number().min(0).max(1),
  price_includes_vat: z.number().min(0).max(1),
  vat_percentage: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      t("product.validation.vatPercentage.range")
    ),
  is_visible: z.number().min(0).max(1),
  category_id: z.string().min(1, t("product.validation.category.required")),
  brand_id: z.string().optional(),
  sub_category_id: z.string().optional(),
  type: z.enum(["physical", "digital"], {
    errorMap: () => ({ message: t("product.validation.type.invalid") }),
  }),

  // Files
  main_image: z
    .any()
    .refine(
      (file) => file instanceof File,
      t("product.validation.mainImage.required")
    ),
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
