import {baseApi} from "@/config/axios/instances/base";
import {
    CreateSecondLevelProjectTypeArgs,
    CreateSecondLevelProjectTypeByParentArgs,
    CreateThirdLevelProjectTypeArgs,
    UpdateSecondLevelProjectTypeArgs,
    UpdateThirdLevelProjectTypeArgs,
    UpdateDataSettingsArgs,
    UpdateAttachmentContractSettingsArgs,
    UpdateAttachmentTermsContractSettingsArgs,
    UpdateContractorContractSettingsArgs,
    UpdateEmployeeContractSettingsArgs,
    UpdateAttachmentCycleSettingsArgs,
} from "./types/args";
import {
    CreateSecondLevelProjectTypeResponse,
    CreateThirdLevelProjectTypeResponse,
    UpdateSecondLevelProjectTypeResponse,
    UpdateThirdLevelProjectTypeResponse,
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
    GetAttachmentCycleSettingsResponse,
    UpdateAttachmentCycleSettingsResponse,
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
    getProjectTypeSchemasV2: (id: number | string) =>
        baseApi.get<GetProjectTypeSchemasResponse>(`project-types/${id}/second-level-schemas`),
    createSecondLevelProjectType: (args: CreateSecondLevelProjectTypeArgs) =>
        baseApi.post<CreateSecondLevelProjectTypeResponse>(
            `project-types/second-level`,
            args,
        ),
    updateSecondLevelProjectType: (
        projectTypeId: number | string,
        args: UpdateSecondLevelProjectTypeArgs,
    ) =>
        baseApi.put<UpdateSecondLevelProjectTypeResponse>(
            `project-types/second-level/${projectTypeId}`,
            args,
        ),
    createSecondLevelProjectTypeByParent: (
        parentId: number | string,
        args: CreateSecondLevelProjectTypeByParentArgs,
    ) =>
        baseApi.post<CreateSecondLevelProjectTypeResponse>(
            `project-types/${parentId}/second-level-schemas`,
            args,
        ),
    createThirdLevelProjectType: (args: CreateThirdLevelProjectTypeArgs) =>
        baseApi.post<CreateThirdLevelProjectTypeResponse>(`project-types`, args),
    updateThirdLevelProjectType: (
        id: number | string,
        args: UpdateThirdLevelProjectTypeArgs,
    ) =>
        baseApi.put<UpdateThirdLevelProjectTypeResponse>(
            `project-types/${id}`,
            args,
        ),
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
    getAttachmentCycleSettings: (projectTypeId: number | string) =>
        baseApi.get<GetAttachmentCycleSettingsResponse>(
            `project-types/${projectTypeId}/attachment-cycle-settings`,
        ),
    updateAttachmentCycleSettings: (
        projectTypeId: number | string,
        args: UpdateAttachmentCycleSettingsArgs,
    ) =>
        baseApi.put<UpdateAttachmentCycleSettingsResponse>(
            `project-types/${projectTypeId}/attachment-cycle-settings`,
            args,
        ),
};