export interface CreateProjectContractorRepresentativeArgs {
  name: string;
  mobile: string;
  nationality: string;
}

export interface CreateProjectContractorArgs {
  name: string;
  tax_card: string;
  commercial_register: string;
  activity: string;
  email: string;
  country_id: string;
  project_contractor_id: string;
  project_manager_name: string;
  project_manager_phone: string;
  project_manager_nationality: string;
  project_manager_email: string;
  representatives: CreateProjectContractorRepresentativeArgs[];
}

export type UpdateProjectContractorArgs = CreateProjectContractorArgs;
