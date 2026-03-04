import { Attachment } from "@/types/admin-request";

export interface Pagination {
  last_page: number;
  result_count: number;
  current_page?: number;
  per_page?: number;
}

export interface ApiPayload<T> {
  payload: T;
  pagination?: Pagination;
}

export type ListClientRequestsResponse = ApiPayload<ClientRequestRow[]>;
export type ShowClientRequestResponse = ApiPayload<ClientRequestRow>;
export type CreateClientRequestResponse = ApiPayload<ClientRequestRow>;
export type GetRequestTypesResponse = ApiPayload<ClientRequestType[]>;
export type GetSourcesResponse = ApiPayload<ClientRequestReceiverFrom[]>;
export type GetServicesResponse = ApiPayload<ClientRequestService[]>;
export type GetClientsResponse = ApiPayload<Client[]>;
export type GetTermSettingsResponse = ApiPayload<TermSettingGroup[]>;
export type GetStatsResponse = ApiPayload<Record<string, number>>;

export interface TermSettingChild {
  id: number;
  name: string;
  description?: string;
  parent_id: number | null;
  is_active: number;
  children: TermSettingChild[];
}

export interface TermSettingGroup {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  children: TermSettingChild[];
}

export interface ClientRequestType {
  id: number;
  name: string;
  type?: string;
}

export interface ClientRequestReceiverFrom {
  id: number;
  name: string;
  type?: string;
}

export interface ClientRequestService {
  id: number;
  name: string;
  type?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface ClientRequestRow {
  id: string;
  serial_number: string;
  company_id: string;
  client_request_type_id: number;
  client_request_receiver_from_id: number;
  client_type: "individual" | "company";
  client_id: string;
  content: string | null;
  status_client_request: string;
  client_price_offer_status: string;
  term_setting_id: number | null;
  branch_id: string | null;
  management_id: string | null;
  created_at: string;
  updated_at: string;
  client: Client | null;
  client_request_type: ClientRequestType | null;
  client_request_receiver_from: ClientRequestReceiverFrom | null;
  services: ClientRequestService[];
  branch: { id: string; name: string } | null;
  management: { id: string; name: string } | null;
  financial_responsible: { id: string; name: string } | null;
  attachments: Attachment[];
}
