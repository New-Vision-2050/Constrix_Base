import { FormConfig } from "@/modules/form-builder";

export type SmsProvider = {
  id: string;
  title: string;
  formConfig?: FormConfig;
};
