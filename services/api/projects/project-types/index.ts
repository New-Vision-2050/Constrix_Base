import {baseApi} from "@/config/axios/instances/base";
import {
    CreateSecondLevelProjectTypeArgs,
    CreateThirdLevelProjectTypeArgs,
    UpdateDataSettingsArgs,
    UpdateAttachmentContractSettingsArgs,
    UpdateAttachmentTermsContractSettingsArgs,
    UpdateContractorContractSettingsArgs,
    UpdateEmployeeContractSettingsArgs,
} from "./types/args";
import {
    CreateSecondLevelProjectTypeResponse,
    CreateThirdLevelProjectTypeResponse,
    GetDirectChildrenProjectTypesResponse,
    GetProjectTypeSchemasResponse,
    GetRootsProjectTypesResponse,
    GetDataSettingsResponse,
    UpdateDataSettingsResponse,
    GetAttachmentContractSettingsResponse,
    UpdateAttachmentContractSettingsResponse,
    GetAttachmentTermsContractSettingsResponse,
    UpdateAttachmentTermsContractSettingsResponse,
    GetContractorContractSettingsResponse,
    UpdateContractorContractSettingsResponse,
    GetEmployeeContractSettingsResponse,
    UpdateEmployeeContractSettingsResponse,
} from "./types/response";

export const ProjectTypesApi = {
    getRoots: () =>
        baseApi.get<GetRootsProjectTypesResponse>("project-types/roots"),
    getDirectChildren: (id: number | string) =>
        baseApi.get<GetDirectChildrenProjectTypesResponse>(
            `project-types/${id}/children`,
        ),
    getProjectTypeSchemas: (id: number | string) =>
        baseApi.get<GetProjectTypeSchemasResponse>(`project-types/${id}/schemas`),
    createSecondLevelProjectType: (args: CreateSecondLevelProjectTypeArgs) =>
        baseApi.post<CreateSecondLevelProjectTypeResponse>(
            `project-types/second-level`,
            args,
        ),
    createThirdLevelProjectType: (args: CreateThirdLevelProjectTypeArgs) =>
        baseApi.post<CreateThirdLevelProjectTypeResponse>(`project-types`, args),
    getDataSettings: (projectTypeId: number | string) =>
        baseApi.get<GetDataSettingsResponse>(
            `project-types/${projectTypeId}/data-settings`,
        ),
    updateDataSettings: (
        projectTypeId: number | string,
        args: UpdateDataSettingsArgs,
    ) =>
        baseApi.put<UpdateDataSettingsResponse>(
            `project-types/${projectTypeId}/data-settings`,
            args,
        ),
    getAttachmentContractSettings: (projectTypeId: number | string) =>
        baseApi.get<GetAttachmentContractSettingsResponse>(
            `project-types/${projectTypeId}/attachment-contract-settings`,
        ),
    updateAttachmentContractSettings: (
        projectTypeId: number | string,
        args: UpdateAttachmentContractSettingsArgs,
    ) =>
        baseApi.put<UpdateAttachmentContractSettingsResponse>(
            `project-types/${projectTypeId}/attachment-contract-settings`,
            args,
        ),
    getAttachmentTermsContractSettings: (projectTypeId: number | string) =>
        baseApi.get<GetAttachmentTermsContractSettingsResponse>(
            `project-types/${projectTypeId}/attachment-terms-contract-settings`,
        ),
    updateAttachmentTermsContractSettings: (
        projectTypeId: number | string,
        args: UpdateAttachmentTermsContractSettingsArgs,
    ) =>
        baseApi.put<UpdateAttachmentTermsContractSettingsResponse>(
            `project-types/${projectTypeId}/attachment-terms-contract-settings`,
            args,
        ),
    getContractorContractSettings: (projectTypeId: number | string) =>
        baseApi.get<GetContractorContractSettingsResponse>(
            `project-types/${projectTypeId}/contractor-contract-settings`,
        ),
    updateContractorContractSettings: (
        projectTypeId: number | string,
        args: UpdateContractorContractSettingsArgs,
    ) =>
        baseApi.put<UpdateContractorContractSettingsResponse>(
            `project-types/${projectTypeId}/contractor-contract-settings`,
            args,
        ),
    getEmployeeContractSettings: (projectTypeId: number | string) =>
        baseApi.get<GetEmployeeContractSettingsResponse>(
            `project-types/${projectTypeId}/employee-contract-settings`,
        ),
    updateEmployeeContractSettings: (
        projectTypeId: number | string,
        args: UpdateEmployeeContractSettingsArgs,
    ) =>
        baseApi.put<UpdateEmployeeContractSettingsResponse>(
            `project-types/${projectTypeId}/employee-contract-settings`,
            args,
        ),
};