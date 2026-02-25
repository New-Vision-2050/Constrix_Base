"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

interface ViewProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  item: PRJ_ProjectTerm | null;
  onSave?: (data: Partial<PRJ_ProjectTerm>) => void;
  readOnly?: boolean;
}

export function ViewProjectTermDialog({ open, onClose, item, onSave, readOnly = true }: ViewProjectTermDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectTermFormData>({
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

  useEffect(() => {
    if (item) {
      reset({
        reference_number: item.reference_number,
        name: item.name,
        description: item.description,
        sub_items_count: item.sub_items_count,
        services: item.services,
        status: item.status,
      });
    }
  }, [item, reset]);

  const onSubmit = (data: ProjectTermFormData) => {
    if (onSave) {
      onSave({ ...data, id: item?.id });
    }
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{readOnly ? "تفاصيل البند الرئيسي" : "تعديل البند الرئيسي"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {readOnly ? (
            <>
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
                <Typography variant="body1" fontWeight="medium">
                  {item.name}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  وصف البند
                </Typography>
                <Typography variant="body1">
                  {item.description}
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
                  تفعيل البند
                </Typography>
                <Chip
                  label={item.status === "1" ? "نشط" : "غير نشط"}
                  color={item.status === "1" ? "success" : "default"}
                  size="small"
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  تاريخ الإنشاء
                </Typography>
                <Typography variant="body2">
                  {new Date(item.created_at).toLocaleDateString("ar-EG")}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  آخر تحديث
                </Typography>
                <Typography variant="body2">
                  {new Date(item.updated_at).toLocaleDateString("ar-EG")}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Controller
                name="reference_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="الرقم المرجعي"
                    fullWidth
                    error={!!errors.reference_number}
                    helperText={errors.reference_number?.message}
                  />
                )}
              />
              
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="اسم البند"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="وصف البند"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
              
              <Controller
                name="sub_items_count"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="عدد البنود الفرعية"
                    type="number"
                    fullWidth
                    error={!!errors.sub_items_count}
                    helperText={errors.sub_items_count?.message}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                )}
              />
              
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value === "1"}
                        onChange={(e) => field.onChange(e.target.checked ? "1" : "0")}
                      />
                    }
                    label="تفعيل البند"
                  />
                )}
              />
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  تاريخ الإنشاء
                </Typography>
                <Typography variant="body2">
                  {new Date(item.created_at).toLocaleDateString("ar-EG")}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  آخر تحديث
                </Typography>
                <Typography variant="body2">
                  {new Date(item.updated_at).toLocaleDateString("ar-EG")}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {readOnly ? "إغلاق" : "إلغاء"}
        </Button>
        {!readOnly && onSave && (
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
            حفظ
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
