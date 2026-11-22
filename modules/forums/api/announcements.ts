import { cleanParams, forumClient, readList, readPayload, toFormData } from "./client";
import type {
  Announcement,
  AnnouncementBody,
  AnnouncementListParams,
  AnnouncementStats,
} from "../types";

/**
 * The dashboard surfaces announcements as a company-wide channel, so these calls
 * use the unscoped `forum/announcements` routes. Anything created there is stored
 * on the company's first forum.
 */
export async function getAnnouncements(params: AnnouncementListParams) {
  const response = await forumClient.get("/announcements", {
    params: cleanParams({ ...params }),
  });
  return readList<Announcement, AnnouncementStats>(response);
}

export async function getAnnouncement(id: string) {
  const response = await forumClient.get(`/announcements/${id}`);
  return readPayload<Announcement>(response);
}

export async function createAnnouncement(body: AnnouncementBody) {
  const { attachments, ...rest } = body;
  const response = await forumClient.post(
    "/announcements",
    toFormData({ ...rest, attachments }),
  );
  return readPayload<Announcement>(response);
}

export async function updateAnnouncement(id: string, body: AnnouncementBody) {
  const { attachments, ...rest } = body;
  const response = await forumClient.post(
    `/announcements/${id}`,
    toFormData({ ...rest, attachments }),
  );
  return readPayload<Announcement>(response);
}

export async function deleteAnnouncement(id: string) {
  await forumClient.delete(`/announcements/${id}`);
}
