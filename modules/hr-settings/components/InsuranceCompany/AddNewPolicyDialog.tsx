"use client";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  Drawer,
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
} from "@mui/material";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { MedicalInsuranceRow, CreateMedicalInsuranceForm, UpdateMedicalInsuranceForm, Employee } from "./types";
import { MedicalInsuranceApi } from "@/services/api/medical-insurance";
import { baseApi } from "@/config/axios/instances/base";
import { toast } from "sonner";

interface AddMedicalInsuranceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingInsurance?: MedicalInsuranceRow | null;
  onSuccess: () => void;
}

export default function AddNewPolicyDialog({
  open,
  onOpenChange,
  editingInsurance,
  onSuccess,
}: AddMedicalInsuranceDialogProps) {
  const t = useTranslations("hr-settings.insurance");
  const tCommon = useTranslations("common");

  // Form state
  const [formData, setFormData] = useState<CreateMedicalInsuranceForm>({
    name: "",
    policy_number: "",
    provider: "",
    start_date: "",
    end_date: "",
    value: 0,
    individuals_count: 0,
    status: 1,
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Removed employees dropdown - not needed

  // Reset form when dialog opens/closes or editing insurance changes
  useEffect(() => {
    if (open) {
      if (editingInsurance) {
        console.log("📝 Editing insurance:", editingInsurance);
        console.log("📝 Provider from editing insurance:", editingInsurance.provider);
        setFormData({
          name: editingInsurance.name,
          policy_number: editingInsurance.policy_number,
          provider: editingInsurance.provider || "",
          start_date: editingInsurance.start_date || "",
          end_date: editingInsurance.end_date || "",
          value: editingInsurance.value || 0,
          individuals_count: editingInsurance.individuals_count || 0,
          status: editingInsurance.status,
        });
      } else {
        setFormData({
          name: "",
          policy_number: "",
          provider: "",
          start_date: "",
          end_date: "",
          value: 0,
          individuals_count: 0,
          status: 1,
        });
      }
    }
  }, [open, editingInsurance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.policy_number || !formData.provider || !formData.start_date || !formData.end_date) {
      toast.error(t("allFieldsRequired"));
      return;
    }

    // Validate end date is at least one day after start date
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const minEndDate = new Date(startDate);
      minEndDate.setDate(minEndDate.getDate() + 1);

      if (endDate < minEndDate) {
        toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية بيوم واحد على الأقل");
        return;
      }
    }

    try {
      const submitData = {
        ...formData,
        attachment: attachment || undefined,
      };

      console.log("📤 Submitting insurance data:", submitData);
      console.log("📤 Provider value:", submitData.provider);

      if (editingInsurance) {
        const response = await MedicalInsuranceApi.update(editingInsurance.id, submitData as UpdateMedicalInsuranceForm);
        console.log("✅ Update response:", response);
        toast.success(t("updateSuccess"));
      } else {
        const response = await MedicalInsuranceApi.create(submitData);
        console.log("✅ Create response:", response);
        toast.success(t("addSuccess"));
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("❌ Submit error:", error);
      toast.error(t("saveError"));
    }
  };

  const handleInputChange = (field: keyof CreateMedicalInsuranceForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
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
          {editingInsurance ? t("editInsurance") : t("addInsurance")}
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
          label={t("name") || "اسم الخدمة"}
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder={t("enterName")}
          required
        />

        <TextField
          fullWidth
          label={t("policyNumber") || "رقم الوثيقة"}
          value={formData.policy_number}
          onChange={(e) => handleInputChange("policy_number", e.target.value)}
          placeholder={t("enterPolicyNumber")}
          required
        />

        <TextField
          fullWidth
          label="مزود الخدمة"
          value={formData.provider}
          onChange={(e) => handleInputChange("provider", e.target.value)}
          placeholder="أدخل مزود الخدمة"
          required
        />

        <TextField
          fullWidth
          type="date"
          label="تاريخ البداية"
          value={formData.start_date}
          onChange={(e) => handleInputChange("start_date", e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          fullWidth
          type="date"
          label="تاريخ النهاية"
          value={formData.end_date}
          onChange={(e) => handleInputChange("end_date", e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: formData.start_date ? (() => {
              const startDate = new Date(formData.start_date);
              startDate.setDate(startDate.getDate() + 1);
              return startDate.toISOString().split('T')[0];
            })() : undefined
          }}
          required
        />

        <TextField
          fullWidth
          type="number"
          label="القيمة"
          value={formData.value}
          onChange={(e) => handleInputChange("value", Number(e.target.value))}
          placeholder="أدخل القيمة"
          required
        />

        <TextField
          fullWidth
          type="number"
          label="عدد الأفراد"
          value={formData.individuals_count}
          onChange={(e) => handleInputChange("individuals_count", Number(e.target.value))}
          placeholder="أدخل عدد الأفراد"
          required
        />

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2">{t("addAttachment")}</Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={handleAttachmentClick}
          >
            <AttachFileIcon sx={{ color: attachment ? "primary.main" : "text.secondary" }} />
          </Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: "none" }}
            accept="image/*,.pdf,.doc,.docx"
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            {editingInsurance ? t("update") : t("add")}
          </Button>

        </Box>
      </Box>
    </Drawer>
  );
}
