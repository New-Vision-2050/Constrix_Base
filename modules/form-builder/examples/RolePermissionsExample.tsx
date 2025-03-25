"use client";

import React from "react";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

const RolePermissionsExample: React.FC = () => {
  // Define the form configuration with role and permissions
  const formConfig: FormConfig = {
    title: "Role & Permissions",
    description: "Create or edit a role with specific permissions",
    sections: [
      {
        title: "Role Information",
        fields: [
          {
            type: "text",
            name: "roleName",
            label: "Role Name",
            placeholder: "Enter role name",
            required: true,
            validation: [
              {
                type: "required",
                message: "Role name is required",
              },
            ],
          },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            placeholder: "Enter role description",
          },
        ],
      },
      {
        title: "User Management Permissions",
        description: "Permissions related to user management",
        fields: [
          {
            type: "checkbox",
            name: "permissions.users.view",
            label: "View Users",
          },
          {
            type: "checkbox",
            name: "permissions.users.create",
            label: "Create Users",
          },
          {
            type: "checkbox",
            name: "permissions.users.edit",
            label: "Edit Users",
          },
          {
            type: "checkbox",
            name: "permissions.users.delete",
            label: "Delete Users",
          },
        ],
      },
      {
        title: "Company Management Permissions",
        description: "Permissions related to company management",
        fields: [
          {
            type: "checkbox",
            name: "permissions.companies.view",
            label: "View Companies",
          },
          {
            type: "checkbox",
            name: "permissions.companies.create",
            label: "Create Companies",
          },
          {
            type: "checkbox",
            name: "permissions.companies.edit",
            label: "Edit Companies",
          },
          {
            type: "checkbox",
            name: "permissions.companies.delete",
            label: "Delete Companies",
          },
        ],
      },
      {
        title: "Report Permissions",
        description: "Permissions related to reports",
        fields: [
          {
            type: "checkbox",
            name: "permissions.reports.view",
            label: "View Reports",
          },
          {
            type: "checkbox",
            name: "permissions.reports.export",
            label: "Export Reports",
          },
        ],
      },
      {
        title: "Settings Permissions",
        description: "Permissions related to system settings",
        fields: [
          {
            type: "checkbox",
            name: "permissions.settings.view",
            label: "View Settings",
          },
          {
            type: "checkbox",
            name: "permissions.settings.edit",
            label: "Edit Settings",
          },
        ],
      },
    ],
    submitButtonText: "Save Role",
    resetButtonText: "Reset",
    showReset: true,
    // Add a select all checkbox for each permission group
    initialValues: {
      // Default values can be set here
      roleName: "",
      description: "",
      "permissions.users.view": false,
      "permissions.users.create": false,
      "permissions.users.edit": false,
      "permissions.users.delete": false,
      "permissions.companies.view": false,
      "permissions.companies.create": false,
      "permissions.companies.edit": false,
      "permissions.companies.delete": false,
      "permissions.reports.view": false,
      "permissions.reports.export": false,
      "permissions.settings.view": false,
      "permissions.settings.edit": false,
    },
    onSubmit: async (values) => {
      // In a real application, you would handle the form submission here
      console.log("Form values:", values);
      
      // For demonstration purposes, we'll just return a success response
      return {
        success: true,
        message: "Role saved successfully",
      };
    },
  };

  // Add a custom section with "Select All" functionality
  const SelectAllSection: React.FC<{
    title: string;
    permissions: string[];
    values: Record<string, any>;
    onChange: (field: string, value: any) => void;
  }> = ({ title, permissions, values, onChange }) => {
    // Check if all permissions in this section are selected
    const allSelected = permissions.every((perm) => values[perm]);
    
    // Handle select all checkbox change
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      permissions.forEach((perm) => {
        onChange(perm, isChecked);
      });
    };
    
    return (
      <div className="mb-6 border rounded-md p-4">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-medium flex-1">{title}</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`select-all-${title}`}
              checked={allSelected}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor={`select-all-${title}`} className="ml-2 text-sm font-medium">
              Select All
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {permissions.map((perm) => (
            <div key={perm} className="flex items-center">
              <input
                type="checkbox"
                id={perm}
                checked={values[perm] || false}
                onChange={(e) => onChange(perm, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={perm} className="ml-2 text-sm">
                {perm.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Role & Permissions Management</h1>
      
      <SheetFormBuilder
        config={formConfig}
        trigger={<Button>Create New Role</Button>}
        onSuccess={(values: Record<string, any>) => {
          console.log("Role saved successfully:", values);
          alert("Role saved successfully!");
        }}
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Custom Implementation with "Select All" Functionality</h2>
        <p className="mb-4">
          Below is a custom implementation that adds "Select All" functionality for each permission group:
        </p>
        
        <div className="border rounded-md p-6 bg-muted/50">
          <h3 className="text-lg font-bold mb-4">Create Role</h3>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Role Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md" 
              placeholder="Enter role name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Description</label>
            <textarea 
              className="w-full p-2 border rounded-md" 
              rows={3}
              placeholder="Enter role description"
            />
          </div>
          
          <SelectAllSection
            title="User Management"
            permissions={[
              "permissions.users.view",
              "permissions.users.create",
              "permissions.users.edit",
              "permissions.users.delete"
            ]}
            values={{}}
            onChange={() => {}}
          />
          
          <SelectAllSection
            title="Company Management"
            permissions={[
              "permissions.companies.view",
              "permissions.companies.create",
              "permissions.companies.edit",
              "permissions.companies.delete"
            ]}
            values={{}}
            onChange={() => {}}
          />
          
          <div className="mt-6">
            <Button>Save Role</Button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded-md">
          <h2 className="text-lg font-semibold mb-2">Implementation Notes:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              The form builder supports checkbox fields for permissions.
            </li>
            <li>
              Permissions are organized into logical sections for better usability.
            </li>
            <li>
              The custom implementation shows how to add "Select All" functionality for each permission group.
            </li>
            <li>
              You can extend this example to include role-based access control (RBAC) features.
            </li>
            <li>
              For a real application, you would typically save these permissions to a database and use them for authorization checks.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsExample;