"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder, useFormData, FormConfig } from "@/modules/form-builder";

// Example form configuration with edit mode support
const editableFormConfig: FormConfig = {
  formId: "editable-form",
  title: "Editable Form Example",
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
  cancelButtonText: "Cancel",
  showSubmitLoader: true,
  resetOnSuccess: false,
  initialValues: {
    name: "",
    email: "",
    phone: "",
    bio: "",
    role: "",
  },
  // Edit mode configuration - direct values example
  editValues: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Software developer with 5 years of experience",
    role: "admin",
  },
  // API example (commented out - would be used instead of editValues)
  // editApiUrl: "/api/users/:id",
  // editDataPath: "data",
  onSubmit: async (values) => {
    // Simulate API call
    console.log("Form values:", values);

    // Simulate successful submission
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Form submitted successfully",
        });
      }, 1000);
    });
  },
};

// Example form configuration with API-based edit mode
const apiEditFormConfig: FormConfig = {
  ...editableFormConfig,
  formId: "api-edit-form",
  title: "API Edit Form Example",
  description: "This form demonstrates loading data from an API for editing",
  // Remove direct edit values
  editValues: undefined,
  // Add API configuration - this is a real API endpoint
  editApiUrl: "/api/users/:id",
  editDataPath: "data", // Path to the data in the API response
  // Optional data transformer
  editDataTransformer: (data) => {
    console.log("Transforming API data:", data);
    // Transform API data if needed
    return {
      ...data,
      // Add any transformations here if needed
    };
  },
};

export default function FormEditExample() {
  const [showDirectEditForm, setShowDirectEditForm] = useState(false);
  const [showApiEditForm, setShowApiEditForm] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  // Form with direct edit values
  const {
    isEditMode: isDirectEditMode,
    values: directEditValues,
  } = useFormData({
    config: editableFormConfig,
    onSuccess: () => {
      setShowDirectEditForm(false);
    },
    onError: (error) => {
      console.error("Form error:", error);
    },
  });

  // Form with API-based edit values
  const {
    isEditMode: isApiEditMode,
    isLoadingEditData,
    editError,
    loadData,
    values: apiEditValues,
  } = useFormData({
    config: apiEditFormConfig,
    recordId,
    onSuccess: () => {
      setShowApiEditForm(false);
      setRecordId(null);
    },
    onError: (error) => {
      console.error("Form error:", error);
    },
  });

  // Success handlers for the forms
  const handleDirectEditSuccess = (values: Record<string, any>) => {
    console.log("Direct edit form submitted:", values);
    setShowDirectEditForm(false);
  };

  const handleApiEditSuccess = (values: Record<string, any>) => {
    console.log("API edit form submitted:", values);
    setShowApiEditForm(false);
    setRecordId(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Form Edit Examples</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Direct Edit Form Example */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Direct Edit Form</h2>
          <p className="mb-4">
            This example uses direct values provided in the form configuration.
          </p>
          <Button
            onClick={() => setShowDirectEditForm(true)}
            className="mb-4"
          >
            Open Edit Form
          </Button>

          {showDirectEditForm && (
            <SheetFormBuilder
              config={editableFormConfig}
              trigger={<div />} // Empty trigger since we're controlling open state
              onSuccess={handleDirectEditSuccess}
              onCancel={() => setShowDirectEditForm(false)}
            />
          )}

          {isDirectEditMode && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-medium mb-2">Current Values:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(directEditValues, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* API Edit Form Example */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">API Edit Form</h2>
          <p className="mb-4">
            This example would load data from an API. For demo purposes, we&apos;re
            simulating an API call.
          </p>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => {
                setRecordId("123");
                setShowApiEditForm(true);
              }}
            >
              Edit User #123
            </Button>
            <Button
              onClick={() => {
                setRecordId("456");
                setShowApiEditForm(true);
              }}
            >
              Edit User #456
            </Button>
          </div>

          {showApiEditForm && (
            <SheetFormBuilder
              config={apiEditFormConfig}
              trigger={<div />} // Empty trigger since we're controlling open state
              onSuccess={handleApiEditSuccess}
              onCancel={() => setShowApiEditForm(false)}
              recordId={recordId || undefined}
            />
          )}

          {isLoadingEditData && <p>Loading data...</p>}
          {editError && <p className="text-red-500">Error: {editError}</p>}
          {isApiEditMode && !isLoadingEditData && !editError && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-medium mb-2">Current Values:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(apiEditValues, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}