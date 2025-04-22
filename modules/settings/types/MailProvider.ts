import { FormConfig } from "@/modules/form-builder";

export type MailProvider = {
  id: string;
  title: string;
  iconSrc: string;
  formConfig?: FormConfig;
};
