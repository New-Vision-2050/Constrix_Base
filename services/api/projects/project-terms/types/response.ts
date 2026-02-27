export interface CreateTermSettingResponse {
  code: string;
  message: string | null;
  payload: TermSetting;
}

export interface UpdateTermSettingResponse {
  code: string;
  message: string | null;
  payload: TermSetting;
}

export interface DeleteTermSettingResponse {
  code: string;
  message: string | null;
}

export interface TermService {
  id: number;
  name: string;
}

export interface GetTermServicesResponse {
  code: string;
  message: string | null;
  payload: TermService[];
}

export interface TermSetting {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  project_type_id: number | null;
  is_active: number;
  children_count: number;
  term_services_count: number;
  term_services?: TermService[];
  services?: TermService[];
  created_at: string;
  updated_at: string;
}

export interface GetTermSettingsResponse {
  code: string;
  message: string | null;
  pagination: {
    page: number;
    next_page: number;
    last_page: number;
    result_count: number;
  };
  payload: TermSetting[];
}
