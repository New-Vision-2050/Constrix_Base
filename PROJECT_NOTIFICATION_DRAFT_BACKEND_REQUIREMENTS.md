# Project Notification Draft — Backend Requirements

> This document is for the backend team (and any AI assisting backend work).  
> It describes the behavior the frontend now expects when creating/updating a project maintenance/emergency notification as a **draft**.

## What changed in the frontend

The notification creation wizard (`CreateNotificationWizard`) now auto-saves the form as a **draft** while the user moves between steps and when the dialog is closed without pressing the final **Send** / **Update** button.  
Only when the user clicks the last-step confirmation button does the frontend send the payload **without** the draft flag, asking the backend to publish the notification and run its normal lifecycle.

### Frontend → Backend payloads

Both `POST /projects/notifications` and `PUT /projects/notifications/{id}` now include an optional boolean flag:

```json
{
  "is_draft": true
}
```

- `is_draft: true`  →  Backend must persist the data as a **draft**. No lifecycle actions should run.
- `is_draft: false` or omitted  →  Backend must publish the notification and run the normal lifecycle (notifications, approvals, escalations, etc.).

The existing field set remains unchanged; `is_draft` is simply added as an optional top-level field.

## Backend responsibilities

### 1. Accept `is_draft` on create and update

- `POST /projects/notifications` must accept `"is_draft": true`.
- `PUT /projects/notifications/{id}` must accept `"is_draft": true` and update the existing record without publishing it.
- The `notification_status` enum/type should include a new value: `"draft"`.
- A newly created draft must be returned with `status: "draft"` and a stable `id` so the frontend can keep updating it.

### 2. Do NOT trigger lifecycle actions for drafts

When `is_draft: true`, the backend must skip anything that would normally happen for a published notification, including but not limited to:

- Push / email / SMS notifications to assigned employees or contractors.
- Voice calls (`notify-site-status-update-by-voice`).
- Approval workflow entry or status changes.
- Employee task creation or assignment lifecycle.
- Site-status update tracking / escalation timers.
- Any scheduled jobs, reminders, or SLA timers that assume a live notification.
- Counting the notification in dashboards, reports, or charts that represent active work.

The notification should be treated as an incomplete, in-progress form entry owned by the creator.

### 3. Allow partial/incomplete data

Because a draft is saved while the user is still filling the wizard, the backend must accept incomplete payloads when `is_draft: true`.  
Fields that are normally required for publishing (e.g. `assigned_user_ids`, `task_latitude`, `task_longitude`, `repair_point`) should be optional for drafts.

Suggested rule: apply strict validation only when `is_draft` is `false` or omitted.  
When `is_draft` is `true`, validate only the bare minimum needed to store a row (e.g. `project_id` / `contractual_engagement_key` and maybe `notification_type`).

### 4. Update an existing draft

- `PUT /projects/notifications/{draft_id}` with `is_draft: true` must overwrite the draft fields.
- The `status` must remain `"draft"`.
- If fields are missing in the new payload, they should be left empty (not auto-filled), because the user has not completed that step yet.

### 5. Publish / finalize a draft

When the frontend is ready to publish, it will send one of:

- `PUT /projects/notifications/{draft_id}` with `is_draft: false` (or with the field omitted), or
- `POST /projects/notifications` with `is_draft: false` / omitted.

At that point the backend must:

- Run full validation as it does today.
- Change the status from `"draft"` to the normal starting status (usually `"pending"`).
- Trigger the normal lifecycle: notifications, task assignments, approval flow, timers, etc.
- Return the published notification.

### 6. List / filter behavior

Decide how drafts appear in lists and filters:

- Option A: Include drafts in `GET /projects/notifications` so the creator can see and resume them, but show them with `status: "draft"`.
- Option B: Hide drafts from the default list and provide a separate endpoint/filter (e.g. `?include_drafts=true` or `?status=draft`).

At minimum, the backend should support `status=draft` as a filter value so the frontend can show a drafts tab/folder if desired.

### 7. Permissions

- Only users who can create notifications should be allowed to create/update drafts.
- A user should not be able to see another user's drafts unless explicitly allowed by role.

## Summary of expected state transitions

| Action | Endpoint | Payload flag | Expected status | Lifecycle actions? |
|--------|----------|--------------|-----------------|--------------------|
| Auto-save step 1 | `POST /projects/notifications` | `is_draft: true` | `draft` | No |
| Update draft | `PUT /projects/notifications/{id}` | `is_draft: true` | `draft` | No |
| Close wizard | `PUT /projects/notifications/{id}` | `is_draft: true` | `draft` | No |
| Final publish | `PUT/POST` | `is_draft: false` | `pending` (or normal start) | Yes |

## Migration notes

- Existing notifications remain unaffected.
- If the backend does not yet recognize `is_draft`, it may ignore it and publish early; this must be implemented before the feature is usable.
- Consider adding a DB column `is_draft` or using the existing `status` field with value `"draft"`. The frontend only cares that `status === "draft"` is returned and respected.

## Files touched in the frontend

- `services/api/projects/notifications/types/response.ts` — added `"draft"` to `NotificationStatus`.
- `services/api/projects/notifications/types/args.ts` — added optional `is_draft?: boolean`.
- `modules/projects/project/utils/notificationStatusConfig.ts` — added draft status style.
- `modules/projects/project/query/useProjectNotificationMutations.ts` — added `useSaveProjectNotificationDraftMutation`.
- `modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/wizard/buildPayload.ts` — added `isDraft` option.
- `modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/wizard/CreateNotificationWizard.tsx` — auto-save drafts on step navigation and close; finalize on submit.
- `messages/groups/projects/index.ts` — added `statuses.draft` translation.
