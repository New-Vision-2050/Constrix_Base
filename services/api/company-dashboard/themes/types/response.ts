import { Theme } from "@/modules/content-management-system/themes/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

/**
 * API responses for themes
 */
export interface ListThemesResponse
  extends ApiPaginatedResponse<Theme[]> {}

export interface ShowThemeResponse
  extends ApiBaseResponse<Theme> {}

