// Domain types for the forums dashboard module.
// Shapes mirror FORUM_DASHBOARD_FRONTEND_SPEC.md exactly.

export type ForumVisibility = "company" | "scoped";
export type ForumStatus = "draft" | "active" | "archived";
export type ForumRole = "owner" | "admin" | null;

export type Forum = {
  id: string;
  name: string;
  description: string;
  details?: string | null;
  logo_url: string | null;
  visibility: ForumVisibility;
  branch_ids: string[];
  project_ids: string[];
  branch_names?: string[];
  project_names?: string[];
  status: ForumStatus;
  groups_count: number;
  members_count: number;
  admins_count: number;
  open_reports_count: number;
  last_activity_at: string | null;
  my_role: ForumRole;
  created_at: string;
  archived_at?: string | null;
};

export type ForumDetails = Forum & {
  admins: ForumAdmin[];
  member_ids: string[];
};

export type ForumAdmin = {
  user_id: string;
  name: string;
  email?: string;
  job_title?: string;
  branch_name?: string;
  employee_number?: string;
  groups_count?: number;
  can_manage_groups: boolean;
  can_publish_announcements: boolean;
};

export type SendPermission = "admins_only" | "all_members" | "specific_members";
export type GroupStatus = "active" | "archived";

export type ForumGroup = {
  id: string;
  forum_id: string;
  name: string;
  description?: string | null;
  icon_url?: string | null;
  category?: string | null;
  status: GroupStatus;
  show_name_in_chat: boolean;
  send_permission: SendPermission;
  allow_images: boolean;
  allow_voice: boolean;
  allow_files: boolean;
  allowed_user_ids?: string[];
  members_count: number;
  admins_count: number;
  sort_order?: number | null;
};

export type GroupMemberRole = "admin" | "member";

export type GroupMember = {
  user_id: string;
  name: string;
  employee_number?: string | null;
  branch_name?: string | null;
  role: GroupMemberRole;
  can_send: boolean;
  status?: string;
};

export type ForumMember = {
  user_id: string;
  name: string;
  employee_number?: string | null;
  branch_name?: string | null;
  forum_role: GroupMemberRole;
  groups: { id: string; name: string; role: GroupMemberRole }[];
  status?: string;
};

export type AnnouncementStatus = "draft" | "published";
export type AttachmentType = "image" | "file" | "voice";

export type AnnouncementAttachment = {
  id: number | string;
  url: string;
  name: string;
  mime_type: string;
  type: AttachmentType;
  size: number;
  duration?: number | null;
};

export type Announcement = {
  id: string;
  forum_id?: string;
  title: string;
  body: string;
  status: AnnouncementStatus;
  notify: boolean;
  author: { id: string; name: string } | null;
  attachments: AnnouncementAttachment[];
  created_at: string;
};

export type ReportStatus = "new" | "in_review" | "resolved" | "closed";
export type ReportAction = "delete_message" | "keep_message";

export type ReportedMessage = {
  id: string;
  type: string;
  body: string;
  sender: { id: string; name: string } | null;
  attachments: AnnouncementAttachment[];
  created_at: string;
};

export type ForumReport = {
  id: string;
  group_id: string;
  group_name: string;
  message_id: string;
  message: ReportedMessage | null;
  reason: string;
  reporter: { id: string; name: string } | null;
  status: ReportStatus;
  created_at: string;
};

export type ActivityRow = {
  id: string;
  action: string;
  action_label: string;
  actor: { id: string; name: string } | null;
  target_type: string;
  target_id: string;
  target_label: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  created_at: string;
};

export type EmployeeOption = {
  id: string;
  name: string;
  email?: string;
  job_title?: string;
  branch_name?: string;
  employee_number?: string;
  avatar_url?: string | null;
};

// ---------------------------------------------------------------------------
// Request params / bodies
// ---------------------------------------------------------------------------

export type ForumListParams = {
  scope?: "manage" | "visible";
  page?: number;
  per_page?: number;
  search?: string;
  status?: ForumStatus | "";
  visibility?: ForumVisibility | "";
  branch_id?: string;
};

export type ForumListStats = {
  total?: number;
  active?: number;
  published?: number;
  drafts?: number;
  open_reports?: number;
  archived?: number;
};

export type ForumAdminInput = {
  user_id: string;
  can_manage_groups: boolean;
  can_publish_announcements: boolean;
};

export type CreateForumBody = {
  name: string;
  description: string;
  details?: string | null;
  visibility: ForumVisibility;
  branch_ids?: string[];
  project_ids?: string[];
  admins: ForumAdminInput[];
  member_ids: string[];
  notify_members: boolean;
  status: "draft" | "published";
  logo?: File | null;
};

export type UpdateForumBody = {
  name?: string;
  description?: string;
  details?: string | null;
  visibility?: ForumVisibility;
  branch_ids?: string[];
  project_ids?: string[];
  logo?: File | null;
};

export type GroupListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: GroupStatus | "";
  send_permission?: SendPermission | "";
};

export type GroupStats = {
  total?: number;
  active?: number;
  archived?: number;
  admins_only?: number;
};

export type GroupBody = {
  name?: string;
  description?: string | null;
  category?: string | null;
  show_name_in_chat?: boolean;
  status?: GroupStatus;
  sort_order?: number | null;
  send_permission?: SendPermission;
  allow_images?: boolean;
  allow_voice?: boolean;
  allow_files?: boolean;
  icon?: File | null;
};

export type SendSettingsBody = {
  send_permission: SendPermission;
  allowed_user_ids?: string[];
  allow_images: boolean;
  allow_voice: boolean;
  allow_files: boolean;
};

export type ForumMemberListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  branch_id?: string;
  group_id?: string;
};

export type AnnouncementListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: AnnouncementStatus | "";
  author_id?: string;
};

export type AnnouncementStats = {
  total?: number;
  published?: number;
  drafts?: number;
  archived?: number;
};

export type AnnouncementBody = {
  title: string;
  body: string;
  status: AnnouncementStatus;
  notify: boolean;
  attachments?: File[];
};

export type ReportListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: ReportStatus | "";
  group_id?: string;
};

export type ReportStats = {
  new?: number;
  in_review?: number;
  resolved?: number;
  closed?: number;
};

export type ActivityListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  actor_id?: string;
  action?: string;
  from?: string;
  to?: string;
};
