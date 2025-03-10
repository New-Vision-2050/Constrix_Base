import { Company } from "../types/Company";

// ! This declaration of User must be in users domain so when users domain created move this to there
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
