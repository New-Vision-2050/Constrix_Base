import { baseApi } from "@/config/axios/instances/base";
import {
  CompanyLookupResponse,
  GetSharedCompaniesResponse,
  ListProjectSharesResponse,
  PendingInvitationsResponse,
  ShareProjectResponse,
} from "./types/response";
import { ShareProjectPayload } from "./types/params";


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

  acceptInvitation: (invitationId: string) =>
    baseApi.post<ShareProjectResponse>(
      `projects/sharing/invitations/${invitationId}/accept`,
    ),

  rejectInvitation: (invitationId: string) =>
    baseApi.post<ShareProjectResponse>(
      `projects/sharing/invitations/${invitationId}/reject`,
    ),

  getSharedCompanies: (projectId: string) =>
    baseApi.get<GetSharedCompaniesResponse>(
      `projects/sharing/projects/${projectId}/shared-companies`,
    ),
};
