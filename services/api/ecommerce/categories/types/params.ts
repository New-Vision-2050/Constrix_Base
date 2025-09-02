import { I18nField } from "@/types/common/args/I18nFIeld";

export interface CreateCategoryParams {
  name: I18nField;
  description?: I18nField;
}

export interface UpdateCategoryParams extends Partial<CreateCategoryParams> {}
