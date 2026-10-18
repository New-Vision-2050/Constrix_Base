# Employment Contract – Leave Category Assignment (Backend Requirements)

## Summary
Leave policies are no longer assigned to a user manually. Instead, HR selects a **Leave Policy Category** on the user's **employment contract (عقد العمل)**. The backend then assigns **all leave policies under that category** to the user automatically.

The "Assign leave policies" checkbox section in the user profile → contract settings → leaves tab is removed from the frontend. That tab now only shows:
- the assigned leave category (read-only, from the contract), and
- the user's leave policies / balances table (`GET /users/{id}/leave-policies?year=`).

## Required headers (all endpoints)
```
Authorization: Bearer <token>
X-Tenant: <tenant-id>
Accept: application/json
```

## 1. Employment contract API changes

Base: `/api/v1/employment_contracts`

### Create / Update (`POST /` and the existing update endpoint)
New **optional** field (multipart/form-data, same as the existing body):

| Field | Type | Rules |
|---|---|---|
| `leave_category_id` | uuid\|null | nullable, must exist in `leave_policy_categories` of the current company |

- Localized 422 error, e.g. `leave_category_id`: "The leave policy category is invalid."
- Sending an empty value clears the category.

### Responses (`GET /employment_contracts/user/{userId}` and create/update)
Add:
```json
{
  "leave_category_id": "uuid|null",
  "leave_category": { "id": "uuid", "name": "Annual Leaves" }
}
```
`leave_category` is `null` when no category is set.

### Migration
`add_leave_category_id_to_employment_contracts_table`
- `leave_category_id` uuid nullable, FK to `leave_policy_categories.id`, `nullOnDelete()`.

## 2. Automatic policy assignment (sync)
Whenever a contract is created or updated and `leave_category_id` is provided (or changed):

1. Resolve all `LeavePolicy` rows where `leave_category_id` = the contract's category.
2. **Sync** the user's leave policy assignments to exactly that set (add missing, remove policies from the previous category). Use the same logic as the previous `PUT /users/{id}/leave-policies` sync.
3. If the category is cleared (`null`), remove the user's category-based assignments.
4. Balances for the current year are (re)computed as before.

Also keep assignments in sync when:
- a leave policy is **created / updated** so its `leave_category_id` changes → re-sync users whose contract uses the affected categories (old and new);
- a leave policy category is **deleted** → contracts get `leave_category_id = null` (via `nullOnDelete`) and the affected users' category-based assignments are removed.

## 3. User leave policies API
`GET /api/v1/users/{id}/leave-policies?year=YYYY` is unchanged and remains the source for the balances table. Optionally include `leave_category_id` and `leave_category_name` on each row.

The manual assignment endpoint (`PUT /users/{id}/leave-policies`) is no longer called by the frontend. It may be deprecated/removed, and the `LEAVE_POLICY_ASSIGN` permission is no longer needed by the UI.

## 4. Permissions
- Choosing the category on the contract is covered by the existing contract update permission (`PROFILE_CONTRACT_WORK_UPDATE`).
- Reading categories for the dropdown uses `LEAVE_POLICY_CATEGORY_LIST`. Make sure roles that can edit contracts also have it (or allow the dropdown endpoint under the contract permission).
