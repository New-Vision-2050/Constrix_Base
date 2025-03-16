"use client";
import React from "react";
import { SheetFormBuilder, useSheetForm, FormConfig } from "@/modules/form-builder";
import { TableBuilder, useTableReload, TableConfig } from "@/modules/table";
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
      label: "ID", // Changed from header to label
      width: "80px", // Changed from number to string with px
    },
    {
      key: "name",
      label: "Name", // Changed from header to label
      searchable: true,
    },
    {
      key: "description",
      label: "Description", // Changed from header to label
      searchable: true,
    },
    {
      key: "createdAt",
      label: "Created At", // Changed from header to label
      render: (value: string) => new Date(value).toLocaleDateString(), // Changed from formatter to render
    },
  ],
  enableSearch: true,
  enablePagination: true,
  enableSorting: true,
};

export default function FormTestPage() {
  // Get the table reload function
  const { reloadTable } = useTableReload();

  // Initialize the form with the reload function in the onSuccess callback
  const formHook = useSheetForm({
    config: formConfig,
    onSuccess: () => {
      // Reload the table after successful form submission
      reloadTable();
    },
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
        onSuccess={() => reloadTable()}
      />
      
      {/* Table component */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <TableBuilder config={tableConfig} />
      </div>
    </div>
  );
}