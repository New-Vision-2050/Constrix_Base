import { forumClient, readList } from "./client";
import type { GroupMember, GroupMemberRole, SendSettingsBody } from "../types";

export async function getGroupMembers(forumId: string, groupId: string) {
  const response = await forumClient.get(
    `/forums/${forumId}/groups/${groupId}/members`,
  );
  return readList<GroupMember>(response);
}

export async function putGroupMembers(
  forumId: string,
  groupId: string,
  members: { user_id: string; role: GroupMemberRole }[],
) {
  await forumClient.put(`/forums/${forumId}/groups/${groupId}/members`, {
    members,
  });
}

export async function putSendSettings(
  forumId: string,
  groupId: string,
  body: SendSettingsBody,
) {
  await forumClient.put(
    `/forums/${forumId}/groups/${groupId}/send-settings`,
    body,
  );
}
