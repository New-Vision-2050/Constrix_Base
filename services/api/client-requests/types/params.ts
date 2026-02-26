export interface ClientRequestListParams {
  page?: number;
  per_page?: number;
  status_client_request?: "accepted" | "pending" | "rejected" ;
  client_request_type_id?: number;
  client_request_receiver_from_id?: number;
  client_type?: string;
  client_id?: number;
  content?: string;
  term_setting_id?: number;
}
