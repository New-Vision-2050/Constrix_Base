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
  type ProjectStampQueryData,
} from "@/modules/projects/project/query/useProjectStamp";
import {
  ProjectStampApi,
  resolveStampUrlFromApiBody,
  validateProjectStampFile,
} from "@/services/api/projects/project-stamp";

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
  const { data: stampData, isPending } = useProjectStamp(projectId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const stampUrl = stampData?.url ?? null;

  useEffect(() => {
    setSelectedFile(null);
  }, [stampUrl]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!projectId) throw new Error("Missing project id");
      return ProjectStampApi.upload(projectId, file);
    },
    onSuccess: async (res, file) => {
      toast.success(res.data?.message ?? "تم حفظ ختم المشروع بنجاح");

      const uploadedUrl =
        resolveStampUrlFromApiBody(res.data) || URL.createObjectURL(file);
      const nextData: ProjectStampQueryData = {
        raw: res.data?.payload ?? null,
        url: uploadedUrl,
      };

      queryClient.setQueryData(projectStampQueryKey(projectId), nextData);

      await queryClient.invalidateQueries({
        queryKey: projectStampQueryKey(projectId),
      });

      const after = queryClient.getQueryData<ProjectStampQueryData>(
        projectStampQueryKey(projectId),
      );
      if (!after?.url) {
        queryClient.setQueryData(projectStampQueryKey(projectId), nextData);
      }

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

  if (isPending) {
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
        key={stampUrl ?? "no-stamp"}
        label="ختم المشروع"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        initialValue={stampUrl}
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
