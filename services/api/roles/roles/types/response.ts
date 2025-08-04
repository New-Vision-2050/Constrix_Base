import { ROLE_Permission } from "@/types/api/roles/permission";
import { ROLE_Role } from "@/types/api/roles/role";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListRolesResponse
  extends ApiPaginatedResponse<
    (ROLE_Role & { permissions: ROLE_Permission[] })[]
  > {}
