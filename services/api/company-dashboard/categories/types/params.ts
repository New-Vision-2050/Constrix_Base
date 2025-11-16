export interface CreateCategoryParams {
  "name[ar]": string;
  "name[en]": string;
  type: string;
}

export interface UpdateCategoryParams {
  "name[ar]"?: string;
  "name[en]"?: string;
  type?: string;
}

