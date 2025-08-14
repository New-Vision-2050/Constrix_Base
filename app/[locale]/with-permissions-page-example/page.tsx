"use client";

import { withPermissionsPage } from "@/lib/permissions/client/withPermissionsPage";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function ExampleProtectedPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Protected Page Example</h1>
      <p className="text-gray-600 mb-4">
        This page is protected and only users with specific permissions can
        access it.
      </p>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        ✅ You have the required permissions to view this page!
      </div>
    </div>
  );
}

// Export the page wrapped with permission checking
// This will show the NotAuthorized component if the user doesn't have admin permissions
export default withPermissionsPage(
  ExampleProtectedPage,
  [PERMISSIONS.user.view],
  {
    notAuthorizedTitle: "Access Restricted",
    notAuthorizedMessage:
      "You need user viewing permissions to access this example page",
    showHomeLink: true,
    showBackButton: true,
  }
);
