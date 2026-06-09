export interface ListReportsParams {
  page: number;
  per_page: number;
  date_from?: string;
  date_to?: string;
  status?: string;
}

export interface ListReportTemplatesParams {
  page: number;
  per_page: number;
}
