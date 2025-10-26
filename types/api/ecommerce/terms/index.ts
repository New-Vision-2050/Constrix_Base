export interface ECM_Terms {
  id: string;
  type: string;
  description: {
    ar: string;
    en: string;
  };
  created_at?: string;
  updated_at?: string;
}

export type TermsType = 
  | "terms_conditions"
  | "privacy_policy"
  | "refund_policy"
  | "return_policy"
  | "cancellation_policy"
  | "shipping_policy"
  | "about_us"
  | "company_reliability";
