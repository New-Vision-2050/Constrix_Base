"use client";

import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ProjectImageUpload from "@/modules/content-management-system/projects/components/ProjectImageUpload";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import {
  projectStampQueryKey,
  useProjectStamp,
} from "@/modules/projects/project/query/useProjectStamp";
import { ProjectStampApi, validateProjectStampFile } from "@/services/api/projects/project-stamp";

function getApiErrorMessage(error: unknown, fallback: string): string {
  const message = (
    error as { response?: { data?: { message?: unknown } } }
  )?.response?.data?.message;
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
}

export default function ProjectStampEditMode() {
  const { projectId } = useProject();
  const queryClient = useQueryClient();
  const { data: stampData, isLoading } = useProjectStamp(projectId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setSelectedFile(null);
  }, [stampData?.url]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!projectId) throw new Error("Missing project id");
      return ProjectStampApi.upload(projectId, file);
    },
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "تم حفظ ختم المشروع بنجاح");
      queryClient.invalidateQueries({ queryKey: projectStampQueryKey(projectId) });
      setSelectedFile(null);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "تعذر حفظ ختم المشروع"));
    },
  });

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }
    const validationError = validateProjectStampFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setSelectedFile(file);
  };

  const handleSave = () => {
    if (!selectedFile) {
      toast.error("يرجى اختيار صورة الختم أولاً");
      return;
    }
    const validationError = validateProjectStampFile(selectedFile);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    uploadMutation.mutate(selectedFile);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          جاري التحميل...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 360 }}>
      <Typography variant="body2" color="text.secondary">
        ارفع صورة ختم المشروع (JPG, PNG, WebP — بحد أقصى 2 ميجابايت) لاستخدامها في
        دورة المستندات.
      </Typography>

      <ProjectImageUpload
        label="ختم المشروع"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        initialValue={stampData?.url ?? null}
        onChange={handleFileChange}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!selectedFile || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? "جاري الحفظ..." : "حفظ الختم"}
        </Button>
      </Box>
    </Box>
  );
}
