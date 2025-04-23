import { UserCompany } from "@/modules/dashboard/types/user-company";
import { Country } from "@/modules/settings/types/Country";
import { BankAccount } from "./bank-account";

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
}

// Define the API response type
export interface UserProfileResponse {
  data: UserProfileData;
  status: number;
  message: string;
}
