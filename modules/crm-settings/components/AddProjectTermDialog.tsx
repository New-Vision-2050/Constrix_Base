"use client";


import React, {useState, useEffect} from "react";
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
  Checkbox,
  FormGroup,
} from "@mui/material";
import { useLocale } from "next-intl";
import { PRJ_ProjectTerm } from "@/types/api/projects/project-term";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProjectTermsApi } from "@/services/api/projects/project-terms";
import { TermService } from "@/services/api/projects/project-terms/types/response";

const projectTermSchema = z.object({
  name: z.string().min(1, "اسم البند مطلوب"),
  description: z.string().optional(),
  parent_id: z.number().nullable().optional(),
  project_type_id: z.number().optional(),
  term_services_ids: z.array(z.number()).optional(),
});

type ProjectTermFormData = z.infer<typeof projectTermSchema>;

interface AddProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  parentId?: number | null;
  isChild?: boolean;
}

export function AddProjectTermDialog({ open, onClose, onAdd, parentId, isChild = false }: AddProjectTermDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: parentId || null,
    project_type_id: undefined as number | undefined,
    term_services_ids: [] as number[],
  });

  const [services, setServices] = useState<TermService[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchServices();
    }
  }, [open]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      parent_id: parentId || null
    }));
  }, [parentId]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      console.log("Fetching services...");
      const response = await ProjectTermsApi.getTermServices();
      console.log("Services response:", response);
      
      if (response.data.code === "SUCCESS_WITH_LIST_PAYLOAD_OBJECTS") {
        console.log("Services data:", response.data.payload);
        setServices(response.data.payload);
      } else {
        console.log("API response not successful, using mock data");
        setServices([
          { id: 1, name: "مرفقات" },
          { id: 2, name: "خطابات" },
          { id: 3, name: "المهمات" },
          { id: 4, name: "النسبة المئوية" },
          { id: 5, name: "معاملات" },
          { id: 6, name: "فريق عمل" },
          { id: 7, name: "الشخص المسؤول" },
        ]);
      }
    } catch (error) {
      console.error("Network error fetching services:", error);
      console.log("Using mock data due to network error");
      // Always use mock data on network error
      setServices([
        { id: 1, name: "مرفقات" },
        { id: 2, name: "خطابات" },
        { id: 3, name: "المهمات" },
        { id: 4, name: "النسبة المئوية" },
        { id: 5, name: "معاملات" },
        { id: 6, name: "فريق عمل" },
        { id: 7, name: "الشخص المسؤول" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (serviceId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      term_services_ids: checked 
        ? [...prev.term_services_ids, serviceId]
        : prev.term_services_ids.filter(id => id !== serviceId)
    }));
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);
    const response = await ProjectTermsApi.createTermSetting({
      name: formData.name,
      description: formData.description,
      parent_id: formData.parent_id,
      project_type_id: formData.project_type_id,
      term_services_ids: formData.term_services_ids,
    });
    
    if (response.data.code === "SUCCESS_WITH_LIST_PAYLOAD_OBJECTS") {
      onAdd(response.data.payload);
      setFormData({
        name: "",
        description: "",
        parent_id: null,
        project_type_id: undefined,
        term_services_ids: [],
      });
      onClose();
    } else {
      console.error("Failed to create term setting:", response.data.message);
    }
  } catch (error) {
    console.error("Error creating term setting:", error);
  } finally {
    setLoading(false);
  }
};

  return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir={isRtl ? "rtl" : "ltr"}>
        <DialogTitle>{isChild ? "إضافة بند فرعي" : "إضافة بند رئيسي جديد"}</DialogTitle>
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

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                الخدمات
              </Typography>
              {loading ? (
                <Typography>جاري تحميل الخدمات...</Typography>
              ) : (
                <>
                  <FormGroup sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    {services.map((service) => (
                      <FormControlLabel
                        key={service.id}
                        control={
                          <Checkbox
                            checked={formData.term_services_ids.includes(service.id)}
                            onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                          />
                        }
                        label={service.name}
                      />
                    ))}
                  </FormGroup>
                </>
              )}
            </Box>

          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onClose}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>

            {loading ? "جاري الحفظ..." : "حفظ"}
          </Button>
          </Box>
        </DialogActions>
      </Dialog>
  );
}
