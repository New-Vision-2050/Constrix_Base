import { Media } from "@/modules/docs-library/modules/publicDocs/types/Directory";

export interface ECM_Category {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  parent?: ECM_CategoryParent | null;
  category_image?: string;
  priority?: number;
  file?: Media;
}

export interface ECM_CategoryParent {
  id: string;
  name: string;
  parent?: Pick<ECM_Category, "id" | "name"> | null;
}
