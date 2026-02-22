"use client";

import React, { useState } from "react";
import { Box, Typography, Button, TextField, MenuItem, Switch, Paper, Select, FormControl, InputLabel } from "@mui/material";
import { Add} from "@mui/icons-material";
import HeadlessTableLayout from "@/components/headless/table";
import { PRJ_ProjectTerm } from "@/types/api/projects/project-term";
import { AddProjectTermDialog, DeleteProjectTermDialog, EditProjectTermDialog, ViewProjectTermDialog } from "./components/dialogs";

// Mock data for demonstration
const mockProjectItems: PRJ_ProjectTerm[] = [
  {
    id: 1,
    reference_number: "1520202",
    name: "تصاميم شبكه الجهد",
    description: "وصف تصاميم شبكه الجهد المتوسط",
    sub_items_count: 5,
    services: [],
    status: "1",
    parent_id: null,
    project_type_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    reference_number: "200202020",
    name: "تصاميم شبكه الجهد",
    description: "وصف تصاميم شبكه الجهد المتوسط",
    sub_items_count: 8,
    services: [],
    status: "1",
    parent_id: null,
    project_type_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

interface ProjectTermsViewProps {
  projectTypeId: number | null;
}

function ProjectTermsView({ projectTypeId }: ProjectTermsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PRJ_ProjectTerm | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string>("");

  // Create table instance
  const ProjectItemsTable = HeadlessTableLayout<PRJ_ProjectTerm>();

  // Use table params for pagination and sorting
  const tableParams = ProjectItemsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "name",
    initialSortDirection: "asc",
  });

  // Define table columns
  const columns = [
    {
      key: "reference_number",
      name: "الرقم المرجعي",
      sortable: true,
      render: (row: PRJ_ProjectTerm) => (
        <Typography variant="body2" fontWeight="medium">
          {row.reference_number}
        </Typography>
      ),
    },
    {
      key: "name",
      name: "اسم البند",
      sortable: true,
      render: (row: PRJ_ProjectTerm) => (
        <Typography variant="body2" fontWeight="medium">
          {row.name}
        </Typography>
      ),
    },
    {
      key: "description",
      name: "وصف البند",
      sortable: true,
      render: (row: PRJ_ProjectTerm) => (
        <Typography variant="body2" color="text.secondary">
          {row.description}
        </Typography>
      ),
    },
    {
      key: "sub_items_count",
      name: "عدد البنود الفرعية",
      sortable: true,
      render: (row: PRJ_ProjectTerm) => (
        <Typography variant="body2">
          {row.sub_items_count}
        </Typography>
      ),
    },
    {
      key: "services",
      name: "خدمات البند",
      sortable: false,
      render: (row: PRJ_ProjectTerm) => (
        <TextField
          select
          size="small"
          value=""
          sx={{ minWidth: 150 }}
          SelectProps={{
            displayEmpty: true,
          }}
        >
          <MenuItem value="" disabled>
            اختر الخدمة
          </MenuItem>
          {row.services.map((service, index) => (
            <MenuItem key={index} value={service}>
              {service}
            </MenuItem>
          ))}
        </TextField>
      ),
    },
    {
      key: "status",
      name: "تفعيل البند",
      sortable: false,
      render: (row: PRJ_ProjectTerm) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Switch
            checked={row.status === "1"}
            size="small"
            color="primary"
          />
          <Typography variant="body2">
            {row.status === "1" ? "نشط" : "غير نشط"}
          </Typography>
        </Box>
      ),
    },
    {
      key: "actions",
      name: "إجراءات",
      sortable: false,
      render: (row: PRJ_ProjectTerm) => (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>الإجراءات</InputLabel>
          <Select
            value=""
            label="الإجراءات"
            onChange={(e) => handleAction(e.target.value as string, row)}
          >
            <MenuItem value="edit">تعديل</MenuItem>
            <MenuItem value="delete">حذف</MenuItem>
            <MenuItem value="view">عرض</MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];

  // Filter data based on search and filters
  const filteredData = mockProjectItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.reference_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive || item.status === "1";

    return matchesSearch && matchesStatus;
  });

  // Handler functions
  const handleAdd = (data: Partial<PRJ_ProjectTerm>) => {
    const newItem: PRJ_ProjectTerm = {
      ...data,
      id: Math.max(...mockProjectItems.map(item => item.id)) + 1,
      parent_id: null,
      project_type_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reference_number: data.reference_number || "",
      name: data.name || "",
      description: data.description || "",
      sub_items_count: data.sub_items_count || 0,
      services: data.services || [],
      status: data.status || "1",
    };
    mockProjectItems.push(newItem);
  };

  const handleDelete = () => {
    if (selectedItem) {
      const index = mockProjectItems.findIndex(item => item.id === selectedItem.id);
      if (index > -1) {
        mockProjectItems.splice(index, 1);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
    setItemToDelete("");
  };

  const handleUpdate = (data: Partial<PRJ_ProjectTerm>) => {
    if (selectedItem) {
      const index = mockProjectItems.findIndex(item => item.id === selectedItem.id);
      if (index > -1) {
        mockProjectItems[index] = {
          ...mockProjectItems[index],
          ...data,
          updated_at: new Date().toISOString(),
        } as PRJ_ProjectTerm;
      }
    }
    setEditDialogOpen(false);
    setSelectedItem(null);
  };

  const handleAction = (action: string, item: PRJ_ProjectTerm) => {
    switch (action) {
      case "edit":
        setSelectedItem(item);
        setEditDialogOpen(true);
        break;
      case "delete":
        setSelectedItem(item);
        setItemToDelete(item.name);
        setDeleteDialogOpen(true);
        break;
      case "view":
        setSelectedItem(item);
        setViewDialogOpen(true);
        break;
    }
  };

  // Calculate totals
  const totalItems = filteredData.length;
  const activeItems = filteredData.filter(item => item.status === "1").length;

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / tableParams.limit);
  const startIndex = (tableParams.page - 1) * tableParams.limit;
  const endIndex = startIndex + tableParams.limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Table state
  const tableState = ProjectItemsTable.useTableState({
    data: paginatedData,
    columns,
    totalPages,
    totalItems: filteredData.length,
    params: tableParams,
    getRowId: (item) => item.id.toString(),
    loading: false,
  });

  return (
    <Box className="p-6">
      {/* Header Section */}
      <Box className="mb-6">
        <Typography variant="h5" fontWeight="bold" className="mb-2">
          بنود المشروع
        </Typography>
      </Box>
      
      {/* Action Button Above Table */}
      <Box className="flex justify-end mb-4">
        <Button
          variant="contained"
          startIcon={<Add />}
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setAddDialogOpen(true)}
        >
          إضافة بند رئيسي
        </Button>
      </Box>

      <Paper>
        <ProjectItemsTable.TopActions state={tableState} />
        <ProjectItemsTable.Table state={tableState} />
        <ProjectItemsTable.Pagination state={tableState} />
      </Paper>

      {/* Footer Notes */}
     
      {/* Dialogs */}
      <AddProjectTermDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAdd}
      />
      <DeleteProjectTermDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        itemName={itemToDelete}
      />
      <EditProjectTermDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onUpdate={handleUpdate}
        item={selectedItem}
      />
      <ViewProjectTermDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        item={selectedItem}
      />
    </Box>
  );
}

export default ProjectTermsView;
