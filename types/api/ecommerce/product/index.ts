import { MediaFile } from "@/types/media-file";
import { ECM_Category } from "../category";
import { ECM_Tax } from "../tax";

export interface ECM_Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: any;
  warehouse_id: string;
  requires_shipping: number;
  unlimited_quantity: number;
  is_taxable: number;
  price_includes_vat: number;
  vat_percentage: any;
  is_visible: number;
  category?: ECM_Category;
  brand: any;
  type: string;
  taxes?: ECM_Tax[];
  details: any[];
  custom_fields: any[];
  seo: any;
  associated_product: any[];
  main_image?: MediaFile;
  other_images: any[];
}
