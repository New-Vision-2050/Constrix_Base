export interface ECM_Terms {
  id: string;
  type: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export type TermsType = 
  | "privacy_policy"
  | "terms_conditions"
  | "return_policy"
  | "shipping_policy"
  | "payment_policy"
  | "cancellation_policy"
  | "usage_policy"
  | "company_policy";
