export interface CreateTermServiceSettingParams {
  name: string;
  term_setting_ids: number[];
  project_type_id?: number;
}

export interface UpdateTermServiceSettingParams {
  name: string;
  term_setting_ids: number[];
  project_type_id?: number;
}