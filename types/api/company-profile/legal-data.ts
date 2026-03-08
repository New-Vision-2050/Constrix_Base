// Registration Type from API
export interface CP_RegistrationType {
  id: string;
  name: string;
  type: number;
  id_type: string;
}

// Legal Data Record
export interface CP_LegalDataRecord {
  id?: string | number;
  registration_type_id: string;
  // registration_type_type: string;
  registration_type?: string;
  registration_number?: string;
  start_date: string;
  end_date: string;
  file?: Array<{ url: string; [key: string]: any }>;
  files?: Array<File | { url: string; [key: string]: any }>;
}

// Create Legal Data Request
export interface CP_CreateLegalDataParams {
  registration_type_id: string;
  regestration_number?: string;
  start_date: string;
  end_date: string;
  files: File[];
}

// Update Legal Data Request
export interface CP_UpdateLegalDataParams {
  data: Array<{
    id?: string | number;
    start_date: string;
    end_date: string;
    file?: File[];
    files?: Array<{ url: string; [key: string]: any }>;
  }>;
}
