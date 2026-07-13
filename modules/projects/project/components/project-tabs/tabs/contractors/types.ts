export interface ContractorRow {
  id: string;
  name: string;
  type: string;
  commercialRegister: string;
  taxId: string;
  mobile: string;
  email: string;
  primaryContact: string;
  classification: string;
  status: "active" | "inactive";
}
