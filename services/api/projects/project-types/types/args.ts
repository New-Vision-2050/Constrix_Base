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
