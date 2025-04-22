"use client";

import React from 'react';
import { TableBuilder, useTableInstance } from '@/modules/table';
import { Button } from '@/components/ui/button';

export default function TableRowSelectionExample() {
  // Define the table configuration with row selection enabled
  const tableConfig = {
    url: '/api/users', // Replace with your actual API endpoint
    tableId: 'users-table',
    // Row selection is now enabled by default, no need to set enableRowSelection: true
    columns: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true, searchable: true },
      { key: 'email', label: 'Email', sortable: true, searchable: true },
      { key: 'role', label: 'Role', sortable: true, searchable: true },
    ],
    // Mock data for demonstration purposes
    dataMapper: (response: any) => {
      // If the API isn't available, return mock data
      if (!response || response.error) {
        return [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
          { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
          { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Viewer' },
        ];
      }
      return response.data || [];
    },
  };

  // Get the table instance to access selection state and actions
  const { selectedRows, clearSelectedRows } = useTableInstance('users-table');
  
  // Calculate the number of selected rows
  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  
  // Handle bulk action on selected rows
  const handleBulkAction = () => {
    // Get the IDs of selected rows
    const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
    
    // In a real application, you would perform an action with these IDs
    alert(`Selected IDs: ${selectedIds.join(', ')}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Table Row Selection Example</h1>
      
      {/* Show bulk action buttons when rows are selected */}
      {selectedCount > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-md flex items-center justify-between">
          <span className="text-sm font-medium">{selectedCount} row(s) selected</span>
          <div className="space-x-2">
            <Button variant="default" size="sm" onClick={handleBulkAction}>
              Bulk Action
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelectedRows}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}
      
      {/* Render the table with row selection enabled */}
      <TableBuilder config={tableConfig} />
      
      {/* Documentation */}
      <div className="mt-8 p-4 border rounded-md bg-muted/30">
        <h2 className="text-lg font-semibold mb-2">How to Use Row Selection & Export</h2>
        <p className="mb-2">
          This example demonstrates the row selection and export features of the TableBuilder component.
          You can select individual rows by clicking the checkboxes, or select all rows at once
          using the checkbox in the header. Once rows are selected, you can export them using the
          Export button in the search bar.
        </p>
        <h3 className="text-md font-semibold mt-4 mb-2">Implementation Details:</h3>
        <pre className="bg-background p-3 rounded-md text-sm overflow-x-auto">
{`// Row selection is enabled by default
const tableConfig = {
  url: '/api/users',
  tableId: 'users-table',
  // Set enableRowSelection: false to disable row selection if needed
  columns: [
    // column definitions
  ]
};

// The export button will call the API with the selected rows
// The API endpoint will be: /api/users/export
// The request body will include the selected row IDs:
// {
//   ids: ['1', '2', '3'],
//   format: 'csv' | 'json'
// }

// Access the selection state
const { selectedRows, clearSelectedRows } = useTableInstance('users-table');

// Get selected IDs
const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);`}
        </pre>
      </div>
    </div>
  );
}
