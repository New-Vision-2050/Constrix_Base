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
  Chip,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import { TermSetting } from "@/services/api/projects/project-terms/types/response";
import { ProjectTermsApi } from "@/services/api/projects/project-terms";
const projectTermSchema = z.object({
  name: z.string().min(1, "اسم البند مطلوب"),
  description: z.string().optional(),
  parent_id: z.number().nullable().optional(),
  project_type_id: z.number().optional(),
  term_services_ids: z.array(z.number()).optional(),
  is_active: z.number().min(0).max(1).default(1),
});

type ProjectTermFormData = z.infer<typeof projectTermSchema>;

interface ItemActionsDialogProps {
  open: boolean;
  onClose: () => void;
  item: TermSetting | null;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onCreate: (data: any) => void;
  tableData: TermSetting[];
  onAction: (action: string, item: TermSetting) => void;
}
// Mock data for the table (same as main component)
const mockTableData: TermSetting[] = [
  {
    id: 1,
    name: "تصاميم شبكه الجهد",
    description: "وصف تصاميم شبكه الجهد المتوسط",
    parent_id: null,
    project_type_id: null,
    is_active: 1,
    children_count: 5,
    term_services_count: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "تصاميم محطة المحولات",
    description: "وصف تصاميم محطة المحولات الرئيسية",
    parent_id: null,
    project_type_id: null,
    is_active: 1,
    children_count: 3,
    term_services_count: 1,
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
  const queryClient = useQueryClient();
  
  // Mutation for creating child terms
  const createChildMutation = useMutation({
    mutationFn: (data: any) => ProjectTermsApi.createTermSetting(data),
    onSuccess: () => {
      createForm.reset();
      // Switch to table tab and refresh data
      setActiveTab(0);
      queryClient.invalidateQueries({ queryKey: ["term-children", item?.id] });
    },
  });
  
  // Fetch children data when dialog opens and item is available
  const { data: childrenData, isLoading: isLoadingChildren, error: childrenError } = useQuery({
    queryKey: ["term-children", item?.id],
    queryFn: async () => {
      if (!item?.id) return { payload: [] };
      try {
        const response = await ProjectTermsApi.getTermChildren(item.id);
        console.log("Children API response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching children:", error);
        return { payload: [] };
      }
    },
    enabled: !!item?.id && open,
    retry: 1,
  });
  
  const children = Array.isArray(childrenData?.payload) ? childrenData.payload : 
                Array.isArray(childrenData?.children) ? childrenData.children :
                Array.isArray(childrenData) ? childrenData : [];
  
  console.log("Children data extracted:", children);
  console.log("Children data length:", children.length);
  
  // Toggle status function for table switches
  const toggleStatus = (id: number) => {
    // This would need to be implemented to work with the query cache
    // For now, this is just a local UI update
    console.log("Toggle status for child:", id);
  };
  
  // Create table instance
  const DialogTable = HeadlessTableLayout<TermSetting>();

  // Use table params for pagination and sorting
  const tableParams = DialogTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "name",
    initialSortDirection: "asc",
  });

  // Fetch services for the form
  const { data: servicesData } = useQuery({
    queryKey: ["term-services"],
    queryFn: async () => {
      const response = await ProjectTermsApi.getTermServices();
      return response.data;
    },
  });

  const services = servicesData?.payload || [];

  // Create form instance
  const createForm = useForm<ProjectTermFormData>({
    resolver: zodResolver(projectTermSchema),
    defaultValues: {
      name: "",
      description: "",
      parent_id: item?.id || null,
      project_type_id: undefined,
      term_services_ids: [],
      is_active: 1,
    },
  });

  // Update form when item changes (to set parent_id)
  useEffect(() => {
    if (item?.id) {
      createForm.setValue("parent_id", item.id);
    }
  }, [item, createForm]);

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
        name: item.name,
        description: item.description,
        status: item.is_active === 1 ? "1" : "0",
      });
    }
  }, [item, updateForm]);

  // Define table columns (same as main component)
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
          <Typography variant="body2" fontWeight="medium">
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
      key: "status",
      name: "تفعيل البند",
      sortable: false,
      render: (row: TermSetting) => (
          <Box display="flex" ml="5px" alignItems="center" justifyContent="flex-end" gap={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={row.is_active === 1}
                  onChange={() => toggleStatus(row.id)}
                  size="small"
                  color="primary"
                />
              }
              label={row.is_active === 1 ? "نشط" : "غير نشط"}
              labelPlacement="start"
            />
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
  const totalPages = Math.ceil(children.length / tableParams.limit);
  const startIndex = (tableParams.page - 1) * tableParams.limit;
  const endIndex = startIndex + tableParams.limit;
  const paginatedData = children.slice(startIndex, endIndex);

  // Table state
  const tableState = DialogTable.useTableState({
    data: paginatedData,
    columns,
    totalPages,
    totalItems: children.length,
    params: tableParams,
    getRowId: (item) => item.id.toString(),
    loading: isLoadingChildren,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUpdate = (data: ProjectTermFormData) => {
    onUpdate({ ...data, id: item?.id });
    onClose();
  };

  const handleCreate = (data: ProjectTermFormData) => {
    createChildMutation.mutate({
      ...data,
      parent_id: item?.id,
    });
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
          معرف البند: {item?.id}
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
            البنود الفرعية لـ: {item?.name}
          </Typography>
          {isLoadingChildren ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <Typography>جاري تحميل البنود الفرعية...</Typography>
            </Box>
          ) : childrenError ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <Typography color="error">
                حدث خطأ في تحميل البنود الفرعية. يرجى المحاولة مرة أخرى.
              </Typography>
            </Box>
          ) : children.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <Typography color="text.secondary">
                لا توجد بنود فرعية لهذا البند.
              </Typography>
            </Box>
          ) : (
            <Paper>
              <DialogTable.TopActions state={tableState} />
              <DialogTable.Table state={tableState} />
              <DialogTable.Pagination state={tableState} />
            </Paper>
          )}
        </TabPanel>

        {/* Create Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            إضافة بند فرعي لـ: {item?.name}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              name="term_services_ids"
              control={createForm.control}
              render={({ field }) => (
                <FormControl component="fieldset" fullWidth>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                    الخدمات
                  </Typography>
                  <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                    {services.map((service) => (
                      <FormControlLabel
                        key={service.id}
                        control={
                          <Checkbox
                            checked={field.value.includes(service.id)}
                            onChange={(e) => {
                              const selectedServices = field.value;
                              if (e.target.checked) {
                                field.onChange([...selectedServices, service.id]);
                              } else {
                                field.onChange(selectedServices.filter((id: number) => id !== service.id));
                              }
                            }}
                            sx={{
                              color: '#ffffff',
                              '&.Mui-checked': {
                                color: '#F42588',
                              },
                              '& .MuiSvgIcon-root': {
                                borderColor: '#ffffff',
                              },
                            }}
                          />
                        }
                        label={service.name}
                        sx={{ 
                          color: '#ffffff',
                          '& .MuiFormControlLabel-label': {
                            color: '#ffffff',
                          }
                        }}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              )}
            />
            <Controller
              name="is_active"
              control={createForm.control}
              render={({ field }) => (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="flex-start" 
                  gap={2}
                  sx={{ width: '100%', mt: 1 }}
                >
                  <Typography variant="body2" sx={{ minWidth: '80px' }}>
                    الحالة:
                  </Typography>
                  <Switch
                    checked={field.value === 1}
                    onChange={(e) => {
                      console.log('Switch changed:', e.target.checked, 'Current value:', field.value);
                      field.onChange(e.target.checked ? 1 : 0);
                    }}
                    size="small"
                    color="primary"
                  />
                  <Typography variant="body2">
                    {field.value === 1 ? "نشط" : "غير نشط"}
                  </Typography>
                </Box>
              )}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={createForm.handleSubmit(handleCreate)}
                disabled={createChildMutation.isPending}
                fullWidth
              >
                {createChildMutation.isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  createForm.reset();
                  setActiveTab(0);
                }}
                fullWidth
              >
                إلغاء
              </Button>
            </Box>
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
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="flex-start" 
                  gap={2}
                  sx={{ width: '100%', mt: 1 }}
                >
                  <Typography variant="body2" sx={{ minWidth: '80px' }}>
                    الحالة:
                  </Typography>
                  <Switch
                    checked={field.value === "1"}
                    onChange={(e) => {
                      console.log('Switch changed:', e.target.checked, 'Current value:', field.value);
                      field.onChange(e.target.checked ? "1" : "0");
                    }}
                    size="small"
                    color="primary"
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: field.value === "1" ? 'bold' : 'normal',
                      color: field.value === "1" ? 'primary.main' : 'text.secondary'
                    }}
                  >
                    {field.value === "1" ? "نشط" : "غير نشط"}
                  </Typography>
                </Box>
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose}>إلغاء</Button>
          {activeTab === 1 && (
            <Button onClick={createForm.handleSubmit(handleCreate)} variant="contained" color="primary">
              إضافة
            </Button>
          )}
        </Box>
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
