import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface InfoAlertItem {
  id: string;
  name: string;
  end_date: string;
  entry_number: string;
  work_permit: string;
}

export interface ListInfoAlertResponse
  extends ApiPaginatedResponse<InfoAlertItem[]> {}

