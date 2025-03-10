import SetCompanyModule from "@/modules/companies/components/set-company";
import { CreateBuilderModuleT } from "../types/CreateBuilderModule";
import SetUserModule from "@/modules/users/components/set-user";
import CreateCompanyUserModule from "@/modules/companies/components/set-company-user";

export enum ModuleIdEnum {
  CREATE_USER = "create-user",
  CREATE_COMPANY = "create-company",
  CREATE_COMPANY_USER = "create-company-user",
  CREATE_MODULE3 = "create-module3",
  CREATE_MODULE4 = "create-module4",
  CREATE_MODULE5 = "create-module5",
}

export const MODULES_LIST: CreateBuilderModuleT[] = [
  {
    id: ModuleIdEnum.CREATE_USER,
    title: "Create User",
    formContent: <SetUserModule />,
  },
  {
    id: ModuleIdEnum.CREATE_COMPANY,
    title: "Create Company",
    formContent: (
      <>
        <SetCompanyModule />
      </>
    ),
  },
  {
    id: ModuleIdEnum.CREATE_COMPANY_USER,
    title: "",
    formContent: <CreateCompanyUserModule />,
  },
  {
    id: ModuleIdEnum.CREATE_MODULE3,
    title: "Create Module3",
    formContent: <div>Create Module3 Form</div>,
  },
  {
    id: ModuleIdEnum.CREATE_MODULE5,
    title: "Create Module5",
    formContent: <div>Create Module5 Form</div>,
  },
];
