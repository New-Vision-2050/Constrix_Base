"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";

// Example form configuration
const testFormConfig: FormConfig = {
  formId: "edit-test-form",
  title: "Edit Mode Test Form",
  description: "This form demonstrates the edit functionality",
  sections: [
    {
      title: "Basic Information",
      fields: [
        {
          type: "text",
          name: "name",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
          validation: [
            {
              type: "required",
              message: "Full name is required",
            },
          ],
        },
        {
          type: "email",
          name: "email",
          label: "Email Address",
          placeholder: "Enter your email address",
          required: true,
          validation: [
            {
              type: "required",
              message: "Email is required",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
            },
          ],
        },
        {
          type: "text",
          name: "phone",
          label: "Phone Number",
          placeholder: "Enter your phone number",
        },
      ],
    },
    {
      title: "Additional Information",
      fields: [
        {
          type: "textarea",
          name: "bio",
          label: "Bio",
          placeholder: "Tell us about yourself",
        },
        {
          type: "select",
          name: "role",
          label: "Role",
          placeholder: "Select your role",
          options: [
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
            { value: "manager", label: "Manager" },
          ],
        },
      ],
    },
  ],
  submitButtonText: "Save Changes",
  resetButtonText: "Reset",
  cancelButtonText: "إلغاء",
  showSubmitLoader: true,
  resetOnSuccess: false,
  initialValues: {
    name: "",
    email: "",
    phone: "",
    bio: "",
    role: "",
  },
};

// Test component for direct edit values
export const DirectEditTest: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Create a copy of the config with edit values
  const editConfig: FormConfig = {
    ...testFormConfig,
    isEditMode: true,
    editValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      bio: "Software developer with 5 years of experience",
      role: "admin",
    },
  };

  const handleSuccess = (values: Record<string, any>) => {
    console.log("Form submitted with values:", values);
    setIsOpen(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Direct Edit Values Test</h2>
      <Button onClick={() => setIsOpen(true)}>Open Edit Form</Button>

      {isOpen && (
        <SheetFormBuilder
          config={editConfig}
          onSuccess={handleSuccess}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Test component for API-based edit values
export const ApiEditTest: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  // Create a copy of the config with API edit configuration
  const apiEditConfig: FormConfig = {
    ...testFormConfig,
    editApiUrl: "/api/users/:id",
    editDataPath: "data",
  };

  const handleSuccess = (values: Record<string, any>) => {
    console.log("Form submitted with values:", values);
    setIsOpen(false);
    setRecordId(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Edit Values Test</h2>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setRecordId("123");
            setIsOpen(true);
          }}
        >
          Edit User #123
        </Button>
        <Button
          onClick={() => {
            setRecordId("456");
            setIsOpen(true);
          }}
        >
          Edit User #456
        </Button>
        <Button
          onClick={() => {
            setRecordId("999"); // Non-existent user to test error handling
            setIsOpen(true);
          }}
        >
          Edit Non-existent User
        </Button>
      </div>

      {isOpen && (
        <SheetFormBuilder
          config={apiEditConfig}
          recordId={recordId || undefined}
          onSuccess={handleSuccess}
          onCancel={() => {
            setIsOpen(false);
            setRecordId(null);
          }}
        />
      )}
    </div>
  );
};

// Combined test component
const EditModeTest: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Form Edit Mode Tests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <DirectEditTest />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ApiEditTest />
        </div>
      </div>
    </div>
  );
};

export default EditModeTest;
