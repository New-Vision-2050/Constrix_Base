export interface VacationPolicie {
    id: string;
    name: string;
    total_days: number;
    day_type: string;
    is_rollover_allowed: boolean;
    max_days_per_request: number;
    upgrade_condition: string;
    is_allow_half_day: boolean;
}
