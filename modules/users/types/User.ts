import { Company } from "../../companies/types/Company";

export interface User {
  border_number: string;
  company: Company;
  email: string;
  id: string;
  identity: string;
  name: string;
  passport: string;
  phone: string;
  residence: string;
}

export interface CreateUserI {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  companyId?: string;
  countryCode?: string;
}
