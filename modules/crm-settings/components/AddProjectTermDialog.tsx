"use client";

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
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { PRJ_ProjectTerm } from "@/types/api/projects/project-term/index";

interface AddProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Partial<PRJ_ProjectTerm>) => void;
}

export function AddProjectTermDialog({ open, onClose, onAdd }: AddProjectTermDialogProps) {
  const [formData, setFormData] = useState({
    reference_number: "",
    name: "",
    description: "",
    sub_items_count: 0,
    services: [] as string[],
    status: "1" as "0" | "1",
  });

  const [newService, setNewService] = useState("");

  const handleAddService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData({ ...formData, services: [...formData.services, newService.trim()] });
      setNewService("");
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setFormData({ 
      ...formData, 
      services: formData.services.filter(service => service !== serviceToRemove) 
    });
  };

  const handleSubmit = () => {
    onAdd(formData);
    setFormData({
      reference_number: "",
      name: "",
      description: "",
      sub_items_count: 0,
      services: [],
      status: "1",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>إضافة بند رئيسي جديد</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
         
          <TextField
            label="اسم البند"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="وصف البند"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="عدد البنود الفرعية"
            type="number"
            value={formData.sub_items_count}
            onChange={(e) => setFormData({ ...formData, sub_items_count: parseInt(e.target.value) || 0 })}
            fullWidth
          />
          
          {/* Services Field */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              خدمات البند
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                label="أضف خدمة جديدة"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleAddService}
                disabled={!newService.trim()}
                startIcon={<Add />}
              >
                إضافة
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.services.map((service, index) => (
                <Chip
                  key={index}
                  label={service}
                  onDelete={() => handleRemoveService(service)}
                  deleteIcon={<Close />}
                  size="small"
                  color="primary"
                />
              ))}
            </Box>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={formData.status === "1"}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "1" : "0" })}
              />
            }
            label="تفعيل البند"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          إضافة
        </Button>
      </DialogActions>
    </Dialog>
  );
}
