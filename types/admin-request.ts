export type AdminRequestType =
  | "companyOfficialDataUpdate"
  | "companyLegalDataUpdate";

export type AdminRequestData = {
  name?: {
    ar: string;
  };
  country_id?: string;
  company_type_id?: string;
  company_field_id?: string;
};

export type RequestStatus = -1 | 0 | 1;

export type Attachment = {
  id: number;
  mime_type: string;
  name: string;
  type: string;
  url: string;
};

export type AdminRequest = {
  id: string;
  serial_number?: string;
  user_name: string;
  data: AdminRequestData;
  action: string;
  request_type: AdminRequestType;
  status: RequestStatus;
  notes: string;
  company_name: string;
  attachments: Attachment[];
  created_at: string;
};

export type AdminRequestResponse = {
  code: string;
  message: null | string;
  payload: AdminRequest[];
};
