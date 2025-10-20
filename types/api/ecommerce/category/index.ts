export interface ECM_Category {
  id: string;
  name: string;
  description?: string;
  parent?: Pick<ECM_Category, "id" | "name"> | null;
  image?: string;
  priority?: number;
}
