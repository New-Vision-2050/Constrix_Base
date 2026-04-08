export type ProjectShareRequestStatus = "pending" | "approved" | "rejected";

export interface ProjectShareRow {
  id: string;
  companyName: string;
  email: string;
  mobile: string;
  representative: string;
  status: ProjectShareRequestStatus;
}
