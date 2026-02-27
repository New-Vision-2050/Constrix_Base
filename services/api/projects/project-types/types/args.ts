export interface CreateSecondLevelProjectTypeArgs {
  name: string;
  icon: string;
  parent_id: number;
  reference_project_type_id: null | number;
  schema_ids: number[];
  is_active: boolean;
}

export interface CreateThirdLevelProjectTypeArgs {
  name: string;
  icon: string;
  parent_id: number;
  is_have_schema: boolean;
  is_active: boolean;
}

export interface UpdateDataSettingsArgs {
  is_reference_number?: 0 | 1;
  is_name_project?: 0 | 1;
  is_client?: 0 | 1;
  is_responsible_engineer?: 0 | 1;
  is_number_contract?: 0 | 1;
  is_central_cost?: 0 | 1;
  is_project_value?: 0 | 1;
  is_start_date?: 0 | 1;
  is_achievement_percentage?: 0 | 1;
}

export interface UpdateAttachmentContractSettingsArgs {
  is_name?: 0 | 1;
  is_type?: 0 | 1;
  is_size?: 0 | 1;
  is_creator?: 0 | 1;
  is_create_date?: 0 | 1;
  is_downloadable?: 0 | 1;
}

export interface UpdateAttachmentTermsContractSettingsArgs {
  is_name?: 0 | 1;
  is_type?: 0 | 1;
  is_size?: 0 | 1;
  is_creator?: 0 | 1;
  is_create_date?: 0 | 1;
  is_downloadable?: 0 | 1;
}

export interface UpdateContractorContractSettingsArgs {
  is_all_data_visible?: 0 | 1;
}

export interface UpdateEmployeeContractSettingsArgs {
  is_all_data_visible?: 0 | 1;
}