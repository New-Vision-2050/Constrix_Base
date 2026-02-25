"use client";


import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PRJ_ProjectTerm } from "@/types/api/projects/project-term";

const projectTermSchema = z.object({
  reference_number: z.string().optional(),
  name: z.string().min(1, "اسم البند مطلوب"),
  description: z.string().optional(),
  sub_items_count: z.number().min(0, "عدد البنود الفرعية يجب أن يكون 0 أو أكثر"),
  services: z.array(z.string()).optional(),
  status: z.enum(["0", "1"]).default("1"),
});

type ProjectTermFormData = z.infer<typeof projectTermSchema>;

interface AddProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Partial<PRJ_ProjectTerm>) => void;
}

export function AddProjectTermDialog({ open, onClose, onAdd }: AddProjectTermDialogProps) {
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

  const onSubmit = (data: ProjectTermFormData) => {
    onAdd(data);
    reset();
    onClose();
  };

  return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>إضافة بند رئيسي جديد</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>إلغاء</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
            إضافة
          </Button>
        </DialogActions>
      </Dialog>
  );
}
