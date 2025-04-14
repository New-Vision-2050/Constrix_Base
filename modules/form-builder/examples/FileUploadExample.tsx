"use client";

import React from "react";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

const FileUploadExample: React.FC = () => {
  // Define the form configuration with file upload fields
  const formConfig: FormConfig = {
    title: "File Upload Example",
    description: "This form demonstrates the file upload field functionality",
    sections: [
      {
        title: "Document Information",
        fields: [
          {
            type: "text",
            name: "documentTitle",
            label: "Document Title",
            placeholder: "Enter document title",
            required: true,
            validation: [
              {
                type: "required",
                message: "Document title is required",
              },
            ],
          },
          {
            type: "select",
            name: "documentType",
            label: "Document Type",
            options: [
              { value: "contract", label: "Contract" },
              { value: "report", label: "Report" },
              { value: "invoice", label: "Invoice" },
              { value: "other", label: "Other" },
            ],
            required: true,
            validation: [
              {
                type: "required",
                message: "Document type is required",
              },
            ],
          },
          {
            type: "file",
            name: "mainDocument",
            label: "Main Document",
            required: true,
            validation: [
              {
                type: "required",
                message: "Main document is required",
              },
            ],
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", 
                "application/msword", 
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ],
              maxFileSize: 10 * 1024 * 1024, // 10MB
              showThumbnails: true,
              // If you have an upload endpoint, you can specify it here
              // uploadUrl: "/api/upload-file",
              // uploadHeaders: {
              //   Authorization: "Bearer your-token",
              // },
            },
          },
          {
            type: "file",
            name: "attachments",
            label: "Attachments",
            isMulti: true, // Enable multiple file upload
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", 
                "application/msword", 
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "image/jpeg",
                "image/png",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              ],
              maxFileSize: 5 * 1024 * 1024, // 5MB per file
              showThumbnails: true,
            },
          },
        ],
      },
    ],
    submitButtonText: "Submit Documents",
    resetButtonText: "Reset",
    showReset: true,
    onSubmit: async (values) => {
      // In a real application, you would handle the form submission here
      console.log("Form values:", values);
      
      // For demonstration purposes, we'll just return a success response
      return {
        success: true,
        message: "Documents submitted successfully",
      };
    },
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">File Upload Example</h1>
      
      <SheetFormBuilder
        config={formConfig}
        trigger={<Button>Open Form</Button>}
        onSuccess={(values: Record<string, any>) => {
          console.log("Form submitted successfully:", values);
          alert("Documents submitted successfully!");
        }}
      />
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Usage Notes:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            The file upload field supports both single and multiple file uploads.
          </li>
          <li>
            Files are displayed with appropriate icons based on their type.
          </li>
          <li>
            You can configure allowed file types, maximum file size, and more.
          </li>
          <li>
            For multiple file uploads, use the <code>isMulti: true</code> property.
          </li>
          <li>
            If you provide an <code>uploadUrl</code>, files will be automatically uploaded to that endpoint.
          </li>
          <li>
            The field value will be either a File object (for local files without upload) or a string URL (for uploaded files).
          </li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Example:</h2>
        <pre className="bg-black text-white p-4 rounded-md overflow-auto text-sm">
{`// Single file upload
{
  type: "file",
  name: "document",
  label: "Document",
  required: true,
  fileConfig: {
    allowedFileTypes: ["application/pdf", "application/msword"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    showThumbnails: true
  }
}

// Multiple file upload
{
  type: "file",
  name: "attachments",
  label: "Attachments",
  isMulti: true,
  fileConfig: {
    allowedFileTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxFileSize: 5 * 1024 * 1024, // 5MB per file
    showThumbnails: true
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default FileUploadExample;