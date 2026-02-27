import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { PRJ_ProjectTerm } from "@/types/api/projects/project-term";

interface AddProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Partial<PRJ_ProjectTerm>) => void;
}

export function AddProjectTermDialog({ open, onClose, onAdd }: AddProjectTermDialogProps) {
  const [formData, setFormData] = useState<Partial<PRJ_ProjectTerm>>({
    reference_number: "",
    name: "",
    description: "",
    sub_items_count: 0,
    services: [],
    status: "1",
    parent_id: null,
    project_type_id: null,
  });

  const handleSubmit = () => {
    onAdd(formData);
    onClose();
    setFormData({
      reference_number: "",
      name: "",
      description: "",
      sub_items_count: 0,
      services: [],
      status: "1",
      parent_id: null,
      project_type_id: null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>إضافة بند رئيسي جديد</DialogTitle>
      <DialogContent>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <TextField
            label="الرقم المرجعي"
            value={formData.reference_number}
            onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
            fullWidth
          />
          <TextField
            label="اسم البند"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="وصف البند"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            className="md:col-span-2"
          />
          <TextField
            label="عدد البنود الفرعية"
            type="number"
            value={formData.sub_items_count}
            onChange={(e) => setFormData({ ...formData, sub_items_count: parseInt(e.target.value) || 0 })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={formData.status}
              label="الحالة"
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "0" | "1" })}
            >
              <MenuItem value="1">نشط</MenuItem>
              <MenuItem value="0">غير نشط</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSubmit} variant="contained">
          إضافة
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface DeleteProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function DeleteProjectTermDialog({ open, onClose, onConfirm, itemName }: DeleteProjectTermDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>تأكيد الحذف</DialogTitle>
      <DialogContent>
        <Typography>
          هل أنت متأكد من أنك تريد حذف البند "{itemName}"؟ لا يمكن التراجع عن هذا الإجراء.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          حذف
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface EditProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Partial<PRJ_ProjectTerm>) => void;
  item: PRJ_ProjectTerm | null;
}

export function EditProjectTermDialog({ open, onClose, onUpdate, item }: EditProjectTermDialogProps) {
  const [formData, setFormData] = useState<Partial<PRJ_ProjectTerm>>(item || {});

  React.useEffect(() => {
    setFormData(item || {});
  }, [item]);

  const handleSubmit = () => {
    if (item) {
      onUpdate({ ...formData, id: item.id });
    }
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>تعديل البند</DialogTitle>
      <DialogContent>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <TextField
            label="الرقم المرجعي"
            value={formData.reference_number}
            onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
            fullWidth
          />
          <TextField
            label="اسم البند"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="وصف البند"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            className="md:col-span-2"
          />
          <TextField
            label="عدد البنود الفرعية"
            type="number"
            value={formData.sub_items_count}
            onChange={(e) => setFormData({ ...formData, sub_items_count: parseInt(e.target.value) || 0 })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={formData.status}
              label="الحالة"
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "0" | "1" })}
            >
              <MenuItem value="1">نشط</MenuItem>
              <MenuItem value="0">غير نشط</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSubmit} variant="contained">
          تحديث
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface ViewProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  item: PRJ_ProjectTerm | null;
}

export function ViewProjectTermDialog({ open, onClose, item }: ViewProjectTermDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>تفاصيل البند</DialogTitle>
      <DialogContent>
        <Box className="space-y-4">
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                الرقم المرجعي
              </Typography>
              <Typography variant="body1">
                {item.reference_number}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                اسم البند
              </Typography>
              <Typography variant="body1">
                {item.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                عدد البنود الفرعية
              </Typography>
              <Typography variant="body1">
                {item.sub_items_count}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                الحالة
              </Typography>
              <Typography variant="body1">
                {item.status === "1" ? "نشط" : "غير نشط"}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              وصف البند
            </Typography>
            <Typography variant="body1" className="mt-1">
              {item.description}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              الخدمات
            </Typography>
            <Box className="mt-1">
              {item.services.length > 0 ? (
                item.services.map((service, index) => (
                  <Typography key={index} variant="body2">
                    • {service}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  لا توجد خدمات
                </Typography>
              )}
            </Box>
          </Box>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                تاريخ الإنشاء
              </Typography>
              <Typography variant="body2">
                {new Date(item.created_at).toLocaleDateString('ar-SA')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                تاريخ التحديث
              </Typography>
              <Typography variant="body2">
                {new Date(item.updated_at).toLocaleDateString('ar-SA')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إغلاق</Button>
      </DialogActions>
    </Dialog>
  );
}
