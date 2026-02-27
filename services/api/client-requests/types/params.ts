export type ClientRequestStatusFilter =
  | "accepted"
  | "pending"
  | "rejected"
  | "draft";

export interface ClientRequestListParams {
  page?: number;
  per_page?: number;
  status_client_request?: ClientRequestStatusFilter;
  client_price_offer_status?: ClientRequestStatusFilter;
  client_request_type_id?: number;
  client_request_receiver_from_id?: number;
  client_type?: string;
  client_id?: string;
  content?: string;
  term_setting_id?: number | string;
  created_at_from?: string;
  created_at_to?: string;
}
