"use client";
import React from "react";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { TableBuilder, TableConfig } from "@/modules/table";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";

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
  onSubmit: async (formData: Record<string, unknown>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Log the form data (to use the parameter)
    console.log("Form data received:", formData);
    
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
  // Create a function to handle form success and reload the table
  const handleFormSuccess = (formData: Record<string, unknown>) => {
    // Import the store directly to avoid hooks in callbacks
    const tableStore = useTableStore.getState();
    
    // Manually trigger the reload logic
    tableStore.setLoading(true);
    setTimeout(() => {
      tableStore.setLoading(false);
    }, 100);
    
    console.log("Form submitted successfully:", formData);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Form and Table Integration Example</h1>
      
      <div className="flex justify-end">
        <Button onClick={() => {
          // Open the form using the SheetFormBuilder's trigger
          document.getElementById('open-form-button')?.click();
        }}>Add New Item</Button>
      </div>
      
      {/* Form component */}
      <SheetFormBuilder
        config={formConfig}
        trigger={<Button id="open-form-button">Open Form</Button>}
        onSuccess={handleFormSuccess}
      />
      
      {/* Table component */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <TableBuilder config={tableConfig} />
      </div>
    </div>
  );
}