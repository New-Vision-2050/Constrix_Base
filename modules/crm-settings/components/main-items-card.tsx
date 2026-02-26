"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, MenuItem, Switch, Paper, Select, FormControl, InputLabel } from "@mui/material";
import { Add} from "@mui/icons-material";
import HeadlessTableLayout from "@/components/headless/table";
import { TermSetting } from "@/services/api/projects/project-terms/types/response";
import { AddProjectTermDialog } from "./AddProjectTermDialog";
import { DeleteProjectTermDialog } from "./DeleteProjectTermDialog";
import { EditProjectTermDialog } from "./EditProjectTermDialog";
import { ViewProjectTermDialog } from "./ViewProjectTermDialog";
import { ItemActionsDialog } from "./ItemActionsDialog";
import { ProjectTermsApi } from "@/services/api/projects/project-terms";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface MainItemsCardProps {
  terms?: TermSetting[];
}

function MainItemsCard({ terms = [] }: MainItemsCardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<TermSetting[]>([]);
  const queryClient = useQueryClient();

  // Update rows when terms prop changes
  useEffect(() => {
    setRows(terms || []);
  }, [terms]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      ProjectTermsApi.updateTermSetting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["term-settings"] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => ProjectTermsApi.deleteTermSetting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["term-settings"] });
    },
  });

  // Toggle status function
  const toggleStatus = async (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    const currentStatus = row.is_active;
    const newStatus = currentStatus === 1 ? 0 : 1;

    console.log(`Toggling status for item ${id}: ${currentStatus} -> ${newStatus}`);

    // Update local state immediately for better UX
    setRows((prev) =>
        prev.map((r) =>
            r.id === id ? { ...r, is_active: newStatus, updated_at: new Date().toISOString() } : r
        )
    );

    // API call to update status
    try {
      await updateMutation.mutateAsync({
        id,
        data: { is_active: newStatus }
      });
      console.log(`Status updated for item ${id}: ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert on error
      setRows((prev) =>
          prev.map((r) =>
              r.id === id ? { ...r, is_active: currentStatus } : r
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
  const [selectedItem, setSelectedItem] = useState<TermSetting | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string>("");

  // Create table instance
  const ProjectItemsTable = HeadlessTableLayout<TermSetting>();

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
      key: "id",
      name: "الرقم",
      sortable: true,
      render: (row: TermSetting) => (
          <Typography variant="body2" fontWeight="medium">
            {row.id}
          </Typography>
      ),
    },
    {
      key: "name",
      name: "اسم البند",
      sortable: true,
      render: (row: TermSetting) => (
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
      render: (row: TermSetting) => (
          <Typography variant="body2" color="text.secondary">
            {row.description}
          </Typography>
      ),
    },
    {
      key: "children_count",
      name: "عدد البنود الفرعية",
      sortable: true,
      render: (row: TermSetting) => (
          <Typography variant="body2">
            {row.children_count}
          </Typography>
      ),
    },
    {
      key: "term_services_count",
      name: "عدد الخدمات",
      sortable: true,
      render: (row: TermSetting) => (
          <Typography variant="body2">
            {row.term_services_count}
          </Typography>
      ),
    },
    {
      key: "is_active",
      name: "تفعيل البند",
      sortable: false,
      render: (row: TermSetting) => (
          <Box display="flex" ml="5px" alignItems="center" justifyContent="flex-end" gap={1}>
            <Switch
                checked={row.is_active === 1}
                onChange={() => toggleStatus(row.id)}
                size="small"
                color="primary"
            />
            <Typography variant="body2">
              {row.is_active === 1 ? "نشط" : "غير نشط"}
            </Typography>
          </Box>
      ),
    },
    {
      key: "actions",
      name: "إجراءات",
      sortable: false,
      render: (row: TermSetting) => (
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

  // Filter data based on search only (no status filtering)
  const filteredData = rows.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Handler functions
  const handleAdd = (data: any) => {
    // The API call is handled in the dialog component
    // Just refresh the data
    queryClient.invalidateQueries({ queryKey: ["term-settings"] });
  };

  const handleDelete = async () => {
    if (selectedItem) {
      try {
        await deleteMutation.mutateAsync(selectedItem.id);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
    setItemToDelete("");
  };

  const handleUpdate = (data: any) => {
    if (selectedItem) {
      updateMutation.mutate({
        id: selectedItem.id,
        data
      });
    }
    setEditDialogOpen(false);
    setSelectedItem(null);
  };

  const handleAction = (action: string, item: TermSetting) => {
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
  const handleItemUpdate = (data: any) => {
    if (selectedItem) {
      updateMutation.mutate({
        id: selectedItem.id,
        data
      });
    }
  };

  const handleItemDelete = async () => {
    if (selectedItem) {
      try {
        await deleteMutation.mutateAsync(selectedItem.id);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleItemCreate = (data: any) => {
    // The API call is handled in the dialog component
    // Just refresh the data
    queryClient.invalidateQueries({ queryKey: ["term-settings"] });
  };

  // Handler for dialog table actions
  const handleDialogAction = (action: string, item: TermSetting) => {
    if (action === "open") {
      setSelectedItem(item);
      setItemActionsDialogOpen(true);
    } else {
      handleAction(action, item);
    }
  };

  // Calculate totals
  const totalItems = filteredData.length;
  const activeItems = filteredData.filter(item => item.is_active === 1).length;

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
          <Box>
            {/* Removed show inactive switch */}
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

export default MainItemsCard;
