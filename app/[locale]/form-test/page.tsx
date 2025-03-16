"use client";
import React from "react";
import { SheetFormBuilder, useSheetFormWithTableReload, FormConfig } from "@/modules/form-builder";
import { TableBuilder, TableConfig } from "@/modules/table";
import { Button } from "@/components/ui/button";

// Example form configuration
const formConfig: FormConfig = {
  title: "Add New Item",
  submitButtonText: "Submit",
  resetOnSuccess: true,
  sections: [
    {
      title: "Item Details",
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
        },
      ],
    },
  ],
  // This would be your actual API endpoint for form submission
  onSubmit: async (values: Record<string, any>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Return success response
    return {
      success: true,
      message: "Item added successfully",
    };
  },
};

// Example table configuration
const tableConfig: TableConfig = {
  url: "/api/items", // Your actual API endpoint for fetching table data
  columns: [
    {
      key: "id",
      label: "ID",
      width: "80px",
    },
    {
      key: "name",
      label: "Name",
      searchable: true,
    },
    {
      key: "description",
      label: "Description",
      searchable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ],
  enableSearch: true,
  enablePagination: true,
  enableSorting: true,
};

export default function FormTestPage() {
  // Initialize the form with automatic table reload
  const formHook = useSheetFormWithTableReload({
    config: formConfig,
    // The table will automatically reload after successful form submission
    // No need to manually call reloadTable in onSuccess
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Form and Table Integration Example</h1>
      
      <div className="flex justify-end">
        <Button onClick={formHook.openSheet}>Add New Item</Button>
      </div>
      
      {/* Form component */}
      <SheetFormBuilder
        config={formConfig}
        trigger={<Button>Open Form</Button>}
        onSuccess={() => {
          // The table will automatically reload because we're using useSheetFormWithTableReload
          console.log("Form submitted successfully");
        }}
      />
      
      {/* Table component */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <TableBuilder config={tableConfig} />
      </div>
    </div>
  );
}