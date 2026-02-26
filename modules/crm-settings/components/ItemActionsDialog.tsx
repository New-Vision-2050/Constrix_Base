"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import HeadlessTableLayout from "@/components/headless/table";
import { PRJ_ProjectTerm } from "@/types/api/projects/project-term/index";

interface ItemActionsDialogProps {
  open: boolean;
  onClose: () => void;
  item: PRJ_ProjectTerm | null;
  onUpdate: (data: Partial<PRJ_ProjectTerm>) => void;
  onDelete: () => void;
  onCreate: (data: Partial<PRJ_ProjectTerm>) => void;
  tableData: PRJ_ProjectTerm[];
  onAction: (action: string, item: PRJ_ProjectTerm) => void;
}

// Mock data for the table (same as main component)
const mockTableData: PRJ_ProjectTerm[] = [
  {
    id: 1,
    reference_number: "1520202",
    name: "تصاميم شبكه الجهد",
    description: "وصف تصاميم شبكه الجهد المتوسط",
    sub_items_count: 5,
    services: ["خدمة 1", "خدمة 2"],
    status: "1",
    parent_id: null,
    project_type_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    reference_number: "1520203",
    name: "تصاميم محطة المحولات",
    description: "وصف تصاميم محطة المحولات الرئيسية",
    sub_items_count: 3,
    services: ["خدمة 3"],
    status: "1",
    parent_id: null,
    project_type_id: null,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
];

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function ItemActionsDialog({ open, onClose, item, onUpdate, onDelete, onCreate, tableData, onAction }: ItemActionsDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  
  // Create table instance
  const DialogTable = HeadlessTableLayout<PRJ_ProjectTerm>();

  // Use table params for pagination and sorting
  const tableParams = DialogTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "name",
    initialSortDirection: "asc",
  });

  // Define table columns (same as main component)
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
                onChange={(e) => onAction(e.target.value as string, row)}
            >
              <MenuItem value="edit">تعديل</MenuItem>
              <MenuItem value="delete">حذف</MenuItem>
              <MenuItem value="view">عرض</MenuItem>
            </Select>
          </FormControl>
      ),
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(tableData.length / tableParams.limit);
  const startIndex = (tableParams.page - 1) * tableParams.limit;
  const endIndex = startIndex + tableParams.limit;
  const paginatedData = tableData.slice(startIndex, endIndex);

  // Table state
  const tableState = DialogTable.useTableState({
    data: paginatedData,
    columns,
    totalPages,
    totalItems: tableData.length,
    params: tableParams,
    getRowId: (item) => item.id.toString(),
    loading: false,
  });
  
  // Update form state
  const [updateFormData, setUpdateFormData] = useState({
    reference_number: "",
    name: "",
    description: "",
    sub_items_count: 0,
    services: [] as string[],
    status: "1" as "0" | "1",
  });

  // Create form state
  const [createFormData, setCreateFormData] = useState({
    reference_number: "",
    name: "",
    description: "",
    sub_items_count: 0,
    services: [] as string[],
    status: "1" as "0" | "1",
  });

  React.useEffect(() => {
    if (item) {
      setUpdateFormData({
        reference_number: item.reference_number,
        name: item.name,
        description: item.description,
        sub_items_count: item.sub_items_count,
        services: item.services,
        status: item.status,
      });
    }
  }, [item]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUpdate = () => {
    onUpdate(updateFormData);
    onClose();
  };

  const handleCreate = () => {
    onCreate(createFormData);
    setCreateFormData({
      reference_number: "",
      name: "",
      description: "",
      sub_items_count: 0,
      services: [],
      status: "1",
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          إجراءات البند: {item?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          الرقم المرجعي: {item?.reference_number}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Visibility />} label="عرض الجدول" />
          <Tab icon={<Add />} label="إضافة جديد" />
        </Tabs>

        {/* Table View Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            عرض جميع البنود
          </Typography>
          <Paper>
            <DialogTable.TopActions state={tableState} />
            <DialogTable.Table state={tableState} />
            <DialogTable.Pagination state={tableState} />
          </Paper>
        </TabPanel>

        {/* Create Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            إضافة بند جديد
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="الرقم المرجعي"
              value={createFormData.reference_number}
              onChange={(e) => setCreateFormData({ ...createFormData, reference_number: e.target.value })}
              fullWidth
            />
            <TextField
              label="اسم البند"
              value={createFormData.name}
              onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="وصف البند"
              value={createFormData.description}
              onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="عدد البنود الفرعية"
              type="number"
              value={createFormData.sub_items_count}
              onChange={(e) => setCreateFormData({ ...createFormData, sub_items_count: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={createFormData.status === "1"}
                  onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.checked ? "1" : "0" })}
                />
              }
              label="تفعيل البند"
            />
          </Box>
        </TabPanel>

        {/* Update Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            تعديل البند الحالي
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="الرقم المرجعي"
              value={updateFormData.reference_number}
              onChange={(e) => setUpdateFormData({ ...updateFormData, reference_number: e.target.value })}
              fullWidth
            />
            <TextField
              label="اسم البند"
              value={updateFormData.name}
              onChange={(e) => setUpdateFormData({ ...updateFormData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="وصف البند"
              value={updateFormData.description}
              onChange={(e) => setUpdateFormData({ ...updateFormData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="عدد البنود الفرعية"
              type="number"
              value={updateFormData.sub_items_count}
              onChange={(e) => setUpdateFormData({ ...updateFormData, sub_items_count: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={updateFormData.status === "1"}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, status: e.target.checked ? "1" : "0" })}
                />
              }
              label="تفعيل البند"
            />
          </Box>
        </TabPanel>

        {/* Delete Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom color="error">
            حذف البند
          </Typography>
          <Box sx={{ py: 2 }}>
            <Typography>
              هل أنت متأكد من حذف البند "{item?.name}"؟
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              هذا الإجراء لا يمكن التراجع عنه.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>الرقم المرجعي:</strong> {item?.reference_number}
            </Typography>
            <Typography variant="body2">
              <strong>الوصف:</strong> {item?.description}
            </Typography>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        {activeTab === 1 && (
          <Button onClick={handleCreate} variant="contained" color="primary">
            إضافة
          </Button>
        )}
        {activeTab === 2 && (
          <Button onClick={handleUpdate} variant="contained" color="primary">
            تحديث
          </Button>
        )}
        {activeTab === 3 && (
          <Button onClick={handleDelete} variant="contained" color="error">
            حذف
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
