"use client";
import React from "react";
import {
  SheetFormBuilder,
  FormConfig,
  useFormWithTableReload,
  useFormReload
} from "@/modules/form-builder";
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
  // Define unique IDs
  const formTestTableId = "form-test-table";
  const formId = "form-test-form";
  
  // Use the form with table reload hook
  const { reloadForm } = useFormReload();
  
  // Create a function to handle form success
  const handleFormSuccess = (data: Record<string, unknown>) => {
    console.log("Form submitted successfully:", data);
  };

  // Example of using the form with table reload hook
  const formWithTableReload = useFormWithTableReload({
    config: formConfig,
    tableId: formTestTableId,
    formId: formId,
    onSuccess: handleFormSuccess
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Form and Table Integration Example</h1>
      
      <div className="flex justify-end space-x-4">
        <Button onClick={() => {
          // Open the form using the SheetFormBuilder's trigger
          document.getElementById('open-form-button')?.click();
        }}>Add New Item</Button>
        
        <Button variant="outline" onClick={() => {
          // Manually reload the form
          reloadForm(formId);
        }}>Reset Form</Button>
        
        <Button variant="outline" onClick={() => {
          // Manually reload the table
          formWithTableReload.reloadTable();
        }}>Reload Table</Button>
      </div>
      
      {/* Form component */}
      <SheetFormBuilder
        config={formConfig}
        formId={formId}
        trigger={<Button id="open-form-button">Open Form</Button>}
        onSuccess={handleFormSuccess}
      />
      
      {/* Table component */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <TableBuilder
          config={tableConfig}
          tableId={formTestTableId} // Pass the unique table ID
        />
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Form with Table Reload Example</h2>
        <p className="mb-4">This example demonstrates using the form with table reload hook.</p>
        
        <Button onClick={formWithTableReload.openSheet}>
          Open Form with Table Reload
        </Button>
        
        {formWithTableReload.isOpen && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">{formConfig.title}</h3>
            
            <form onSubmit={(e) => formWithTableReload.handleSubmit(e)}>
              {formConfig.sections[0].fields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full p-2 border rounded"
                      value={formWithTableReload.values[field.name] || ''}
                      onChange={(e) => formWithTableReload.setValue(field.name, e.target.value)}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className="w-full p-2 border rounded"
                      value={formWithTableReload.values[field.name] || ''}
                      onChange={(e) => formWithTableReload.setValue(field.name, e.target.value)}
                    />
                  )}
                  
                  {formWithTableReload.errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formWithTableReload.errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={formWithTableReload.handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formWithTableReload.isSubmitting}>
                  {formWithTableReload.isSubmitting ? 'Submitting...' : formConfig.submitButtonText}
                </Button>
              </div>
              
              {formWithTableReload.submitError && (
                <p className="text-red-500 mt-4">{formWithTableReload.submitError}</p>
              )}
              
              {formWithTableReload.submitSuccess && (
                <p className="text-green-500 mt-4">Form submitted successfully!</p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}