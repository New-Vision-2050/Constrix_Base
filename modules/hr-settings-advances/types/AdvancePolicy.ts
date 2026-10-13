export interface AdvancePolicy {
  id: string;
  name: string;
  max_amount: number;
  min_amount?: number | null;
  max_installments: number;
  max_active_advances: number;
  requires_attachment: boolean | number;
  entitlement_start_from?: string | null;
  entitlement_after_months?: number | null;
  is_repayable?: boolean | number;
  repayment_system?: string | null;
  repayment_method?: string | null;
  termination_action?: string | null;
  created_at?: string;
}
