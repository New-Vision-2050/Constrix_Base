import type {
  ActivityListParams,
  AnnouncementListParams,
  ForumListParams,
  ForumMemberListParams,
  GroupListParams,
  ReportListParams,
} from "./types";

const root = ["forums"] as const;

export const forumKeys = {
  root,
  list: (params: ForumListParams) => [...root, "list", params] as const,
  detail: (forumId: string) => [...root, "detail", forumId] as const,

  groups: (forumId: string, params: GroupListParams) =>
    [...root, forumId, "groups", params] as const,
  groupsRoot: (forumId: string) => [...root, forumId, "groups"] as const,

  groupMembers: (forumId: string, groupId: string) =>
    [...root, forumId, "groups", groupId, "members"] as const,

  members: (forumId: string, params: ForumMemberListParams) =>
    [...root, forumId, "members", params] as const,
  membersRoot: (forumId: string) => [...root, forumId, "members"] as const,

  admins: (forumId: string) => [...root, forumId, "admins"] as const,

  announcements: (params: AnnouncementListParams) =>
    [...root, "announcements", params] as const,
  announcementsRoot: [...root, "announcements"] as const,

  reports: (forumId: string, params: ReportListParams) =>
    [...root, forumId, "reports", params] as const,
  reportsRoot: (forumId: string) => [...root, forumId, "reports"] as const,

  activity: (forumId: string, params: ActivityListParams) =>
    [...root, forumId, "activity", params] as const,

  employees: (params: Record<string, unknown>) =>
    [...root, "employees", params] as const,
  branches: [...root, "branches"] as const,
  managements: (branchId?: string) =>
    [...root, "managements", branchId ?? "all"] as const,
  projects: [...root, "projects"] as const,
};
