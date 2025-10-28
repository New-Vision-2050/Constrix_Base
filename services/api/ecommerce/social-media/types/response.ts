import { ECM_SocialMedia } from "@/types/api/ecommerce/social-media";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListSocialMediaResponse extends ApiPaginatedResponse<ECM_SocialMedia[]> {}
export interface ShowSocialMediaResponse extends ApiBaseResponse<ECM_SocialMedia> {}
export interface CreateSocialMediaResponse extends ApiBaseResponse<ECM_SocialMedia> {}
export interface UpdateSocialMediaResponse extends ApiBaseResponse<ECM_SocialMedia> {}
export interface DeleteSocialMediaResponse extends ApiBaseResponse<null> {}
