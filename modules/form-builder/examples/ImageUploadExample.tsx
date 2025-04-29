"use client";

import React from "react";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

const ImageUploadExample: React.FC = () => {
  // Define the form configuration with an image upload field
  const formConfig: FormConfig = {
    title: "Image Upload Example",
    description: "This form demonstrates the image upload field functionality",
    sections: [
      {
        title: "Basic Information",
        fields: [
          {
            type: "text",
            name: "name",
            label: "Name",
            placeholder: "Enter your name",
            required: true,
            validation: [
              {
                type: "required",
                message: "Name is required",
              },
            ],
          },
          {
            type: "image",
            name: "profileImage",
            label: "Profile Image",
            required: true,
            validation: [
              {
                type: "required",
                message: "ImageRequired",
              },
            ],
            imageConfig: {
              allowedFileTypes: ["image/jpeg", "image/png", "image/gif"],
              maxFileSize: 5 * 1024 * 1024, // 5MB
              previewWidth: 200,
              previewHeight: 200,
              // If you have an upload endpoint, you can specify it here
              // uploadUrl: "/api/upload-image",
              // uploadHeaders: {
              //   Authorization: "Bearer your-token",
              // },
            },
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image",
            imageConfig: {
              allowedFileTypes: ["image/jpeg", "image/png"],
              maxFileSize: 10 * 1024 * 1024, // 10MB
              previewWidth: 400,
              previewHeight: 200,
            },
          },
        ],
      },
    ],
    submitButtonText: "حفظ",
    resetButtonText: "Reset",
    showReset: true,
    onSubmit: async (values) => {
      // In a real application, you would handle the form submission here
      console.log("Form values:", values);

      // For demonstration purposes, we'll just return a success response
      return {
        success: true,
        message: "Form submitted successfully",
      };
    },
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Image Upload Form Example</h1>

      <SheetFormBuilder
        config={formConfig}
        trigger={<Button>Open Form</Button>}
        onSuccess={(values: Record<string, any>) => {
          console.log("Form submitted successfully:", values);
          alert("Form submitted successfully!");
        }}
      />

      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Usage Notes:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            The image upload field supports both local file selection and remote URLs.
          </li>
          <li>
            You can configure allowed file types, maximum file size, and preview dimensions.
          </li>
          <li>
            If you provide an <code>uploadUrl</code>, the image will be automatically uploaded to that endpoint.
          </li>
          <li>
            The field value will be either a File object (for local files without upload) or a string URL (for uploaded files or provided URLs).
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadExample;
