# Procedure Steps API — Frontend Contract

This document describes how the **HR / CRM Procedures Settings** frontend builds step payloads after the **management hierarchy** refactor. It is intended for backend implementation, validation, and migration.

**Frontend source:** `modules/hr-settings/tabs/procedures-settings/components/StepCard.tsx`  
**Shared types:** `services/api/crm-settings/procedure-settings/types/args.ts`  
**Response types:** `services/api/crm-settings/procedure-settings/types/response.ts`

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/procedure-settings/{procedureSettingId}/steps` | List steps |
| `GET` | `/procedure-settings/{procedureSettingId}/steps/{stepId}` | Get one step |
| `POST` | `/procedure-settings/{procedureSettingId}/steps` | Create step |
| `POST` | `/procedure-settings/{procedureSettingId}/steps/{stepId}` | Update step |
| `DELETE` | `/procedure-settings/{procedureSettingId}/steps/{stepId}` | Delete step |

> **Note:** Update uses `POST`, not `PUT`.

---

## Breaking Change — Management Hierarchy

### Before (deprecated)

The frontend previously sent a **primary** hierarchy type plus an optional **alternatives** array:

```json
{
  "action_taker_type": "management_hierarchy",
  "action_taker_management_hierarchy_type": "project_manager",
  "action_taker_alternative_management_hierarchy_type": ["branch_manager", "management_manager"]
}
```

`deputy_manager` was one of the select option values.

### After (current)

The frontend now sends a **single array of objects**. Each row combines a hierarchy type with a deputy flag:

```json
{
  "action_taker_type": "management_hierarchy",
  "action_taker_management_hierarchies": [
    {
      "action_taker_management_hierarchy_type": "project_manager",
      "is_Deputy_Director": false
    },
    {
      "action_taker_management_hierarchy_type": "branch_manager",
      "is_Deputy_Director": true
    }
  ]
}
```

### Deprecated fields (do not expect on new saves)

| Field | Status |
|-------|--------|
| `action_taker_management_hierarchy_type` | **Deprecated** — replaced by `action_taker_management_hierarchies` |
| `action_taker_alternative_management_hierarchy_type` | **Deprecated** — replaced by `action_taker_management_hierarchies` |
| `deputy_manager` as a hierarchy type value | **Removed** — use `is_Deputy_Director: true` on any row instead |

### Backend requirements for `action_taker_management_hierarchies`

| Rule | Detail |
|------|--------|
| **Required when** | `action_taker_type === "management_hierarchy"` |
| **Min length** | At least 1 item with a non-empty `action_taker_management_hierarchy_type` |
| **Max length** | 3 (one per allowed option) |
| **Uniqueness** | `action_taker_management_hierarchy_type` must be unique within the array |
| **Allowed type values** | `project_manager`, `branch_manager`, `management_manager` |
| **Deputy flag** | `is_Deputy_Director` is a boolean on each item (independent of the type value) |

#### Allowed `action_taker_management_hierarchy_type` values

| Value | Arabic label (UI) |
|-------|-------------------|
| `project_manager` | مدير المشروع |
| `branch_manager` | مدير الفرع |
| `management_manager` | مدير الادارة |

#### Example payloads

**Single row:**

```json
{
  "name": "Step 1",
  "action_taker_type": "management_hierarchy",
  "action_taker_management_hierarchies": [
    {
      "action_taker_management_hierarchy_type": "project_manager",
      "is_Deputy_Director": false
    }
  ],
  "action_taker_user_ids": [],
  "concerned_management_hierarchy_ids": [],
  "is_approve": true,
  "is_accept": false,
  "is_view_only": false,
  "is_return_with_notes": false,
  "requires_approval_within_period": false,
  "forms": "approve",
  "notify_by_email": false,
  "notify_by_whatsapp": false,
  "notify_by_sms": false,
  "approval_within_days": 0,
  "approval_within_hours": 6
}
```

**Three rows (maximum):**

```json
{
  "action_taker_type": "management_hierarchy",
  "action_taker_management_hierarchies": [
    { "action_taker_management_hierarchy_type": "project_manager", "is_Deputy_Director": false },
    { "action_taker_management_hierarchy_type": "branch_manager", "is_Deputy_Director": true },
    { "action_taker_management_hierarchy_type": "management_manager", "is_Deputy_Director": false }
  ]
}
```

**Legacy read → new write migration (frontend behavior):**

If the API still returns old fields, the frontend maps them when loading:

| Legacy value | Mapped row |
|--------------|--------------|
| `action_taker_management_hierarchy_type: "project_manager"` | `{ type: "project_manager", is_Deputy_Director: false }` |
| `action_taker_alternative_management_hierarchy_type: ["branch_manager"]` | `{ type: "branch_manager", is_Deputy_Director: false }` |
| Any value `"deputy_manager"` | `{ type: "", is_Deputy_Director: true }` (user must re-select hierarchy type before save) |

On save, the frontend **only** sends `action_taker_management_hierarchies` (not the deprecated fields).

---

## Action Taker Types — All Cases

The field `action_taker_type` drives which conditional fields are sent.

| `action_taker_type` | UI label (AR) | Conditional payload fields |
|---------------------|---------------|----------------------------|
| `specific_user` | لمستخدم محدد | `action_taker_user_ids`, optional `branch_id`, `management_id`, `concerned_management_hierarchy_ids` |
| `management_hierarchy` | الهيكل التنظيمي | `action_taker_management_hierarchies` |
| `specific_procedures` | اجراءات محددة | `action_taker_specific_procedure_type[]`, `action_taker_specific_procedure_id[]` (parallel arrays) |
| `himself` | نفسه | No extra action-taker fields; `forms` is always `"approve"` |

---

## Case 1 — `specific_user`

**UI fields shown:** branch, management, action taker (employee), concerned users.

**Frontend validation:** `action_taker_user_ids` must contain at least one employee ID.

**Payload example:**

```json
{
  "name": "Approval by HR manager",
  "action_taker_type": "specific_user",
  "action_taker_user_ids": ["employee-uuid-123"],
  "branch_id": 5,
  "management_id": 12,
  "concerned_management_hierarchy_ids": ["mgmt-hierarchy-uuid-456"],
  "is_approve": true,
  "is_accept": false,
  "is_view_only": false,
  "is_return_with_notes": false,
  "requires_approval_within_period": false,
  "forms": "approve",
  "notify_by_email": true,
  "notify_by_whatsapp": false,
  "notify_by_sms": false,
  "escalation_management_hierarchy_id": "escalation-uuid",
  "approval_within_days": 2,
  "approval_within_hours": 0
}
```

**Notes:**

- `branch_id` and `management_id` are omitted when empty.
- `concerned_management_hierarchy_ids` is sent as `[]` when not selected.
- `action_taker_management_hierarchies` is **not** sent for this type.

---

## Case 2 — `management_hierarchy`

See [Breaking Change](#breaking-change--management-hierarchy) above.

**Frontend validation:** At least one row must have a selected `action_taker_management_hierarchy_type`.

**Fields NOT sent for this type:**

- `action_taker_user_ids` → always `[]`
- `action_taker_specific_procedure_type` / `action_taker_specific_procedure_id` → omitted
- Deprecated `action_taker_management_hierarchy_type` / `action_taker_alternative_management_hierarchy_type` → omitted on new saves

---

## Case 3 — `specific_procedures`

**UI:** Dynamic rows of `{ type, id }`.

**Frontend validation:** At least one complete row (both `type` and `id`).

**Allowed `action_taker_specific_procedure_type` values:**

| Value | Entity |
|-------|--------|
| `branch` | Branch |
| `management` | Management / department |
| `job_title` | Job title |
| `job_role` | Job role |

**Payload example:**

```json
{
  "name": "Branch manager step",
  "action_taker_type": "specific_procedures",
  "action_taker_specific_procedure_type": ["branch", "job_role"],
  "action_taker_specific_procedure_id": ["3", "1"],
  "action_taker_user_ids": [],
  "concerned_management_hierarchy_ids": [],
  "is_approve": true,
  "is_accept": false,
  "is_view_only": false,
  "is_return_with_notes": false,
  "requires_approval_within_period": false,
  "forms": "approve",
  "notify_by_email": false,
  "notify_by_whatsapp": false,
  "notify_by_sms": false,
  "approval_within_days": 0,
  "approval_within_hours": 6
}
```

**GET response (preferred shape for frontend):**

```json
{
  "action_taker_specific_procedures": [
    { "type": "branch", "id": "3" },
    { "type": "job_role", "id": "1" }
  ]
}
```

**Legacy GET shape (still supported on read):**

```json
{
  "action_taker_specific_procedure_type": ["branch", "job_role"],
  "action_taker_specific_procedure_id": ["3", "1"]
}
```

Arrays must stay **index-aligned** (same length, matching positions).

---

## Case 4 — `himself`

**UI:** Organizational template dropdown is locked to approval form.

**Payload example:**

```json
{
  "name": "Self approval",
  "action_taker_type": "himself",
  "action_taker_user_ids": [],
  "concerned_management_hierarchy_ids": [],
  "is_approve": true,
  "is_accept": false,
  "is_view_only": false,
  "is_return_with_notes": false,
  "requires_approval_within_period": false,
  "forms": "approve",
  "notify_by_email": false,
  "notify_by_whatsapp": false,
  "notify_by_sms": false,
  "approval_within_days": 0,
  "approval_within_hours": 6
}
```

**Notes:**

- No `action_taker_management_hierarchies`, no specific procedure arrays, no employee IDs.
- Frontend always sends `forms: "approve"` for this type.

---

## Common Fields (All Action Taker Types)

These fields are sent on **every** step save from `StepCard`:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Step name (trimmed) |
| `action_taker_type` | `string` | One of the four values above |
| `action_taker_user_ids` | `string[]` | Employee UUIDs; populated only for `specific_user` |
| `concerned_management_hierarchy_ids` | `string[]` | Concerned parties; used mainly with `specific_user` |
| `is_approve` | `boolean` | Organizational rule: approval |
| `is_accept` | `boolean` | Organizational rule: accept (checkbox in UI if enabled) |
| `is_view_only` | `boolean` | Organizational rule: view only |
| `is_return_with_notes` | `boolean` | Organizational rule: return with notes |
| `requires_approval_within_period` | `boolean` | Timed approval rule enabled |
| `forms` | `string` | Currently always `"approve"` from this UI |
| `notify_by_email` | `boolean` | Email notification |
| `notify_by_whatsapp` | `boolean` | WhatsApp notification |
| `notify_by_sms` | `boolean` | SMS notification |
| `approval_within_days` | `number` | Deadline days (default `0`) |
| `approval_within_hours` | `number` | Deadline hours (default `6`) |
| `skipping_period` | `number` | Sent only when `requires_approval_within_period === true` |
| `escalation_management_hierarchy_id` | `string` | Optional escalation target |
| `branch_id` | `number` | Optional; `specific_user` filter context |
| `management_id` | `number` | Optional; `specific_user` filter context |

### Organizational rule flags (`orgBase`)

| UI value | Payload field |
|----------|---------------|
| `approve` | `is_approve: true` |
| `accept` | `is_accept: true` |
| `view_only` | `is_view_only: true` (disabled in UI) |
| `return_with_notes` | `is_return_with_notes: true` (disabled in UI) |
| `approve_timed` | `requires_approval_within_period: true` + `skipping_period` |

---

## Expected GET / Response Shape

Backend should return enough data for the frontend to hydrate the form.

### Recommended fields for `management_hierarchy`

```json
{
  "id": 42,
  "name": "Manager approval",
  "action_taker_type": "management_hierarchy",
  "action_taker_management_hierarchies": [
    {
      "action_taker_management_hierarchy_type": "project_manager",
      "is_Deputy_Director": false
    },
    {
      "action_taker_management_hierarchy_type": "branch_manager",
      "is_Deputy_Director": true
    }
  ]
}
```

`is_Deputy_Director` may be returned as `boolean` or `0`/`1`; the frontend coerces both.

### Backward-compatible GET (legacy)

The frontend can still **read** (but will **write** the new format):

```json
{
  "action_taker_management_hierarchy_type": "project_manager",
  "action_taker_alternative_management_hierarchy_type": ["branch_manager"]
}
```

### Boolean coercion on read

These response fields may be `boolean` or `number` (`0`/`1`):

- `is_approve`, `is_accept`, `is_view_only`, `is_return_with_notes`
- `requires_approval_within_period`
- `is_Deputy_Director`

---

## Backend Validation Checklist

### Global

- [ ] `name` is required and non-empty after trim
- [ ] `action_taker_type` is one of: `specific_user`, `management_hierarchy`, `specific_procedures`, `himself`

### Per type

| Type | Validate |
|------|----------|
| `specific_user` | `action_taker_user_ids.length >= 1` |
| `management_hierarchy` | `action_taker_management_hierarchies` present, length 1–3, unique types, valid enum values |
| `specific_procedures` | Parallel arrays same length, at least 1 pair, valid types |
| `himself` | No action-taker sub-structures required |

### `management_hierarchy` specific

- [ ] Reject duplicate `action_taker_management_hierarchy_type` in the same step
- [ ] Reject more than 3 items
- [ ] Reject unknown type strings (especially legacy `deputy_manager` as a type — use `is_Deputy_Director` instead)
- [ ] Accept `is_Deputy_Director` as boolean per row

### Timed approval

- [ ] When `requires_approval_within_period === true`, require `skipping_period > 0`

---

## TypeScript Reference (Frontend)

```typescript
export interface ActionTakerManagementHierarchyItem {
  action_taker_management_hierarchy_type: string;
  is_Deputy_Director: boolean;
}

