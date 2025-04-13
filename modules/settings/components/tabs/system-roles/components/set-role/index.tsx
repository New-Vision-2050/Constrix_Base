"use client";
import { Button } from "@/components/ui/button";
import { baseURL } from "@/config/axios-config";
import { FormConfig, SheetFormBuilder } from "@/modules/form-builder";
import { useEffect, useState } from "react";

export function SetRoleForm() {
  const [formValues, setFormValues] = useState<Record<string, any>>({
    roleName: "",
    description: "",
    // User permissions
    "permissions.users.view": false,
    "permissions.users.create": false,
    "permissions.users.edit": false,
    "permissions.users.delete": false,
    // Company permissions
    "permissions.companies.view": false,
    "permissions.companies.create": false,
    "permissions.companies.edit": false,
    "permissions.companies.delete": false,
    // Report permissions
    "permissions.reports.view": false,
    "permissions.reports.export": false,
    // Settings permissions
    "permissions.settings.view": false,
    "permissions.settings.edit": false,
    // Select all checkboxes
    "selectAll.users": false,
    "selectAll.companies": false,
    "selectAll.reports": false,
    "selectAll.settings": false,
  });

  // Permission groups
  const permissionGroups: Record<string, string[]> = {
    users: [
      "permissions.users.view",
      "permissions.users.create",
      "permissions.users.edit",
      "permissions.users.delete",
    ],
    companies: [
      "permissions.companies.view",
      "permissions.companies.create",
      "permissions.companies.edit",
      "permissions.companies.delete",
    ],
    reports: ["permissions.reports.view", "permissions.reports.export"],
    settings: ["permissions.settings.view", "permissions.settings.edit"],
  };

  // Update select all checkboxes when individual permissions change
  useEffect(() => {
    const newValues = { ...formValues };

    // Check each permission group
    Object.entries(permissionGroups).forEach(([group, permissions]) => {
      const allSelected = permissions.every((perm) => formValues[perm]);
      newValues[`selectAll.${group}`] = allSelected;
    });

    setFormValues(newValues);
  }, [
    formValues["permissions.users.view"],
    formValues["permissions.users.create"],
    formValues["permissions.users.edit"],
    formValues["permissions.users.delete"],
    formValues["permissions.companies.view"],
    formValues["permissions.companies.create"],
    formValues["permissions.companies.edit"],
    formValues["permissions.companies.delete"],
    formValues["permissions.reports.view"],
    formValues["permissions.reports.export"],
    formValues["permissions.settings.view"],
    formValues["permissions.settings.edit"],
  ]);

  const formConfig: FormConfig = {
    title: "Advanced Role & Permissions",
    description:
      "Create or edit a role with specific permissions and select all functionality",
    apiUrl: `${baseURL}/role_and_permissions/roles`,
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
            name: "selectAll.users",
            label: "Select All User Permissions",
          },
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
            name: "selectAll.companies",
            label: "Select All Company Permissions",
          },
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
            name: "selectAll.reports",
            label: "Select All Report Permissions",
          },
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
            name: "selectAll.settings",
            label: "Select All Settings Permissions",
          },
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
    wizard: true,
    wizardOptions: {
      showStepIndicator: false,
      showStepTitles: false,
      validateStepBeforeNext: true,
      allowStepNavigation: false,
      nextButtonText: "Continue",
      prevButtonText: "Back",
      finishButtonText: "حفظ",
    },
    submitButtonText: "Save Role",
  };

  return (
    <SheetFormBuilder
      config={{
        ...formConfig,
        // Add onChange handlers to each field
        sections: formConfig.sections.map((section) => ({
          ...section,
          fields: section.fields.map((field) => {
            // Add onChange handler to select all checkboxes
            if (field.name.startsWith("selectAll.")) {
              const group = field.name.split(".")[1];
              return {
                ...field,
                onChange: (value: boolean, values: Record<string, any>) => {
                  // Update all permissions in the group
                  const newValues = { ...values };
                  // Ensure group is a valid key in permissionGroups
                  if (group in permissionGroups) {
                    permissionGroups[group].forEach((perm) => {
                      newValues[perm] = value;
                    });
                  }

                  // Update form values
                  setFormValues(newValues);
                  return newValues;
                },
              };
            }

            // Add onChange handler to permission checkboxes
            if (field.name.startsWith("permissions.")) {
              const [_, category] = field.name.split(".");
              return {
                ...field,
                onChange: (value: boolean, values: Record<string, any>) => {
                  // Check if all permissions in the group are selected
                  const newValues = { ...values, [field.name]: value };
                  const allSelected = permissionGroups[category].every((perm) =>
                    perm === field.name ? value : newValues[perm]
                  );

                  // Update the select all checkbox
                  newValues[`selectAll.${category}`] = allSelected;

                  // Update form values
                  setFormValues(newValues);
                  return newValues;
                },
              };
            }

            return field;
          }),
        })),
      }}
      trigger={<Button>Add Role</Button>}
      onSuccess={(values: Record<string, any>) => {
        console.log("Role saved successfully:", values);
        alert("Role saved successfully!");
      }}
    />
  );
}
