export interface CreateCategoryParams {
  "name[ar]": string;
  "name[en]": string;
  description?: string;
  parent_id?: string;
  priority?: number;
  category_image?: File | null;
}

export interface UpdateCategoryParams {
  "name[ar]"?: string;
  "name[en]"?: string;
  description?: string;
  parent_id?: string;
  priority?: number;
  category_image?: File | null;
}