export interface CreateStepArgs {
  name: string;
  action_taker_type?: string;
  action_taker_management_hierarchies?: ActionTakerManagementHierarchyItem[];
  action_taker_specific_procedure_type?: string[];
  action_taker_specific_procedure_id?: string[];
  action_taker_user_ids: string[];
  concerned_management_hierarchy_ids: string[];
  is_accept: boolean;
  is_approve: boolean;
  is_view_only: boolean;
  is_return_with_notes: boolean;
  requires_approval_within_period: boolean;
  forms: string;
  approval_within_days?: number;
  approval_within_hours?: number;
  skipping_period?: number;
  escalation_management_hierarchy_id?: string;
  notify_by_email: boolean;
  notify_by_whatsapp: boolean;
  notify_by_sms: boolean;
  branch_id?: number;
  management_id?: number;
}
```

---

## Summary for Backend Team

1. **Implement `action_taker_management_hierarchies`** as the canonical storage and response format for `management_hierarchy` steps.
2. **Stop relying on** `action_taker_management_hierarchy_type` + `action_taker_alternative_management_hierarchy_type` for new data (keep read support during migration).
3. **`deputy_manager` is no longer a hierarchy type** — deputy status is `is_Deputy_Director` on each row.
4. **Enforce uniqueness and max 3 rows** for hierarchy types.
5. **Return `action_taker_management_hierarchies` on GET** so the frontend can edit steps without legacy mapping.
6. Other action taker types (`specific_user`, `specific_procedures`, `himself`) are unchanged in structure; see cases above.

---

*Last updated: June 2026 — reflects HR Procedures Settings `StepCard` implementation.*
