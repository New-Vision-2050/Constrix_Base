import { cleanParams, forumClient, readList } from "./client";
import type {
  ForumMember,
  ForumMemberListParams,
  GroupMemberRole,
} from "../types";

export async function getForumMembers(
  forumId: string,
  params: ForumMemberListParams,
) {
  const response = await forumClient.get(`/forums/${forumId}/members`, {
    params: cleanParams({ ...params }),
  });
  return readList<ForumMember>(response);
}

/** Replaces the whole member list of the forum. */
export async function putForumMembers(forumId: string, memberIds: string[]) {
  await forumClient.put(`/forums/${forumId}/members`, {
    member_ids: memberIds,
  });
}

/** Replaces one employee's group memberships inside this forum. */
export async function putMemberGroups(
  forumId: string,
  userId: string,
  groups: { group_id: string; role: GroupMemberRole }[],
) {
  await forumClient.put(`/forums/${forumId}/members/${userId}/groups`, {
    groups,
  });
}
