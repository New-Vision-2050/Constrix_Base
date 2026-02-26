import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface PriceOfferWidget {
  title: string;
  code: string;
  total: number;
  percentage: number;
}

export interface PriceOfferWidgetsResponse extends ApiBaseResponse<
  PriceOfferWidget[]
> {}

export type ClientRequestStatus =
  | "accepted"
  | "pending"
  | "rejected"
  | "draft";

export interface ClientRequestCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ClientRequestClient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ClientRequestType {
  id: number;
  name: string;
  type: string;
  is_active: boolean | null;
  created_at: string;
}

export interface ClientRequestReceiverFrom {
  id: number;
  name: string;
  type: string;
  is_active: boolean | null;
  created_at: string;
}

export interface ClientRequestService {
  id: number;
  name: string;
  type: string;
  is_active: boolean | null;
  created_at: string;
}

export interface ClientRequestEntity {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

export interface ClientRequest {
  id: string;
  company_id: string;
  client_request_type_id: number;
  client_request_receiver_from_id: number;
  client_type: string;
  client_id: string;
  content: string;
  status_client_request: ClientRequestStatus;
  client_price_offer_status: ClientRequestStatus;
  term_setting_id: string | null;
  branch_id: string | null;
  management_id: string | null;
  created_at: string;
  updated_at: string;
  company: ClientRequestCompany;
  client: ClientRequestClient;
  client_request_type: ClientRequestType;
  client_request_receiver_from: ClientRequestReceiverFrom;
  services: ClientRequestService[];
  term_setting: ClientRequestEntity | null;
  branch: ClientRequestEntity | null;
  management: ClientRequestEntity | null;
  attachments: unknown[];
}

export interface ListClientRequestsResponse extends ApiPaginatedResponse<
  ClientRequest[]
> {}
