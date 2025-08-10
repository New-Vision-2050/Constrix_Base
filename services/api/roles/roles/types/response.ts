import { ROLE_Permission } from "@/types/api/roles/permission";
import { ROLE_Role } from "@/types/api/roles/role";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListRolesResponse
  extends ApiPaginatedResponse<
    (ROLE_Role & { permissions: ROLE_Permission[]; permission_count: number })[]
  > {}

export interface ShowRoleResponse
  extends ApiBaseResponse<
    ROLE_Role & {
      permissions: Record<
        string,
        Record<
          string,
          Record<string, (ROLE_Permission & { is_active: boolean })[]>
        >
      >;
    }
  > {}
