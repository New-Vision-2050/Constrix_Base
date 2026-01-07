"use client";
import React, { useState } from "react";
import HeadlessTableLayout from "./index";
import {
  Box,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Pagination,
  Link,
} from "@mui/material";
import {
  Edit,
  Delete,
  Refresh,
  FilterAlt,
  FilterAltOff,
} from "@mui/icons-material";

// ============================================================================
// Example Usage
// ============================================================================

// Define your row type
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

// Example data
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
];

// ============================================================================
// Example 1: Full TableLayout with all features
// ============================================================================
const UserTable = HeadlessTableLayout<User>();

export function ExampleWithLayout() {
  const [data, setData] = useState<User[]>(mockUsers);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState(false);

  // Create typed table instance

  // Handle sorting
  const handleSort = (key: string) => {
    if (sortBy === key) {
      // Toggle sort direction
      setSort(sort === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSort("asc");
    }
  };

  // Define columns
  const columns = [
    {
      key: "id",
      name: "ID",
      sortable: true,
      render: (row: User) => (
        <Typography variant="body2" fontWeight={600}>
          #{row.id}
        </Typography>
      ),
    },
    {
      key: "name",
      name: "Name",
      sortable: true,
      render: (row: User) => (
        <Typography variant="body2" fontWeight={500}>
          {row.name}
        </Typography>
      ),
    },
    {
      key: "email",
      name: "Email",
      sortable: false,
      render: (row: User) => (
        <Link href={`mailto:${row.email}`} underline="hover" color="primary">
          {row.email}
        </Link>
      ),
    },
    {
      key: "role",
      name: "Role",
      sortable: true,
      render: (row: User) => (
        <Chip
          label={row.role}
          size="small"
          color={row.role === "Admin" ? "primary" : "default"}
          variant="outlined"
        />
      ),
    },
    {
      key: "status",
      name: "Status",
      sortable: true,
      render: (row: User) => (
        <Chip
          label={row.status}
          size="small"
          color={row.status === "active" ? "success" : "error"}
          variant="filled"
        />
      ),
    },
    {
      key: "actions",
      name: "Actions",
      sortable: false,
      render: () => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        User Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your users with sorting, filtering, and actions
      </Typography>

      <UserTable
        filters={
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Button
                variant={filtered ? "contained" : "outlined"}
                startIcon={filtered ? <FilterAlt /> : <FilterAltOff />}
                onClick={() => setFiltered(!filtered)}
                size="small"
              >
                {filtered ? "Filtered" : "No Filter"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => setLoading(!loading)}
                size="small"
              >
                {loading ? "Stop Loading" : "Start Loading"}
              </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setData([])}
                size="small"
              >
                Clear Data
              </Button>
              <Button
                variant="contained"
                onClick={() => setData(mockUsers)}
                size="small"
              >
                Reset Data
              </Button>
            </Stack>
          </Stack>
        }
        table={
          <UserTable.Table
            columns={columns}
            data={data}
            sortBy={sortBy}
            sort={sort}
            handleSort={handleSort}
            filtered={filtered}
            loading={loading}
          />
        }
        pagination={
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              Showing {data.length} of {data.length} results
            </Typography>
            <Pagination count={1} page={1} color="primary" />
          </Stack>
        }
      />
    </Box>
  );
}

// ============================================================================
// Example 2: Standalone Table (without layout wrapper)
// ============================================================================

export function ExampleStandaloneTable() {
  const UserTable = HeadlessTableLayout<User>();

  const columns = [
    {
      key: "name",
      name: "Name",
      sortable: false,
      render: (row: User) => (
        <Typography variant="body2">{row.name}</Typography>
      ),
    },
    {
      key: "email",
      name: "Email",
      sortable: false,
      render: (row: User) => (
        <Typography variant="body2" color="text.secondary">
          {row.email}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Simple Standalone Table
      </Typography>
      <UserTable.Table columns={columns} data={mockUsers} />
    </Box>
  );
}

// ============================================================================
// Example 3: With controlled sorting
// ============================================================================

export function ExampleWithSorting() {
  const [sortBy, setSortBy] = useState<string>("name");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const UserTable = HeadlessTableLayout<User>();

  // Sort data based on current sort state
  const sortedData = [...mockUsers].sort((a, b) => {
    if (sortBy === "name") {
      return sort === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortBy === "id") {
      return sort === "asc" ? a.id - b.id : b.id - a.id;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSort(sort === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSort("asc");
    }
  };

  const columns = [
    {
      key: "id",
      name: "ID",
      sortable: true,
      render: (row: User) => (
        <Typography variant="body2" fontWeight={600}>
          #{row.id}
        </Typography>
      ),
    },
    {
      key: "name",
      name: "Name",
      sortable: true,
      render: (row: User) => (
        <Typography variant="body2">{row.name}</Typography>
      ),
    },
    {
      key: "email",
      name: "Email",
      sortable: false,
      render: (row: User) => (
        <Typography variant="body2" color="text.secondary">
          {row.email}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Sortable Table Example
        </Typography>
        <Chip
          label={`Sorted by: ${sortBy} (${sort})`}
          color="primary"
          size="small"
          variant="outlined"
        />
      </Stack>
      <UserTable.Table
        columns={columns}
        data={sortedData}
        sortBy={sortBy}
        sort={sort}
        handleSort={handleSort}
      />
    </Box>
  );
}

// ============================================================================
// Example 4: Empty states
// ============================================================================

export function ExampleEmptyStates() {
  const UserTable = HeadlessTableLayout<User>();

  const columns = [
    {
      key: "name",
      name: "Name",
      sortable: false,
      render: (row: User) => (
        <Typography variant="body2">{row.name}</Typography>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Empty & Loading States
      </Typography>

      <Stack spacing={4} sx={{ mt: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            No data (not filtered)
          </Typography>
          <UserTable.Table columns={columns} data={[]} filtered={false} />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            No results (filtered)
          </Typography>
          <UserTable.Table columns={columns} data={[]} filtered={true} />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Loading state
          </Typography>
          <UserTable.Table columns={columns} data={mockUsers} loading={true} />
        </Box>
      </Stack>
    </Box>
  );
}
