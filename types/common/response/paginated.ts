import { ApiBaseResponse } from "./base";

export interface ApiPaginatedResponse<T> extends ApiBaseResponse<T> {
  pagination: ApiPagination;
}

export interface ApiPagination {
  page: number;
  next_page: number;
  last_page: number;
  result_count: number;
}
