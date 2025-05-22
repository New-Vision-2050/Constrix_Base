import { brokerFormConfig } from "@/modules/form-builder/configs/brokerFormConfig";
import { customerFormConfig } from "@/modules/form-builder/configs/customerFormConfig";
import { employeeFormConfig } from "@/modules/form-builder/configs/employeeFormConfig";
import { EmployeeTableConfig } from "@/modules/table/config/EmployeeTableConfig";
import { UsersConfig } from "@/modules/table/utils/configs/usersTableConfig";

export const REGISTRATION_FORMS_SLUGS = {
  EMPLOYEE: "employee",
  CLIENT: "client",
  BROKER: "broker",
};

export const REGISTRATION_FORMS = {
  [REGISTRATION_FORMS_SLUGS.EMPLOYEE]: employeeFormConfig,
  [REGISTRATION_FORMS_SLUGS.CLIENT]: customerFormConfig,
  [REGISTRATION_FORMS_SLUGS.BROKER]: brokerFormConfig,
};

export const REGISTRATION_TABLES = {
  [REGISTRATION_FORMS_SLUGS.EMPLOYEE]: EmployeeTableConfig,
  [REGISTRATION_FORMS_SLUGS.CLIENT]: UsersConfig,
  [REGISTRATION_FORMS_SLUGS.BROKER]: UsersConfig,
};
