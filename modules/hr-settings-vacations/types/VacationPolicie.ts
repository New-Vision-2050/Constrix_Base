export interface VacationPolicie {
    id: string;
    name: string;
    total_days: number;
    day_type: string;
    is_rollover_allowed: boolean;
    max_days_per_request: number;
    upgrade_condition: string;
    is_allow_half_day: boolean;
    leave_type_id?: string | number;
    max_balance_days?: number;
    min_notice_days?: number;
    accrual_type?: string;
    accrual_start?: string;
    upgrade_type?: string;
    upgrade_after_months?: number;
    rollover_months?: number;
    allow_exceed_balance?: boolean;
    notes?: string;
}
