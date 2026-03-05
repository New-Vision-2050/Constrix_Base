export interface TermSettingEntry {
  term_service_id: number;
  term_ids: number[];
}

export interface CreateClientRequestArgs {
  client_request_type_id: number;
  client_request_receiver_from_id: number;
  client_type: "individual" | "company";
  client_id: string;
  content?: string;
  status_client_request?: string;
  service_ids?: number[];
  term_setting_id?: TermSettingEntry[];
  branch_id?: number;
  management_id?: number;
  attachments?: File[];
  receiver_phone?: string;
  receiver_email?: string;
  receiver_employee_id?: string;
  receiver_broker_id?: string;
  receiver_broker_type?: "individual" | "company";
}

export interface UpdateClientRequestArgs extends Partial<CreateClientRequestArgs> {}

export interface ClientRequestListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status_client_request?: string;
  client_request_type_id?: string | number;
  client_request_receiver_from_id?: string | number;
  client_type?: string;
  client_id?: string;
}
