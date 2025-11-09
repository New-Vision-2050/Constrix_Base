export interface ECM_Category {
  id: string;
  name: string;
  description?: string;
  parent?: ECM_CategoryParent | null;
  file?: {
    url: string;
  };
  priority?: number;
  name_ar?: string;
  name_en?: string;
}

export interface ECM_CategoryParent {
  id: string;
  name: string;
  parent?: Pick<ECM_Category, "id" | "name"> | null;
}
