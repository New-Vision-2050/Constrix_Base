export interface CreateTermSettingArgs {
  name: string;
  description?: string;
  parent_id?: number | null;
  project_type_id?: number | null;
  term_services_ids?: number[];
}

export interface GetTermServicesArgs {
  // Add any query parameters if needed
}

export interface UpdateTermSettingArgs extends CreateTermSettingArgs {
  id: number;
}

export interface DeleteTermSettingArgs {
  id: number;
}

export interface GetTermSettingsArgs {
  page?: number;
  per_page?: number;
}
