export interface TermServiceSettingChild {
  id: number;
  name: string;
  description?: string;
  parent_id: number | null;
  is_active?: number;
  children: TermServiceSettingChild[];
}

export interface TermServiceSettingItem {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  children: TermServiceSettingChild[];
}

export interface GetTermServiceSettingsResponse {
  code: string;
  message: string | null;
  payload: TermServiceSettingItem[];
}