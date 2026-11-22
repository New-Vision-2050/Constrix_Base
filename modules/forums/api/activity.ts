import { cleanParams, forumClient, readList } from "./client";
import type { ActivityListParams, ActivityRow } from "../types";

export async function getActivity(
  forumId: string,
  params: ActivityListParams,
) {
  const response = await forumClient.get(`/forums/${forumId}/activity`, {
    params: cleanParams({ ...params }),
  });
  return readList<ActivityRow>(response);
}

/** `action` values the activity filter offers, in spec order. */
export const ACTIVITY_ACTIONS = [
  "forum.published",
  "forum.updated",
  "forum.archived",
  "forum.restored",
  "forum.admins_updated",
  "forum.members_updated",
  "group.created",
  "group.updated",
  "group.archived",
  "group.members_updated",
  "group.send_settings_updated",
  "announcement.published",
  "announcement.deleted",
  "report.resolved",
] as const;
