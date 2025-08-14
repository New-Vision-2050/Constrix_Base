# Permission HOCs Documentation

This document explains how to use the new page-level permission HOCs that provide built-in "Not Authorized" handling.

## Components Created

### 1. NotAuthorized Component

Location: `components/shared/NotAuthorized.tsx`

A reusable component that displays a user-friendly "Access Denied" page with:

- 403 error code display
- Shield icon
- Customizable title and message
- Optional home and back buttons

### 2. withPermissionsPage (Client-side HOC)

Location: `lib/permissions/client/withPermissionsPage.tsx`

A client-side Higher Order Component that wraps page components with permission checking and shows the NotAuthorized component when access is denied.

### 3. withServerPermissionsPage (Server-side HOC)

Location: `lib/permissions/server/withServerPermissionsPage.tsx`

A server-side Higher Order Component that wraps page components with permission checking and shows the NotAuthorized component when access is denied.

## Usage Examples

### Client-Side Page Protection

```tsx
// pages/admin/dashboard.tsx
"use client";

import { withPermissionsPage } from "@/lib/permissions/client/withPermissionsPage";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Only administrators can see this page</p>
    </div>
  );
}

// Export the protected component
export default withPermissionsPage(AdminDashboard, [PERMISSIONS.admin.view]);
```

### Server-Side Page Protection

```tsx
// app/admin/users/page.tsx
import { withServerPermissionsPage } from "@/lib/permissions/server/withServerPermissionsPage";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function UserManagementPage() {
  return (
    <div>
      <h1>User Management</h1>
      <p>Manage users and their permissions</p>
    </div>
  );
}

export default withServerPermissionsPage(
  UserManagementPage,
  [PERMISSIONS.user.view],
  {
    notAuthorizedTitle: "User Management Access Required",
    notAuthorizedMessage:
      "You need user management permissions to access this page",
  }
);
```

### Complex Permission Logic

```tsx
// Multiple permission requirements (AND logic)
export default withPermissionsPage(Component, ["read", "write"]);

// Alternative permissions (OR logic)
export default withPermissionsPage(Component, [["admin", "moderator"]]);

// Mixed logic
export default withPermissionsPage(Component, ["read", ["admin", "editor"]]);
```

### Custom Not Authorized Styling

```tsx
export default withPermissionsPage(Component, ["admin"], {
  notAuthorizedTitle: "Admin Only",
  notAuthorizedMessage: "This section requires administrator privileges",
  showHomeLink: true,
  showBackButton: false,
  strict: true,
});
```

## Options

Both HOCs accept the same options:

- `notAuthorizedTitle`: Custom title for the not authorized page
- `notAuthorizedMessage`: Custom message explaining why access is denied
- `showHomeLink`: Whether to show "Go to Home" button (default: true)
- `showBackButton`: Whether to show "Go Back" button (default: true)
- `strict`: Whether to use strict permission checking (default: false)

## Migration from Existing HOCs

If you were using the basic `withPermissions` or `withServerPermissions` HOCs with custom fallbacks for pages, you can now use these page-specific HOCs:

### Before:

```tsx
export default withPermissions(MyPage, ["admin"], {
  fallback: <div>Access denied</div>,
});
```

### After:

```tsx
export default withPermissionsPage(MyPage, ["admin"]);
```

This provides a much better user experience with proper styling, navigation options, and consistent messaging.
