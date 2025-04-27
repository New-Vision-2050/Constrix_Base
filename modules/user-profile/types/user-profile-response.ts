import { UserCompany } from "@/modules/dashboard/types/user-company";
import { Country } from "@/modules/settings/types/Country";
import { BankAccount } from "./bank-account";
import { ProfessionalT } from "../components/tabs/user-contract/tabs/FunctionalAndContractualData/api/get-professinal-data";

// Define the user profile data type
export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  job_title?: string;
  address?: string;
  date_appointment?: string;
  stats?: {
    workingHours?: number;
    completedTasks?: number;
    pendingTasks?: number;
  };
  // Add any other fields that might be needed
  image_url: string;
  country?: Country;
  company?: UserCompany;
  global_id?: string;
  user_id?: string;
  bank_account?: BankAccount;
  Job_role?: string;
  address_attendance?: string;
  border_number?: string;
  branch?: string;
  // companies:Company
  data_status?: string;
  identity?: string;
  job_title_id?: string;
  other_phone?: string;
  passport?: string;
  phone?: string;
  residence?: string;
  user_professional_data?: ProfessionalT;
}

// Define the API response type
export interface UserProfileResponse {
  data: UserProfileData;
  status: number;
  message: string;
}
