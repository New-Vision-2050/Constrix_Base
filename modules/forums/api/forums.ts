import {
  cleanParams,
  forumClient,
  hasFile,
  readList,
  readPayload,
  toFormData,
} from "./client";
import type {
  CreateForumBody,
  Forum,
  ForumDetails,
  ForumListParams,
  ForumListStats,
  UpdateForumBody,
} from "../types";

export async function getForums(params: ForumListParams) {
  const response = await forumClient.get("/forums", {
    params: cleanParams({ scope: "manage", ...params }),
  });
  return readList<Forum, ForumListStats>(response);
}

export async function getForum(forumId: string) {
  const response = await forumClient.get(`/forums/${forumId}`);
  return readPayload<ForumDetails>(response);
}

export async function createForum(body: CreateForumBody) {
  const { logo, ...rest } = body;
  const payload = hasFile(logo) ? toFormData({ ...rest, logo }) : rest;
  const response = await forumClient.post("/forums", payload);
  return readPayload<Forum>(response);
}

export async function updateForum(forumId: string, body: UpdateForumBody) {
  const { logo, ...rest } = body;
  const payload = hasFile(logo) ? toFormData({ ...rest, logo }) : rest;
  const response = await forumClient.post(`/forums/${forumId}`, payload);
  return readPayload<Forum>(response);
}

export async function archiveForum(forumId: string) {
  await forumClient.post(`/forums/${forumId}/archive`);
}

export async function restoreForum(forumId: string) {
  await forumClient.post(`/forums/${forumId}/restore`);
}
