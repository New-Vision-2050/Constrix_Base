"use client";

import React from "react";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

const MultiImageUploadExample: React.FC = () => {
  // Define the form configuration with multi-image upload fields
  const formConfig: FormConfig = {
    title: "Multi-Image Upload Example",
    description: "This form demonstrates the multi-image upload field functionality",
    sections: [
      {
        title: "Product Information",
        fields: [
          {
            type: "text",
            name: "productName",
            label: "Product Name",
            placeholder: "Enter product name",
            required: true,
            validation: [
              {
                type: "required",
                message: "Product name is required",
              },
            ],
          },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            placeholder: "Enter product description",
          },
          {
            type: "image",
            name: "productImages",
            label: "Product Images",
            isMulti: true, // Enable multi-image upload
            required: true,
            validation: [
              {
                type: "required",
                message: "At least one product image is required",
              },
            ],
            imageConfig: {
              allowedFileTypes: ["image/jpeg", "image/png", "image/gif"],
              maxFileSize: 5 * 1024 * 1024, // 5MB per image
              previewWidth: 150,
              previewHeight: 150,
              // If you have an upload endpoint, you can specify it here
              // uploadUrl: "/api/upload-images",
              // uploadHeaders: {
              //   Authorization: "Bearer your-token",
              // },
            },
          },
          {
            type: "image",
            name: "thumbnailImage",
            label: "Thumbnail Image (Single)",
            required: true,
            validation: [
              {
                type: "required",
                message: "Thumbnail image is required",
              },
            ],
            imageConfig: {
              allowedFileTypes: ["image/jpeg", "image/png"],
              maxFileSize: 2 * 1024 * 1024, // 2MB
              previewWidth: 200,
              previewHeight: 200,
            },
          },
        ],
      },
    ],
    submitButtonText: "Save Product",
    resetButtonText: "Reset",
    showReset: true,
    onSubmit: async (values) => {
      // In a real application, you would handle the form submission here
      console.log("Form values:", values);
      
      // For demonstration purposes, we'll just return a success response
      return {
        success: true,
        message: "Product saved successfully",
      };
    },
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Multi-Image Upload Example</h1>
      
      <SheetFormBuilder
        config={formConfig}
        trigger={<Button>Open Form</Button>}
        onSuccess={(values: Record<string, any>) => {
          console.log("Form submitted successfully:", values);
          alert("Product saved successfully!");
        }}
      />
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Usage Notes:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            The multi-image upload field allows selecting multiple files at once.
          </li>
          <li>
            Each image can be removed individually by clicking the X button.
          </li>
          <li>
            You can add more images at any time by clicking the "Add More Images" button.
          </li>
          <li>
            The field value will be an array of File objects or URLs, depending on whether an upload endpoint is provided.
          </li>
          <li>
            To enable multi-image upload, simply add <code>isMulti: true</code> to your image field configuration.
          </li>
          <li>
            The same validation rules apply to multi-image fields as to single image fields.
          </li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Example:</h2>
        <pre className="bg-black text-white p-4 rounded-md overflow-auto text-sm">
{`{
  type: "image",
  name: "productImages",
  label: "Product Images",
  isMulti: true, // Enable multi-image upload
  required: true,
  validation: [
    {
      type: "required",
      message: "At least one product image is required",
    },
  ],
  imageConfig: {
    allowedFileTypes: ["image/jpeg", "image/png"],
    maxFileSize: 5 * 1024 * 1024, // 5MB per image
    previewWidth: 150,
    previewHeight: 150,
  },
}`}
        </pre>
      </div>
    </div>
  );
};

export default MultiImageUploadExample;