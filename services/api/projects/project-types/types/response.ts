import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import { PRJ_ProjectTypeSchema } from "@/types/api/projects/project-type-schema";
import { ApiBaseResponse } from "@/types/common/response/base";

export interface GetRootsProjectTypesResponse extends ApiBaseResponse<
    PRJ_ProjectType[]
> {}

export interface GetDirectChildrenProjectTypesResponse extends ApiBaseResponse<
    PRJ_ProjectType[]
> {}

export interface GetProjectTypeSchemasResponse extends ApiBaseResponse<
    PRJ_ProjectTypeSchema[]
> {}

export interface CreateSecondLevelProjectTypeResponse extends ApiBaseResponse<PRJ_ProjectType> {}

export interface CreateThirdLevelProjectTypeResponse extends ApiBaseResponse<PRJ_ProjectType> {}

export interface DataSettings {
    id: number;
    project_type_id: number;
    is_reference_number: boolean;
    is_name_project: boolean;
    is_client: boolean;
    is_responsible_engineer: boolean;
    is_number_contract: boolean;
    is_central_cost: boolean;
    is_project_value: boolean;
    is_start_date: boolean;
    is_achievement_percentage: boolean;
    created_at: string;
    updated_at: string;
}

export interface GetDataSettingsResponse extends ApiBaseResponse<DataSettings> {}

export interface UpdateDataSettingsResponse extends ApiBaseResponse<DataSettings> {}

export interface AttachmentContractSettings {
    id: number;
    project_type_id: number;
    is_name: number;
    is_type: number;
    is_size: number;
    is_creator: number;
    is_create_date: number;
    is_downloadable: number;
    created_at: string;
    updated_at: string;
}

export interface AttachmentTermsContractSettings {
    id: number;
    project_type_id: number;
    is_name: number;
    is_type: number;
    is_size: number;
    is_creator: number;
    is_create_date: number;
    is_downloadable: number;
    created_at: string;
    updated_at: string;
}

export interface GetAttachmentContractSettingsResponse extends ApiBaseResponse<AttachmentContractSettings> {}

export interface UpdateAttachmentContractSettingsResponse extends ApiBaseResponse<AttachmentContractSettings> {}

export interface GetAttachmentTermsContractSettingsResponse extends ApiBaseResponse<AttachmentTermsContractSettings> {}

export interface UpdateAttachmentTermsContractSettingsResponse extends ApiBaseResponse<AttachmentTermsContractSettings> {}

export interface ContractorContractSettings {
    id: number;
    project_type_id: number;
    is_all_data_visible: number;
    created_at: string;
    updated_at: string;
}

export interface GetContractorContractSettingsResponse extends ApiBaseResponse<ContractorContractSettings> {}

export interface UpdateContractorContractSettingsResponse extends ApiBaseResponse<ContractorContractSettings> {}

export interface EmployeeContractSettings {
    id: number;
    project_type_id: number;
    is_all_data_visible: number;
    created_at: string;
    updated_at: string;
}

export interface GetEmployeeContractSettingsResponse extends ApiBaseResponse<EmployeeContractSettings> {}

export interface UpdateEmployeeContractSettingsResponse extends ApiBaseResponse<EmployeeContractSettings> {}