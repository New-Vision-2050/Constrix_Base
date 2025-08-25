import { Branch } from "@/modules/company-profile/types/company";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  branches: Branch[];
  status: number;
  broker_id: string;
  company_name: string;
  company_representative_name: string;
  registration_number: string;
  residence: string;
  type: number;
  broker: { id: string; name: string };
}
