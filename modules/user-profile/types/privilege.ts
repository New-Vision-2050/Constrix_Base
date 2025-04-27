export type Privilege = {
  id: string;
  name: string;
  type: string;
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
};
