export interface TermServiceSettingChild {
  id: number;
  name: string;
  description?: string;
  parent_id: number | null;
  project_type_id?: number | null;
  is_active?: number;
  children: TermServiceSettingChild[];
}

export interface TermServiceSettingItem {
  id: number;
  name: string;
  description?: string;
  parent_id?: number | null;
  project_type_id?: number | null;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
  children: TermServiceSettingChild[];
}

/** Response from GET term-settings/tree */
export interface TermSettingsTreeResponse {
  code: string;
  message: string | null;
  payload: TermServiceSettingItem[];
}

export interface GetTermServiceSettingsResponse {
  code: string;
  message: string | null;
  payload: TermServiceSettingItem[];
}