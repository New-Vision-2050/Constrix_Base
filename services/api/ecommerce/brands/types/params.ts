import { I18nField } from "@/types/common/args/I18nFIeld";

export interface CreateBrandParams {
  name: I18nField;
  description?: I18nField;
}

export interface UpdateBrandParams extends Partial<CreateBrandParams> {}
