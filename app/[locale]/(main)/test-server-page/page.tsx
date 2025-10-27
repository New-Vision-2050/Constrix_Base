"use client";

import CreateRoleForm from "@/modules/roles/components/create-role";
import RoleDrawer from "@/modules/roles/components/create-role/update-drawer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function TextServerPage() {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  return (
    <div className="p-6 space-y-12">
      {/* Create Mode Example */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-blue-500">
          Create Mode Example
        </h2>
        <CreateRoleForm />
      </div>

      {/* Edit Mode Example */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-green-500">
          Edit Mode Example
        </h2>
        <CreateRoleForm
          editMode={{
            roleId: "sample-role-123",
            roleName: "Sample Admin Role",
            permissionKeys: ["users:create", "users:update", "roles:view"],
          }}
        />
      </div>

      {/* Create Drawer Example */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-purple-500">
          Create Role Drawer Example
        </h2>
        <Button onClick={() => setCreateDrawerOpen(true)}>
          Open Create Role Drawer
        </Button>

        <RoleDrawer
          open={createDrawerOpen}
          onClose={() => setCreateDrawerOpen(false)}
          // No roleId = Create mode
          onSuccess={() => {
            console.log("Role created successfully!");
          }}
        />
      </div>

      {/* Update Drawer Example */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-orange-500">
          Update Role Drawer Example
        </h2>
        <Button onClick={() => setEditDrawerOpen(true)}>
          Open Update Role Drawer
        </Button>

        <RoleDrawer
          open={editDrawerOpen}
          onClose={() => setEditDrawerOpen(false)}
          roleId="7266ee17-1688-46b0-9c5a-39a941243629" // Replace with actual role ID
          onSuccess={() => {
            console.log("Role updated successfully!");
            // You can add any additional logic here, like:
            // - Show a success toast
            // - Refresh a table
            // - Navigate to another page
            // - Update some global state
          }}
        />
      </div>
    </div>
  );
}

export default TextServerPage;
