import { ROLE_Permission } from "@/types/api/roles/permission";
import { ApiBaseResponse } from "@/types/common/response/base";

export interface GetPermissionsLookupsResponse
  extends ApiBaseResponse<
    Record<
      string,
      Record<string, Record<string, (ROLE_Permission & { type: string })[]>>
    >
  > {}
