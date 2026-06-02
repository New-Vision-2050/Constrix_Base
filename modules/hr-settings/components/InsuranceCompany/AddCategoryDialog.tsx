"use client";
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (category: any) => void;
  editingCategory?: any;
}

export default function AddCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
  editingCategory,
}: AddCategoryDialogProps) {
  const t = useTranslations("hr-settings.insurance");

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    coverage_limit: "",
    description: "",
  });

  // Reset form when dialog opens/closes or editing category changes
  useEffect(() => {
    if (open) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name,
          type: editingCategory.type || editingCategory.categoryType,
          coverage_limit: editingCategory.coverage_limit || editingCategory.coveragelimit || editingCategory.maxCoverage,
          description: editingCategory.description,
        });
      } else {
        setFormData({
          name: "",
          type: "",
          coverage_limit: "",
          description: "",
        });
      }
    }
  }, [open, editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("يرجى إدخال اسم الفئة");
      return;
    }

    const categoryData = editingCategory
      ? { ...formData, id: editingCategory.id }
      : formData;

    // TODO: Implement API call for creating/updating category
    console.log("Saving category:", categoryData);
    toast.success(editingCategory ? "تم تعديل الفئة بنجاح" : "تم إضافة الفئة بنجاح");

    onOpenChange(false);
    onSuccess(categoryData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => onOpenChange(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 400 },
          p: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {editingCategory ? "تعديل الفئة" : t("addCategory")}
        </Typography>
        <Button onClick={() => onOpenChange(false)} sx={{ minWidth: "auto", p: 1 }}>
          <X size={20} />
        </Button>
      </Box>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <TextField
          fullWidth
          label="اسم الفئة"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="أدخل اسم الفئة"
          required
        />

        <FormControl fullWidth>
          <InputLabel>نوع الفئة</InputLabel>
          <MuiSelect
            value={formData.type}
            label="نوع الفئة"
            onChange={(e) => handleInputChange("type", e.target.value)}
          >
            <MenuItem value="موظفون داخليون">موظفون داخليون</MenuItem>
            <MenuItem value="موظفون خارجيون">موظفون خارجيون</MenuItem>
            <MenuItem value="عائلات">عائلات</MenuItem>
          </MuiSelect>
        </FormControl>


        <TextField
            fullWidth
            label="الحد الاقصي لتغطيه"
            value={formData.coverage_limit}
            onChange={(e) => handleInputChange("coverage_limit", e.target.value)}
            placeholder="أدخل الحد الاقصي لتغطيه"
            required
        />
        <TextField
          fullWidth
          label="الوصف"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="أدخل وصف الفئة"
          multiline
          rows={4}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            {editingCategory ? "حفظ" : t("add")}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
