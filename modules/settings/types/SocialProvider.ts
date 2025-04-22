import { FormConfig } from "@/modules/form-builder";

export type SocialProvider = {
  id: string;
  title: string;
  formConfig?: FormConfig;
};
