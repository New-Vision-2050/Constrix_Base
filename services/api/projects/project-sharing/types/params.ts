export type ShareProjectPayload = {
  project_id: string;
  company_serial_number: string;
  schema_ids: number[];
  notes?: string;
};

/** POST `projects/sharing/invitations/respond` — inbox accept / reject. */
export type ShareInvitationRespondPayload = {
  share_id: string;
  action: "accept" | "reject";
  /** Optional — sent only when non-empty if the API supports it. */
  comment?: string;
};