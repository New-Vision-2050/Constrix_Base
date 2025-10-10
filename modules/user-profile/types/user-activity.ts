export type ActivityTimelineEvent = "created" | "updated" | "deleted";

export type UserActivityT = {
  auditable_id: string;
  auditable_type: string;
  created_at: string;
  event: ActivityTimelineEvent;
  id: string;
  ip_address: string;
  tags: string[];
  title: string;
  updated_at: string;
  url: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  user_agent: string;
  new_values: string;
  old_values: string;
  user_id: string;
  user_type: string;
};
