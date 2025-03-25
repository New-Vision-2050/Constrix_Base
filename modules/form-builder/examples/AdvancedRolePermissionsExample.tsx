"use client";

import React, { useState, useEffect } from "react";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

const AdvancedRolePermissionsExample: React.FC = () => {
  // State to store form values
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
  const permissionGroups = {
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
    reports: [
      "permissions.reports.view",
      "permissions.reports.export",
    ],
    settings: [
      "permissions.settings.view",
      "permissions.settings.edit",
    ],
  };

  // Update select all checkboxes when individual permissions change
  useEffect(() => {
    const newValues = { ...formValues };
    
    // Check each permission group
    Object.entries(permissionGroups).forEach(([group, permissions]) => {
      const allSelected = permissions.every(perm => formValues[perm]);
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

  // Handle form value changes
  const handleValueChange = (values: Record<string, any>) => {
    setFormValues(values);
    
    // Handle select all checkboxes
    Object.entries(permissionGroups).forEach(([group, permissions]) => {
      const selectAllKey = `selectAll.${group}`;
      
      // If the select all checkbox was changed
      if (values[selectAllKey] !== formValues[selectAllKey]) {
        const newValues = { ...values };
        
        // Update all permissions in the group
        permissions.forEach(perm => {
          newValues[perm] = values[selectAllKey];
        });
        
        setFormValues(newValues);
      }
    });
  };

  // Define the form configuration with role and permissions
  const formConfig: FormConfig = {
    title: "Advanced Role & Permissions",
    description: "Create or edit a role with specific permissions and select all functionality",
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
    submitButtonText: "Save Role",
    resetButtonText: "Reset",
    showReset: true,
    initialValues: formValues,
    onSubmit: async (values) => {
      // Filter out the selectAll checkboxes before submitting
      const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (!key.startsWith('selectAll.')) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      console.log("Form values (filtered):", filteredValues);
      
      // For demonstration purposes, we'll just return a success response
      return {
        success: true,
        message: "Role saved successfully",
      };
    },
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Advanced Role & Permissions Management</h1>
      
      <SheetFormBuilder
        config={{
          ...formConfig,
          // Add onChange handlers to each field
          sections: formConfig.sections.map(section => ({
            ...section,
            fields: section.fields.map(field => {
              // Add onChange handler to select all checkboxes
              if (field.name.startsWith('selectAll.')) {
                const group = field.name.split('.')[1];
                return {
                  ...field,
                  onChange: (value: boolean, values: Record<string, any>) => {
                    // Update all permissions in the group
                    const newValues = { ...values };
                    permissionGroups[group].forEach(perm => {
                      newValues[perm] = value;
                    });
                    
                    // Update form values
                    setFormValues(newValues);
                    return newValues;
                  }
                };
              }
              
              // Add onChange handler to permission checkboxes
              if (field.name.startsWith('permissions.')) {
                const [_, category] = field.name.split('.');
                return {
                  ...field,
                  onChange: (value: boolean, values: Record<string, any>) => {
                    // Check if all permissions in the group are selected
                    const newValues = { ...values, [field.name]: value };
                    const allSelected = permissionGroups[category].every(perm =>
                      perm === field.name ? value : newValues[perm]
                    );
                    
                    // Update the select all checkbox
                    newValues[`selectAll.${category}`] = allSelected;
                    
                    // Update form values
                    setFormValues(newValues);
                    return newValues;
                  }
                };
              }
              
              return field;
            })
          }))
        }}
        trigger={<Button>Create New Role</Button>}
        onSuccess={(values: Record<string, any>) => {
          console.log("Role saved successfully:", values);
          alert("Role saved successfully!");
        }}
      />
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            This advanced implementation includes "Select All" checkboxes for each permission group.
          </li>
          <li>
            The "Select All" functionality is implemented using React state and the onChange handler.
          </li>
          <li>
            When a "Select All" checkbox is checked, all permissions in that group are automatically checked.
          </li>
          <li>
            When all permissions in a group are checked individually, the "Select All" checkbox is automatically checked.
          </li>
          <li>
            The "Select All" checkboxes are filtered out before submitting the form data.
          </li>
          <li>
            This approach provides a better user experience for managing multiple permissions.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedRolePermissionsExample;