/**
 * Contract-settings API seam.
 *
 * Leave a value as "" until the backend route exists. Empty values are not
 * requested. Set the path (relative, like `/leave-policies`, or absolute)
 * and the screen starts using it.
 *
 * Leave summary GET payload:
 * { entitled, consumed, taken, system_ids: string[] }
 *
 * Leave systems GET payload (multi-select options):
 * [{ id, name }]
 *
 * Assign leaves POST body:
 * { user_id, leave_system_ids: string[] }
 *
 * Advance summary GET payload:
 * { entitled, consumed, taken, system_id: string }
 *
 * Advance systems GET payload (single-select options):
 * [{ id, name }]
 *
 * Assign advance POST body:
 * { user_id, advance_system_id: string }
 *
 * If the real payload uses different keys, change `responseFields` only.
 */
export const contractSettingsResponseFields = {
  entitled: "entitled",
  consumed: "consumed",
  taken: "taken",
  systemIds: "system_ids",
  systemId: "system_id",
} as const;

export const contractSettingsRequestFields = {
  userId: "user_id",
  leaveSystemIds: "leave_system_ids",
  advanceSystemId: "advance_system_id",
} as const;

export const contractSettingsApi = {
  leaveSummary: (_userId: string) => "",
  leaveSystems: "",
  assignLeaveSystems: "",
  advanceSummary: (_userId: string) => "",
  advanceSystems: "",
  assignAdvanceSystem: "",
};
