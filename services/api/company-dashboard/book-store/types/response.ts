export interface BookStoreBookDto {
  id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  author?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  created_at?: string;
  updated_at?: string;
}

import type { ApiBaseResponse } from "@/types/common/response/base";
import type { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListBooksResponse
  extends ApiPaginatedResponse<BookStoreBookDto[]> {}

export interface ShowBookResponse extends ApiBaseResponse<BookStoreBookDto> {}
