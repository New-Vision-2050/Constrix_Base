/** Company / resource ref as returned on project share list rows. */
export type ProjectShareEntityRef = {
  id: string;
  name: string;
  serial_number: string | null;
};

/** Recipient company may include contact fields from the list API. */
export type ProjectShareRecipientRef = ProjectShareEntityRef & {
  email?: string;
  phone?: string;
};

export type ProjectShareActorRef = {
  id: string;
  name: string;
};

/** Row shape aligned with `projects/sharing/list` payload. */
export interface ProjectShareRow {
  id: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
  owner_company: ProjectShareEntityRef | null;
  relation: string | null;
  responded_at: string | null;
  responded_by: ProjectShareActorRef | null;
  role: string | null;
  schema_ids: number[];
  shareable: ProjectShareEntityRef | null;
  shareable_id: string;
  shareable_type: string;
  shared_by: ProjectShareActorRef | null;
  shared_with_company: ProjectShareRecipientRef | null;
  status: string;
  type: string | null;
}
