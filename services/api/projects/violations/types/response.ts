export interface ProjectViolationCatalogItemDto {
  id: string;
  code?: string | null;
  description?: string | null;
  category?: string | null;
  weight?: string | number | null;
  actions?: string[] | null;
}

export interface ListProjectViolationsResponse {
  code?: string;
  message?: string | null;
  payload?: ProjectViolationCatalogItemDto[] | null;
  data?: ProjectViolationCatalogItemDto[] | null;
}

export function extractProjectViolationCatalog(
  response: ListProjectViolationsResponse | undefined,
): ProjectViolationCatalogItemDto[] {
  if (!response) return [];
  const raw = response.payload ?? response.data;
  return Array.isArray(raw) ? raw : [];
}
