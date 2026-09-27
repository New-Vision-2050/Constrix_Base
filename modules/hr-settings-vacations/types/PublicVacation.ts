export interface PublicHolidayDay {
  id: string;
  date: string;
  is_compensation: boolean;
}

export interface PublicVacation {
  id: string;
  name: string;
  branch_id: number | string | null;
  date_start: string;
  date_end: string;
  year?: number | string | null;
  is_recurring?: boolean;
  count_days?: number | null;
  days?: PublicHolidayDay[];
  branch?: {
    id: number | string;
    name: string;
  } | null;
}

export interface PublicHolidayBranchCard {
  branch_id: number | string;
  name: string;
  years: number[];
}
