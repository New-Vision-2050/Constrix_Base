export interface CreateCustomerRequestArgs {
  client_request_type_id: number;
  client_request_receiver_from_id: number;
  client_type: "individual" | "company";
  client_id: string;
  content?: string;
  status_client_request?: string;
  service_ids?: number[];
  term_setting_id?: number[];
  branch_id?: number;
  management_id?: number;
  attachments?: File[];
}

export interface UpdateCustomerRequestArgs
  extends Partial<CreateCustomerRequestArgs> {}

export interface CustomerRequestListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status_client_request?: string;
  client_request_type_id?: string | number;
  client_request_receiver_from_id?: string | number;
  client_type?: string;
  client_id?: string;
}
