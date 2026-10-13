export const HR_EMPLOYEE_TASKS_INBOX_QUERY_KEY =
  "hr-employee-tasks-inbox-list" as const;

/**
 * Employee-tasks inbox total — same value the sidebar badge
 * (`components/icons/hr-inbox.tsx`) uses so both share the query cache.
 */
export const HR_EMPLOYEE_TASKS_INBOX_COUNTS_QUERY_KEY =
  "hr-inbox-total-count" as const;

export const HR_LEAVE_REQUESTS_INBOX_QUERY_KEY =
  "hr-leave-requests-inbox-list" as const;

export const HR_ADVANCE_REQUESTS_INBOX_QUERY_KEY =
  "hr-advance-requests-inbox-list" as const;

/**
 * Prefix for both approver-inbox count queries
 * (`[HR_APPROVAL_INBOX_COUNTS_QUERY_KEY, "leave" | "advance"]`) — invalidate
 * the prefix to refresh the two tab badges together.
 */
export const HR_APPROVAL_INBOX_COUNTS_QUERY_KEY =
  "hr-approval-inbox-counts" as const;
