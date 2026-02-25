"use client";

import React, { useState } from "react";
import { Box, Typography, Button, TextField, MenuItem, Switch, Paper, Select, FormControl, InputLabel } from "@mui/material";
import { Add} from "@mui/icons-material";
import HeadlessTableLayout from "@/components/headless/table";
import { PRJ_ProjectTerm } from "@/types/api/projects/project-term";
import { AddProjectTermDialog } from "./AddProjectTermDialog";
import { DeleteProjectTermDialog } from "./DeleteProjectTermDialog";
import { EditProjectTermDialog } from "./EditProjectTermDialog";
import { ViewProjectTermDialog } from "./ViewProjectTermDialog";
import { ItemActionsDialog } from "./ItemActionsDialog";

// Mock data for demonstration
const initialMockProjectItems: PRJ_ProjectTerm[] = [
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
  const [rows, setRows] = useState<PRJ_ProjectTerm[]>(initialMockProjectItems);

  // Toggle status function
  const toggleStatus = async (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    const newStatus = row.status === "1" ? "0" : "1";

    // Update local state immediately for better UX
    setRows((prev) =>
        prev.map((r) =>
            r.id === id ? { ...r, status: newStatus, updated_at: new Date().toISOString() } : r
        )
    );

    // TODO: Add API call to update status
    try {
      // await updateProjectTermStatus({
      //   id: id.toString(),
      //   status: newStatus,
      // });
      console.log(`Status updated for item ${id}: ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert on error
      setRows((prev) =>
          prev.map((r) =>
              r.id === id ? { ...r, status: row.status } : r
          )
      );
    }
  };

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [itemActionsDialogOpen, setItemActionsDialogOpen] = useState(false);
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
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{ 
              cursor: "pointer", 
              color: "#1976d2",
              "&:hover": { 
                textDecoration: "underline",
                color: "#1565c0"
              }
            }}
            onClick={() => {
              setSelectedItem(row);
              setItemActionsDialogOpen(true);
            }}
          >
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
          <Box display="flex" ml="5px" alignItems="center" justifyContent="flex-end" gap={1}>
            <Switch
                checked={row.status === "1"}
                onChange={() => toggleStatus(row.id)}
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
  const filteredData = rows.filter((item) => {
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
      id: Math.max(...rows.map(item => item.id)) + 1,
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
    setRows(prev => [...prev, newItem]);
  };

  const handleDelete = () => {
    if (selectedItem) {
      setRows(prev => prev.filter(item => item.id !== selectedItem.id));
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
    setItemToDelete("");
  };

  const handleUpdate = (data: Partial<PRJ_ProjectTerm>) => {
    if (selectedItem) {
      setRows(prev => 
        prev.map(item => 
          item.id === selectedItem.id 
            ? { ...item, ...data, updated_at: new Date().toISOString() }
            : item
        )
      );
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

  // Handlers for ItemActionsDialog
  const handleItemUpdate = (data: Partial<PRJ_ProjectTerm>) => {
    if (selectedItem) {
      setRows(prev => 
        prev.map(item => 
          item.id === selectedItem.id 
            ? { ...item, ...data, updated_at: new Date().toISOString() }
            : item
        )
      );
    }
    console.log("Updating item:", selectedItem?.id, data);
    // TODO: Add API call to update item
  };

  const handleItemDelete = () => {
    if (selectedItem) {
      setRows(prev => prev.filter(item => item.id !== selectedItem.id));
    }
    console.log("Deleting item:", selectedItem?.id);
    // TODO: Add API call to delete item
  };

  const handleItemCreate = (data: Partial<PRJ_ProjectTerm>) => {
    const newItem: PRJ_ProjectTerm = {
      ...data,
      id: Math.max(...rows.map(item => item.id)) + 1,
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
    setRows(prev => [...prev, newItem]);
    console.log("Creating new item:", data);
    // TODO: Add API call to create item
  };

  // Handler for dialog table actions
  const handleDialogAction = (action: string, item: PRJ_ProjectTerm) => {
    if (action === "open") {
      setSelectedItem(item);
      setItemActionsDialogOpen(true);
    } else {
      handleAction(action, item);
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
           بنود الريئيسيه
          </Typography>
        </Box>

        {/* Action Button Above Table */}
        <Box className="flex justify-between items-center mb-4">
          <Box className="flex items-center gap-2">
            <Typography variant="body2">
              إظهار البنود غير النشطة
            </Typography>
            <Switch
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              size="small"
              color="primary"
            />
          </Box>
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
        <ItemActionsDialog
            open={itemActionsDialogOpen}
            onClose={() => setItemActionsDialogOpen(false)}
            item={selectedItem}
            onUpdate={handleItemUpdate}
            onDelete={handleItemDelete}
            onCreate={handleItemCreate}
            tableData={filteredData}
            onAction={handleDialogAction}
        />
      </Box>
  );
}

export default ProjectTermsView;
