import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";
import {
  ProductTax,
  ProductDetail,
  ProductCustomField,
  ProductSeo,
} from "./params";

export interface Product {
  id: string;
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
  brand_id: string;
  sub_category_id?: string;
  type: "physical" | "digital";

  // Timestamps
  created_at: string;
  updated_at: string;

  // Relations (if included in response)
  category?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  warehouse?: {
    id: string;
    name: string;
  };

  // Additional data
  taxes: ProductTax[];
  details: ProductDetail[];
  custom_fields: ProductCustomField[];
  seo: ProductSeo;
  associated_products?: Product[];
}

export interface ListProductsResponse extends ApiPaginatedResponse<Product> {}

export interface ShowProductResponse extends ApiBaseResponse<Product> {}

export interface CreateProductResponse extends ApiBaseResponse<Product> {}

export interface UpdateProductResponse extends ApiBaseResponse<Product> {}

// Keep old names for backward compatibility
export interface ListCategoriesResponse extends ApiPaginatedResponse<Product> {}
export interface ShowCategoryResponse extends ApiBaseResponse<Product> {}
