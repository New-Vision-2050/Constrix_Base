import { brokerFormConfig } from "@/modules/form-builder/configs/brokerFormConfig";
import { customerFormConfig } from "@/modules/form-builder/configs/customerFormConfig";
import { employeeFormConfig } from "@/modules/form-builder/configs/employeeFormConfig";

export const REGISTRATION_FORMS_SLUGS = {
  EMPLOYEE: "employee",
  CUSTOMER: "customer",
  RESELLER: "reseller",
};

export const REGISTRATION_FORMS = {
  [REGISTRATION_FORMS_SLUGS.EMPLOYEE]: employeeFormConfig,
  [REGISTRATION_FORMS_SLUGS.CUSTOMER]: customerFormConfig,
  [REGISTRATION_FORMS_SLUGS.RESELLER]: brokerFormConfig,
};
