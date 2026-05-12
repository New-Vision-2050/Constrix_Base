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
    employee_id: "",
    status: 1,
    end_date: "",
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch employees for dropdown
  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await baseApi.get("company-users/employees");
      console.log("Full API Response:", response);
      console.log("Response data:", response.data);
      console.log("Employees array:", response.data.payload);
      return response.data.payload || [];
    },
  });

  // Reset form when dialog opens/closes or editing insurance changes
  useEffect(() => {
    if (open) {
      if (editingInsurance) {
        setFormData({
          name: editingInsurance.name,
          policy_number: editingInsurance.policy_number,
          employee_id: editingInsurance.employee_id,
          status: editingInsurance.status,
          end_date: editingInsurance.end_date || "",
        });
      } else {
        setFormData({
          name: "",
          policy_number: "",
          employee_id: "",
          status: 1,
          end_date: "",
        });
      }
    }
  }, [open, editingInsurance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.policy_number || !formData.employee_id) {
      toast.error(t("allFieldsRequired"));
      return;
    }

    try {
      if (editingInsurance) {
        await MedicalInsuranceApi.update(editingInsurance.id, formData as UpdateMedicalInsuranceForm);
        toast.success(t("updateSuccess"));
      } else {
        await MedicalInsuranceApi.create(formData);
        toast.success(t("addSuccess"));
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
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
          label={t("name")}
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder={t("enterName")}
        />

        <TextField
          fullWidth
          label={t("policyNumber")}
          value={formData.policy_number}
          onChange={(e) => handleInputChange("policy_number", e.target.value)}
          placeholder={t("enterPolicyNumber")}
        />

        <FormControl fullWidth>
          <InputLabel>{t("employee")}</InputLabel>
          <MuiSelect
            value={formData.employee_id}
            label={t("employee")}
            onChange={(e) => handleInputChange("employee_id", e.target.value)}
          >
            {employeesData?.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.name}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>

        <TextField
          fullWidth
          type="date"
          label={t("startData")}
          value={formData.end_date}
          onChange={(e) => handleInputChange("end_date", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          type="date"
          label={t("endData")}
          value={formData.end_date}
          onChange={(e) => handleInputChange("end_date", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label={t("theTop")}
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder={t("enterTheTop")}
        />

        <TextField
          fullWidth
          label={t("numberOfIndividuals")}
          value={formData.policy_number}
          onChange={(e) => handleInputChange("policy_number", e.target.value)}
          placeholder={t("enterNumberOfIndividuals")}
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
