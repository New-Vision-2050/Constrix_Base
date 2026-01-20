"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeadlessTableLayout from "./index";
import { Box, Paper, Chip, TextField, Button, Stack } from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";

// ============================================================================
// Example Usage with Two-Hook Pattern
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
// Simulated API function
const fetchUsers = async (
  page: number,
  limit: number,
  sortBy?: string,
  sortDirection?: "asc" | "desc",
  search?: string,
  role?: string,
): Promise<{ data: User[]; totalPages: number; totalItems: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const filtered = mockUsers.filter((user) => {
    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !role || role === "all" || user.role === role;
    return matchesSearch && matchesRole;
  });

  if (sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof User];
      const bVal = b[sortBy as keyof User];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === "desc" ? -comparison : comparison;
    });
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return { data: paginatedData, totalPages, totalItems };
};

export function ExampleWithState() {
  const UserTable = HeadlessTableLayout<User>();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = UserTable.useTableParams({
    initialPage: 1,
    initialLimit: 5,
    initialSortBy: "name",
    initialSortDirection: "asc",
  });

  // ✅ STEP 2: Fetch data using useQuery
  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      "users",
      params.page,
      params.limit,
      params.sortBy,
      params.sortDirection,
      searchQuery,
      roleFilter,
    ],
    queryFn: () =>
      fetchUsers(
        params.page,
        params.limit,
        params.sortBy,
        params.sortDirection,
        searchQuery,
        roleFilter,
      ),
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

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

  // ✅ STEP 3: useTableState (AFTER query)
  const state = UserTable.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (user: User) => user.id.toString(),
    loading: isLoading,
    filtered: searchQuery !== "" || roleFilter !== "all",
    onExport: async (selectedRows: User[]) => {
      console.log("Exporting rows:", selectedRows);
      alert(`Exporting ${selectedRows.length} rows`);
    },
    onDelete: async (selectedRows: User[]) => {
      console.log("Deleting rows:", selectedRows);
      alert(`Deleting ${selectedRows.length} rows`);
    },
  });

  const handleReset = () => {
    setSearchQuery("");
    setRoleFilter("all");
    params.reset();
  };

  return (
    <Box sx={{ p: 3 }}>
      <UserTable
        filters={
          <UserTable.TopActions
            state={state}
            searchComponent={<TextField fullWidth label="Search" />}
            customActions={<Button>Custom Action</Button>}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  params.setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                select
                size="small"
                label="Role"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  params.setPage(1);
                }}
                SelectProps={{ native: true }}
                sx={{ minWidth: 150 }}
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </TextField>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleReset}
              >
                Reset
              </Button>
            </Stack>
          </UserTable.TopActions>
        }
        table={<UserTable.Table state={state} loadingOptions={{ rows: 5 }} />}
        pagination={<UserTable.Pagination state={state} />}
      />

      {/* Debug Info */}
      <Paper sx={{ p: 2, mt: 2 }} variant="outlined">
        <Box sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
          <div>
            <strong>Two-Hook Pattern</strong>
          </div>
          <div>Selected: {state.selection.selectedCount}</div>
          <div>
            Page: {params.page} / {totalPages}
          </div>
          <div>Limit: {params.limit}</div>
          <div>Total Items: {totalItems}</div>
          <div>
            Sort: {params.sortBy} ({params.sortDirection})
          </div>
          <div>Loading: {isLoading ? "Yes" : "No"}</div>
          <div>
            Filters: {searchQuery || "(none)"} | Role: {roleFilter}
          </div>
        </Box>
      </Paper>
    </Box>
  );
}
