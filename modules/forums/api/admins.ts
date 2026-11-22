import { forumClient, readList } from "./client";
import type { ForumAdmin, ForumAdminInput } from "../types";

export async function getAdmins(forumId: string) {
  const response = await forumClient.get(`/forums/${forumId}/admins`);
  return readList<ForumAdmin>(response);
}

/** Replaces the admin list. Company admins keep access regardless. */
export async function putAdmins(forumId: string, admins: ForumAdminInput[]) {
  await forumClient.put(`/forums/${forumId}/admins`, { admins });
}
