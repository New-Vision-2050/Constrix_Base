export interface CreateTermSettingArgs {
  name: string;
  description?: string;
  parent_id?: number | null;
  project_type_id?: number | null;
  term_services_ids?: number[];
}

export interface GetTermServicesArgs {
  page?: number;
  per_page?: number;
}

export interface UpdateTermSettingArgs {
  name: string;
  description?: string;
  parent_id?: number | null;
  project_type_id?: number | null;
  term_services_ids?: number[];
}

export interface DeleteTermSettingArgs {
  id: number;
}

export interface GetTermSettingsArgs {
  page?: number;
  per_page?: number;
}
