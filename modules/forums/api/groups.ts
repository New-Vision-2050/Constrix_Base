import {
  cleanParams,
  forumClient,
  hasFile,
  readList,
  readPayload,
  toFormData,
} from "./client";
import type {
  ForumGroup,
  GroupBody,
  GroupListParams,
  GroupStats,
} from "../types";

export async function getGroups(forumId: string, params: GroupListParams) {
  const response = await forumClient.get(`/forums/${forumId}/groups`, {
    params: cleanParams({ ...params }),
  });
  return readList<ForumGroup, GroupStats>(response);
}

export async function createGroup(forumId: string, body: GroupBody) {
  const { icon, ...rest } = body;
  const payload = hasFile(icon) ? toFormData({ ...rest, icon }) : rest;
  const response = await forumClient.post(`/forums/${forumId}/groups`, payload);
  return readPayload<ForumGroup>(response);
}

export async function updateGroup(
  forumId: string,
  groupId: string,
  body: GroupBody,
) {
  const { icon, ...rest } = body;
  const payload = hasFile(icon) ? toFormData({ ...rest, icon }) : rest;
  const response = await forumClient.post(
    `/forums/${forumId}/groups/${groupId}`,
    payload,
  );
  return readPayload<ForumGroup>(response);
}

export async function archiveGroup(forumId: string, groupId: string) {
  await forumClient.post(`/forums/${forumId}/groups/${groupId}/archive`);
}

export async function restoreGroup(forumId: string, groupId: string) {
  await forumClient.post(`/forums/${forumId}/groups/${groupId}/restore`);
}

export async function deleteGroup(forumId: string, groupId: string) {
  await forumClient.delete(`/forums/${forumId}/groups/${groupId}`);
}
