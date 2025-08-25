import { Branch } from "@/modules/company-profile/types/company";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  branches: Branch[];
  status: number;
}
