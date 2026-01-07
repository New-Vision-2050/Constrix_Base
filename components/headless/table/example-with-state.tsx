"use client";
import React from "react";
import HeadlessTableLayout from "./index";
import { Box, Paper, Chip } from "@mui/material";

// ============================================================================
// Example Usage with State Pattern
// ============================================================================

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 7,
    name: "Eve Davis",
    email: "eve@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 8,
    name: "Frank Miller",
    email: "frank@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: 9,
    name: "Grace Lee",
    email: "grace@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 10,
    name: "Henry Wilson",
    email: "henry@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 11,
    name: "Ivy Chen",
    email: "ivy@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 12,
    name: "Jack Ryan",
    email: "jack@example.com",
    role: "User",
    status: "active",
  },
];

// Create typed table instance outside component
const UserTable = HeadlessTableLayout<User>();

export function ExampleWithState() {
  // Define columns
  const columns = [
    {
      key: "id",
      name: "ID",
      sortable: true,
      render: (row: User) => <span>#{row.id}</span>,
    },
    {
      key: "name",
      name: "Name",
      sortable: true,
      render: (row: User) => <strong>{row.name}</strong>,
    },
    {
      key: "email",
      name: "Email",
      sortable: false,
      render: (row: User) => <a href={`mailto:${row.email}`}>{row.email}</a>,
    },
    {
      key: "role",
      name: "Role",
      sortable: true,
      render: (row: User) => row.role,
    },
    {
      key: "status",
      name: "Status",
      sortable: true,
      render: (row: User) => (
        <Chip
          label={row.status}
          color={row.status === "active" ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  // Initialize table state with all configuration
  const state = UserTable.useState({
    data: mockUsers,
    columns,
    pagination: {
      page: 1,
      limit: 5,
      totalItems: mockUsers.length,
    },
    getRowId: (user) => user.id.toString(),
    initialSortBy: "name",
    loading: false,
    filtered: false,
    onExport: async (selectedRows) => {
      console.log("Exporting rows:", selectedRows);
      alert(`Exporting ${selectedRows.length} rows`);
    },
    onDelete: async (selectedRows) => {
      console.log("Deleting rows:", selectedRows);
      alert(`Deleting ${selectedRows.length} rows`);
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <UserTable
        filters={<UserTable.TopActions state={state} />}
        table={<UserTable.Table state={state} loadingOptions={{ rows: 5 }} />}
        pagination={<UserTable.Pagination state={state} />}
      />

      {/* Debug Info */}
      <Paper sx={{ p: 2, mt: 2 }} variant="outlined">
        <Box sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
          <div>Selected: {state.selection.selectedCount}</div>
          <div>
            Page: {state.pagination.page} / {state.pagination.totalPages}
          </div>
          <div>Limit: {state.pagination.limit}</div>
          <div>
            Sort: {state.table.sortBy} ({state.table.sortDirection})
          </div>
        </Box>
      </Paper>
    </Box>
  );
}
