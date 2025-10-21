export interface ECM_Category {
  id: string;
  name: string;
  description?: string;
  parent?: ECM_CategoryParent | null;
  category_image?: string;
  priority?: number;
}

export interface ECM_CategoryParent {
  id: string;
  name: string;
  parent?: Pick<ECM_Category, "id" | "name"> | null;
}
