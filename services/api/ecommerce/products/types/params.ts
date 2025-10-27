interface ProductTax {
  country_id: number;
  tax_number: string;
  tax_percentage: string;
  is_active: number;
}

interface ProductDetail {
  label: string;
  value: string;
}

interface ProductCustomField {
  field_name: string;
  field_value: string;
}

interface ProductSeo {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface CreateProductParams {
  name: string;
  description: string;
  price: string;
  sku: string;
  stock: number;
  warehouse_id: string;
  requires_shipping: number;
  unlimited_quantity: number;
  is_taxable: number;
  price_includes_vat: number;
  vat_percentage: string;
  is_visible: number;
  category_id: string;
  brand_id?: string;
  sub_category_id?: string;
  type: "physical" | "digital";

  // Files (images)
  main_image: File;
  other_images?: File[];

  // Tax information
  taxes?: ProductTax[];

  // Product details
  details: ProductDetail[];

  // Custom fields
  custom_fields?: ProductCustomField[];

  // SEO information
  seo?: ProductSeo;

  // Associated products (optional)
  associated_product_ids?: string[];
}

export interface UpdateProductParams extends Partial<CreateProductParams> {}
