export type Privilege = {
  id: string;
  name: string;
  type: string;
};

export type SubscriptionFamilyMember = {
  id?: string;
  name: string;
  national_id: string;
  relation: string;
  amount: number;
  subscription_no?: string;
};

export type MedicalInsuranceSubscription = {
  id?: string;
  user_id?: string;
  medical_insurance_id: string;
  medical_insurance_category_id?: string;
  amount: number;
  subscription_no: string;
  subscription_type?: "individual" | "family";
  status?: number;
  medical_insurance?: { id: string; name: string; policy_number: string };
  medical_insurance_category?: {
    id: string;
    name: string;
    type?: string;
    coverage_limit?: number;
    description?: string;
  };
  family_members?: SubscriptionFamilyMember[];
};

export type UserPrivilege = {
  description: string;
  id: string;
  insurance_company: string;
  insurance_number: string;
  privilege: Privilege;
  rate: string;
  charge_amount: string;
  type_privilege: { id: string; name: string };
  type_allowance: { id: string; name: string };
  period: { id: string; name: string };
  period_id: string;
  type_allowance_code: string;
  type_privilege_id: string;
  medical_insurance_id?: string;
  medical_insurance?: { id: string; policy_number: string };
  subscriptions?: MedicalInsuranceSubscription[];
};
