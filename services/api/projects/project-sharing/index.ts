import { baseApi } from "@/config/axios/instances/base";
import {
  CompanyLookupResponse,
  ListProjectSharesResponse,
  PendingInvitationsResponse,
  ShareProjectResponse,
} from "./types/response";
import {
  ShareInvitationRespondPayload,
  ShareProjectPayload,
} from "./types/params";


/** Response payload when resolving a company by serial number (adjust fields to match your API). */




export const ProjectSharingApi = {
  share: (body: ShareProjectPayload) =>
    baseApi.post<ShareProjectResponse>("projects/sharing/share", body),

  /** List assignments for a project (backend: GET with `project_id`). */
  listForProject: (projectId: string) =>
    baseApi.get<ListProjectSharesResponse>(`projects/sharing/projects/${projectId}/shares`, {
      params: { project_id: projectId },
    }),

  getCompanyBySerial: (serial: string) =>
    baseApi.get<CompanyLookupResponse>("companies/by-serial-number", {
      params: { serial_number: serial.trim() },
    }),

  /** Pending invitations where other companies shared projects with the current company. */
  getPendingInvitations: () =>
    baseApi.get<PendingInvitationsResponse>(
      "projects/sharing/invitations/pending",
    ),

  /**
   * Inbox: respond to a pending share (accept or reject).
   * Body: `{ share_id, action }` — matches Postman `invitations/respond`.
   */
  respondToShareInvitation: (body: ShareInvitationRespondPayload) => {
    const payload: ShareInvitationRespondPayload = {
      share_id: body.share_id.trim(),
      action: body.action,
    };
    const c = body.comment?.trim();
    if (c) payload.comment = c;
    return baseApi.post<ShareProjectResponse>(
      "projects/sharing/invitations/respond",
      payload,
    );
  },

  acceptInvitation: (shareId: string, options?: { comment?: string }) =>
    ProjectSharingApi.respondToShareInvitation({
      share_id: shareId,
      action: "accept",
      comment: options?.comment,
    }),

  rejectInvitation: (shareId: string, options?: { comment?: string }) =>
    ProjectSharingApi.respondToShareInvitation({
      share_id: shareId,
      action: "reject",
      comment: options?.comment,
    }),
};
