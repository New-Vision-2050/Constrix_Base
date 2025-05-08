import { UserCompany } from '@/modules/dashboard/types/user-company'
import { Country } from '@/modules/settings/types/Country'
import { BankAccount } from './bank-account'
import { ProfessionalT } from '../components/tabs/user-contract/tabs/FunctionalAndContractualData/api/get-professinal-data'

// Define the user profile data type
export interface organizationTreeData {

  id: string;
  name: string;
  branch_count?: string | number;
  department_count?: string | number;
  management_count?: string | number;
  user_count?: string | number;
  manager_id?: string | number;
  parent_id?: string | number;
  type?: string
  manager?: {
    id?: string | number;
    name?: string | number;
    email?: string | number;
    phone?: string | number;
    photo?: string | number;
  };
  deputy_manager?: {
    id?: string | number;
    name?: string | number;
    email?: string | number;
    phone?: string | number;
    photo?: string | number;
  }
  children?: []
}

// Define the API response type
export interface organizationTreeResponse {
  data: organizationTreeData;
  status: number;
  message: string;
}
