import { baseApi } from "@/config/axios/instances/base";

import type { CreateBookParams, UpdateBookParams } from "./types/params";
import type { ListBooksResponse, ShowBookResponse } from "./types/response";

/**
 * CMS BookStore API
 *
 * Endpoint assumption: `website-book-store`
 * (If your backend uses a different path, change it here and in the table config.)
 */
export const CompanyDashboardBookStoreApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) =>
    baseApi.get<ListBooksResponse>("website-book-store", {
      params,
    }),

  show: (id: string) =>
    baseApi.get<ShowBookResponse>(`website-book-store/${id}`),

  create: (body: CreateBookParams) => baseApi.post("website-book-store", body),

  update: (id: string, body: UpdateBookParams) =>
    baseApi.put(`website-book-store/${id}`, body),

  delete: (id: string) => baseApi.delete(`website-book-store/${id}`),
};
