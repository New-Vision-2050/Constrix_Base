export interface CompanyDashboardCategory {
    id: string;
    name: string;
    name_ar?: string;
    name_en?: string;
    category_type?: string;
    type?: string; // Keep for backward compatibility
    company_id?: string;
    created_at?: string;
    updated_at?: string;
}