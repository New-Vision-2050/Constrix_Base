# Permission System Documentation

## Overview
The application uses CASL (Casl Ability) for authorization, with dynamic permissions loaded from the backend.

## Permission Structure
Permissions follow the format: `SUBJECT_ACTION`

Examples:
- `USER_PROFILE_DATA_UPDATE` → action: `UPDATE`, subject: `USER_PROFILE_DATA`
- `COMPANY_CREATE` → action: `CREATE`, subject: `COMPANY`
- `ROLE_DELETE` → action: `DELETE`, subject: `ROLE`

## Available Actions
- `LIST` - View a list of items
- `CREATE` - Create new items
- `UPDATE` - Update existing items
- `DELETE` - Delete items
- `EXPORT` - Export data
- `VIEW` - View specific items
- `ACTIVATE` - Activate/enable items

## Common Subjects
- `COMPANY` - Company management
- `USER` - User management
- `ROLE` - Role management
- `USER_PROFILE_DATA` - User profile data
- `USER_PROFILE_CONTACT` - User contact information
- `ORGANIZATION_BRANCH` - Organization branches
- `PROFILE_QUALIFICATION` - User qualifications
- And many more...

## Usage

### 1. Using the `useCan` hook
```tsx
import { useCan } from '@/hooks/useCan';

function MyComponent() {
  const { can } = useCan();
  
  const canCreateCompany = can('CREATE', 'COMPANY');
  const canUpdateUser = can('UPDATE', 'USER_PROFILE_DATA');
  
  return (
    <div>
      {canCreateCompany && <CreateButton />}
      {canUpdateUser && <UpdateForm />}
    </div>
  );
}
```

### 2. Using constants for type safety
```tsx
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from '@/constants/permissions';

const canList = can(PERMISSION_ACTIONS.LIST, PERMISSION_SUBJECTS.COMPANY);
```

### 3. Multiple permission checks
```tsx
const permissions = can(['CREATE', 'UPDATE'], 'COMPANY');
// Returns: { CREATE: true, UPDATE: false }

const multiSubject = can('VIEW', ['COMPANY', 'USER']);
// Returns: { COMPANY: true, USER: false }
```

### 4. In API routes
```tsx
import { withPermissionCheck } from '@/examples/permission-usage';

export default withPermissionCheck('CREATE', 'COMPANY')(async function handler(req, res) {
  // Your API logic here
});
```

## Files Structure

### Core Files
- `/lib/ability.ts` - CASL ability definition and parsing logic
- `/hooks/useCan.ts` - React hook for permission checking
- `/hooks/usePermissions.ts` - Hook for fetching user permissions
- `/store/usePermissionsStore.ts` - Zustand store for permissions
- `/contexts/AbilityProvider.tsx` - React context provider

### Configuration Files
- `/constants/permissions.ts` - Permission constants and helpers
- `/examples/permission-usage.tsx` - Usage examples
- `/examples/practical-permissions.tsx` - Real-world examples

### Setup Files
- `/app/[locale]/AbilityProviderWrapper.tsx` - Wrapper component
- `/app/[locale]/layout.tsx` - Root layout with ability provider

## How It Works

1. **Permissions Loading**: On app startup, `usePermissions` fetches user permissions from `/users/my-permissions`
2. **Storage**: Permissions are stored in Zustand with localStorage persistence
3. **Ability Creation**: `defineAbilityFor` parses permission keys and creates CASL ability
4. **Usage**: Components use `useCan` hook to check permissions
5. **Rendering**: UI elements are conditionally rendered based on permissions

## Best Practices

1. **Always check permissions** before rendering sensitive UI elements
2. **Use constants** from `/constants/permissions.ts` for type safety
3. **Handle loading states** when permissions are not yet loaded
4. **Implement API-level checks** in addition to UI checks
5. **Group related permissions** into custom hooks for reusability

## Example Implementation

See `/examples/practical-permissions.tsx` for complete examples of how to implement permissions in different pages like Companies, Users, and Roles.

## Troubleshooting

- If permissions don't work, check that `AbilityProviderWrapper` is properly wrapping your app
- Ensure the backend API `/users/my-permissions` returns the correct format
- Check browser storage to see if permissions are being cached correctly
- Use the browser console to debug permission parsing with `parsePermissionKey()`

---

# Previous Implementation Reference

## Why We Chose CASL

- The project is large and needs to scale in the future.
- We need fine-grained permissions (per page/tab/button).
- Ability to reuse permission logic in multiple places (Sidebar, Tabs, Table Actions, API).
- CASL provides a clean, customizable, and extensible API.
- Supports both RBAC and ABAC.

# Useful Links
- [CASL Documentation](https://casl.js.org/)
- [RBAC Guide](https://en.wikipedia.org/wiki/Role-based_access_control)
- [ABAC Guide](https://en.wikipedia.org/wiki/Attribute-based_access_control)
