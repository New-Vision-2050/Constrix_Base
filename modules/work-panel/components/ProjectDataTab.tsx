"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { apiClient } from "@/config/axios-config";
import { useWorkPanelContext } from "../context/WorkPanelContext";
import { Save, Edit2 } from "lucide-react";

interface ProjectData {
  projectTypeId: string;
  referenceNumber?: string;
  projectName?: string;
  details?: string;
  responsibleEngineer?: string;
  contractNumber?: string;
  contractType?: string;
  costCenter?: string;
  projectValue?: number;
  startDate?: string;
  completionPercentage?: number;
}

interface ProjectDataTabProps {
  // projectTypeId will come from context now
}

export default function ProjectDataTab({}: ProjectDataTabProps) {
  const t = useTranslations("WorkPanel");
  const queryClient = useQueryClient();
  const { selectedBranchId } = useWorkPanelContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProjectData>({
    projectTypeId: selectedBranchId || "",
  });

  console.log("ProjectDataTab rendered!");
  console.log("selectedBranchId:", selectedBranchId);

  // GET - جلب بيانات المشروع
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project-data", selectedBranchId],
    queryFn: async () => {
      console.log("GET query function called!");
      console.log("selectedBranchId in query:", selectedBranchId);
      
      if (!selectedBranchId) {
        console.log("No selectedBranchId, returning null");
        return null;
      }
      
      const url = `/project-types/${selectedBranchId}/department-contract-settings`;
      console.log("Making GET request to:", url);
      
      const response = await apiClient.get<ServerSuccessResponse<ProjectData>>(url);
      console.log("GET response:", response);
      return response.data.payload;
    },
    enabled: !!selectedBranchId,
    onSuccess: (data) => {
      console.log("GET query successful:", data);
      if (data) {
        setFormData(data);
      }
    },
    onError: (error) => {
      console.error("GET query error:", error);
    },
  });

  // UPDATE - تحديث بيانات المشروع
  const updateMutation = useMutation({
    mutationFn: async (updatedData: ProjectData) => {
      console.log("API call starting...");
      console.log("URL:", `/project-types/${selectedBranchId}/department-contract-settings`);
      console.log("Data being sent:", updatedData);
      
      if (!selectedBranchId) {
        throw new Error("No selected branch ID");
      }
      
      const response = await apiClient.put<ServerSuccessResponse<ProjectData>>(
        `/project-types/${selectedBranchId}/department-contract-settings`,
        updatedData
      );
      
      console.log("API response:", response);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Update successful:", data);
      setIsEditing(false);
      queryClient.invalidateQueries(["project-data", selectedBranchId]);
      // هنا تقدر تضيف toast message للنجاح
    },
    onError: (error) => {
      console.error("Error updating project data:", error);
      console.error("Error response:", error.response?.data);
      // هنا تقدر تضيف toast message للخطأ
    },
  });

  const handleInputChange = (field: keyof ProjectData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Save button clicked!");
    console.log("Form data to save:", formData);
    console.log("Selected branch ID:", selectedBranchId);
    
    if (!selectedBranchId) {
      console.error("No selected branch ID");
      return;
    }
    
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (data) {
      setFormData(data);
    }
    setIsEditing(false);
  };

  const projectData = data || formData;

  return (
    <Box className="p-6">
      <Paper className="p-6">
        {!selectedBranchId ? (
          <Box className="text-center py-12">
            <Typography variant="h6" className="text-muted-foreground mb-2">
              {t("pleaseSelectBranch")}
            </Typography>
            <Typography variant="body2" className="text-muted-foreground">
              {t("selectBranchToViewProjectData")}
            </Typography>
          </Box>
        ) : (
          <>
            <Box className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="font-bold">
                {t("projectData")}
              </Typography>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit2 size={16} />}
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                >
                  {t("edit")}
                </Button>
              ) : (
                <Box className="flex gap-2">
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={updateMutation.isLoading}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save size={16} />}
                    onClick={handleSave}
                    disabled={updateMutation.isLoading}
                  >
                    {updateMutation.isLoading ? t("saving") : t("save")}
                  </Button>
                </Box>
              )}
            </Box>

            {isLoading ? (
              <Typography className="text-center py-8">
                {t("loading")}
              </Typography>
            ) : isError ? (
              <Typography className="text-center py-8 text-red-500">
                {t("errorLoading")}
              </Typography>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("referenceNumber")}
                    value={projectData.referenceNumber || ""}
                    onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("projectName")}
                    value={projectData.projectName || ""}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("details")}
                    value={projectData.details || ""}
                    onChange={(e) => handleInputChange("details", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("responsibleEngineer")}
                    value={projectData.responsibleEngineer || ""}
                    onChange={(e) => handleInputChange("responsibleEngineer", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("contractNumber")}
                    value={projectData.contractNumber || ""}
                    onChange={(e) => handleInputChange("contractNumber", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("contractType")}
                    value={projectData.contractType || ""}
                    onChange={(e) => handleInputChange("contractType", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("costCenter")}
                    value={projectData.costCenter || ""}
                    onChange={(e) => handleInputChange("costCenter", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("projectValue")}
                    value={projectData.projectValue || ""}
                    onChange={(e) => handleInputChange("projectValue", Number(e.target.value))}
                    disabled={!isEditing}
                    size="small"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("startDate")}
                    value={projectData.startDate || ""}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("completionPercentage")}
                    value={projectData.completionPercentage || ""}
                    onChange={(e) => handleInputChange("completionPercentage", Number(e.target.value))}
                    disabled={!isEditing}
                    size="small"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
