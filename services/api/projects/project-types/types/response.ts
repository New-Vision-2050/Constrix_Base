import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import { ApiBaseResponse } from "@/types/common/response/base";

export interface GetRootsProjectTypesResponse extends ApiBaseResponse<
  PRJ_ProjectType[]
> {}

export interface GetDirectChildrenProjectTypesResponse extends ApiBaseResponse<
  PRJ_ProjectType[]
> {}

export interface GetProjectTypeSchemasResponse extends ApiBaseResponse<
  PRJ_ProjectType[]
> {}

export interface CreateSecondLevelProjectTypeResponse extends ApiBaseResponse<PRJ_ProjectType> {}

export interface CreateThirdLevelProjectTypeResponse extends ApiBaseResponse<PRJ_ProjectType> {}
