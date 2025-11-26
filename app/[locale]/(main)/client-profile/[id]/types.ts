import { Branch } from "@/modules/user-profile/types/branch";


export interface UserRoleType {
    id: string;
    company_id: string;
    global_company_user_id: string;
    role: string; // 1: client, 2: broker, 3: employee
    status: string;
}

export interface ClientProfileData {
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
    user_types?: UserRoleType[];
}