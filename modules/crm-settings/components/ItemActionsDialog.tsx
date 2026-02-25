"use client";

import React, { useState, useEffect } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import HeadlessTableLayout from "@/components/headless/table";
import { PRJ_ProjectTerm } from "@/types/api/projects/project-term/index";

const projectTermSchema = z.object({
  reference_number: z.string().optional(),
  name: z.string().min(1, "اسم البند مطلوب"),
  description: z.string().optional(),
  sub_items_count: z.number().min(0, "عدد البنود الفرعية يجب أن يكون 0 أو أكثر"),
  services: z.array(z.string()).optional(),
  status: z.enum(["0", "1"]),
});

type ProjectTermFormData = z.infer<typeof projectTermSchema>;

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

  // Create form instance
  const createForm = useForm<ProjectTermFormData>({
    resolver: zodResolver(projectTermSchema),
    defaultValues: {
      reference_number: "",
      name: "",
      description: "",
      sub_items_count: 0,
      services: [],
      status: "1",
    },
  });

  // Update form instance
  const updateForm = useForm<ProjectTermFormData>({
    resolver: zodResolver(projectTermSchema),
    defaultValues: {
      reference_number: "",
      name: "",
      description: "",
      sub_items_count: 0,
      services: [],
      status: "1",
    },
  });

  // Update form when item changes
  useEffect(() => {
    if (item) {
      updateForm.reset({
        reference_number: item.reference_number,
        name: item.name,
        description: item.description,
        sub_items_count: item.sub_items_count,
        services: item.services,
        status: item.status,
      });
    }
  }, [item, updateForm]);

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
          <Box display="flex" ml="5px" alignItems="center" justifyContent="flex-end" gap={1}>
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUpdate = (data: ProjectTermFormData) => {
    onUpdate({ ...data, id: item?.id });
    onClose();
  };

  const handleCreate = (data: ProjectTermFormData) => {
    onCreate(data);
    createForm.reset();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ dir: "rtl" }}>
      <DialogTitle>
        <Typography variant="h6" component="div">
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
          <Tab icon={<Edit />} label="تعديل البند" />
          <Tab icon={<Delete />} label="حذف البند" />
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
            <Controller
              name="reference_number"
              control={createForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="الرقم المرجعي"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ style: { textAlign: "right" }, dir: "rtl" }}
                />
              )}
            />
            <Controller
              name="name"
              control={createForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="اسم البند"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ style: { textAlign: "right" }, dir: "rtl" }}
                />
              )}
            />
            <Controller
              name="description"
              control={createForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="وصف البند"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ style: { textAlign: "right" }, dir: "rtl" }}
                />
              )}
            />
            <Controller
              name="sub_items_count"
              control={createForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="عدد البنود الفرعية"
                  type="number"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ style: { textAlign: "right" }, dir: "rtl" }}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="status"
              control={createForm.control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value === "1"}
                      onChange={(e) => field.onChange(e.target.checked ? "1" : "0")}
                    />
                  }
                  label="تفعيل البند"
                  sx={{ textAlign: "right", alignSelf: "flex-start" }}
                />
              )}
            />
          </Box>
        </TabPanel>

        {/* Update Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            تعديل البند الحالي
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="reference_number"
              control={updateForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="الرقم المرجعي"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ style: { textAlign: "right" }, dir: "rtl" }}
                />
              )}
            />
            <Controller
              name="name"
              control={updateForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="اسم البند"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ style: { textAlign: "right" }, dir: "rtl" }}
                />
              )}
            />
            <Controller
              name="description"
              control={updateForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="وصف البند"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ style: { textAlign: "right" }, dir: "rtl" }}
                />
              )}
            />
            <Controller
              name="sub_items_count"
              control={updateForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="عدد البنود الفرعية"
                  type="number"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ style: { textAlign: "right" }, dir: "rtl" }}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="status"
              control={updateForm.control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value === "1"}
                      onChange={(e) => field.onChange(e.target.checked ? "1" : "0")}
                    />
                  }
                  label="تفعيل البند"
                  sx={{ textAlign: "right", alignSelf: "flex-start" }}
                />
              )}
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
          <Button onClick={createForm.handleSubmit(handleCreate)} variant="contained" color="primary">
            إضافة
          </Button>
        )}
        {activeTab === 2 && (
          <Button onClick={updateForm.handleSubmit(handleUpdate)} variant="contained" color="primary">
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
