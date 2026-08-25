# Escalation Entity — Backend Requirements

## Overview

The frontend "Sequence of Procedures" (تسلسل الاجرائات) tab under "Document Cycle" (دورة الوثائق) now enables the **Escalation Entity** (الجهة المصعد إليها) field. This field allows selecting a management hierarchy entity from the same list used by "Concerned Users" (المعنيين بالاجراء).

When a workflow step exceeds its **Time Limit** (المهلة الزمنية — `approval_within_days` + `approval_within_hours`), the backend should **notify the selected escalation entity by email**.

---

## Frontend Changes (Already Implemented)

### 1. Escalation Entity Dropdown

- **Field**: `escalationUserId` → sent as `escalation_management_hierarchy_id` in the API payload
- **Source list**: Management hierarchies fetched from `GET /management_hierarchies/list?type=management` (same list as "Concerned Users")
- **Behavior**: The field is editable in edit mode, disabled in view mode
- **Display**: In view mode, the escalation entity name is resolved from the server response (`escalation_user.name`) or from the management hierarchy list

### 2. Payload Sent to Backend (Create/Update Step)

The following existing fields are sent and are relevant to escalation:

| Field | Type | Description | a
|-------|------|-------------|
| `escalation_management_hierarchy_id` | `string?` | ID of the management hierarchy selected as escalation entity |
| `approval_within_days` | `number` | Time limit — days portion |
| `approval_within_hours` | `number` | Time limit — hours portion |
| `notify_by_email` | `boolean` | Whether email notifications are enabled for this step |

No new payload fields were added — all existing fields are sufficient.

---

## Backend Requirements

### 1. Return `escalation_user` in Step Response

When returning a procedure step (GET), include the `escalation_user` object so the frontend can display the escalation entity name in view mode:

```json
{
  "id": 123,
  "name": "Step name",
  "escalation_management_hierarchy_id": "uuid-of-management",
  "escalation_user": {
    "id": "uuid-of-management",
    "name": "Management Name",
    "email": "management@example.com",
    "phone": "+966500000000"
  },
  "approval_within_days": 2,
  "approval_within_hours": 6,
  "notify_by_email": true
}
```

**`escalation_user` fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Management hierarchy ID |
| `name` | `string` | Management hierarchy display name |
| `email` | `string` | Email address for notifications |
| `phone` | `string?` | Optional phone number |

### 2. Escalation Email Notification Logic

When a workflow step's time limit is exceeded, the backend should:

1. **Detect timeout**: Check if the current time exceeds `step.created_at + approval_within_days + approval_within_hours`
2. **Send email notification**: Send an email to the escalation entity (`escalation_management_hierarchy_id`) informing them that the step has exceeded its time limit
3. **Respect `notify_by_email`**: Only send the email if `notify_by_email` is `true` for the step
4. **Include relevant context in the email**:
   - Project name
   - Procedure name
   - Step name
   - Time limit that was set
   - How long it has been exceeded
   - Action taker information (who was supposed to act)

### 3. Escalation Entity Resolution

The `escalation_management_hierarchy_id` references a record in the `management_hierarchies` table. The backend should:

- Resolve the management hierarchy's associated email address (from the management hierarchy record or its assigned users)
- If the management hierarchy has multiple users, notify all users assigned to that management hierarchy
- If no email is found for the escalation entity, log a warning and skip the notification

---

## API Endpoints Involved

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/procedure-settings/{id}/steps` | `POST` | Create step with `escalation_management_hierarchy_id` |
| `/procedure-settings/{id}/steps/{stepId}` | `PUT` | Update step with `escalation_management_hierarchy_id` |
| `/procedure-settings/{id}/steps/{stepId}` | `GET` | Return step with `escalation_user` object |
| `/management_hierarchies/list?type=management` | `GET` | List of management hierarchies (used for dropdown) |

---

## Summary of What the Backend Needs to Do

1. **Return `escalation_user`** (with `id`, `name`, `email`, `phone?`) in the GET step response when `escalation_management_hierarchy_id` is set
2. **Implement a scheduled job or event listener** that checks workflow steps for time limit exceeded conditions
3. **Send an email** to the escalation entity when the time limit is exceeded and `notify_by_email` is `true`
4. **Handle the case** where the escalation entity has no email — log and skip
