export type ShareProjectPayload = {
    project_id: string;
    company_serial_number: string;
    schema_ids: number[];
    notes?: string;
  };