import { MediaFile } from "@/types/media-file";

export interface ECM_Brand {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  brand_image?: string;
  file?: MediaFile;
}
