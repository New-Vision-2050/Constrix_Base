export interface VacationPolicie {
    id: string;
    name: string;
    leave_type_id: string;
    leave_type_name?: string;
    leave_category_id?: string | null;
    leave_category_name?: string | null;
    is_deduct_from_balance: boolean | number;
    max_balance_days: number | null;
    total_days: number | null;
    min_notice_days: number | null;
    day_calculation_type: string | null;
    entitlement_type: string | null;
    entitlement_start_from: string | null;
    promotion_type: string | null;
    promotion_duration_months: number | null;
    is_rollover_allowed: boolean | number;
    rollover_duration_months: number | null;
    allow_exceed_balance: boolean | number;
    max_days: number | null;
}
