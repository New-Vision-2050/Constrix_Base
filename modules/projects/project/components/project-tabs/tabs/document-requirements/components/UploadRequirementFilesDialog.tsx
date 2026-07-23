"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { File as FileIcon, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import SaveButton from "@/components/shared/buttons/save";
import CancelButton from "@/components/shared/buttons/cancel";
import { useCreateRequirementSubmission } from "@/modules/projects/project/query/useProjectRequirements";
import type { DocumentRequirementRow } from "../types";

interface UploadRequirementFilesDialogProps {
  open: boolean;
  onClose: () => void;
  projectId?: string;
  requirement: DocumentRequirementRow | null;
}

export default function UploadRequirementFilesDialog({
  open,
  onClose,
  projectId,
  requirement,
}: UploadRequirementFilesDialogProps) {
  const t = useTranslations("project.documentRequirements");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const createSubmission = useCreateRequirementSubmission(projectId);

  useEffect(() => {
    if (!open) {
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  const handleClose = () => {
    if (createSubmission.isPending) return;
    onClose();
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!requirement) return;
    if (!files.length) {
      toast.error(t("upload.filesRequired"));
      return;
    }

    try {
      await createSubmission.mutateAsync({
        requirementId: requirement.id,
        files,
      });
      toast.success(t("upload.success"));
      onClose();
    } catch (error) {
      const api = error as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[]>;
          };
        };
      };
      const fieldError = api.response?.data?.errors
        ? Object.values(api.response.data.errors).flat()[0]
        : undefined;
      toast.error(
        (typeof fieldError === "string" && fieldError) ||
          api.response?.data?.message ||
          t("upload.error"),
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {t("upload.title")}
          </Typography>
          {requirement ? (
            <Typography variant="body2" color="text.secondary">
              {requirement.requiredDocumentName}
            </Typography>
          ) : null}
        </Box>
        <IconButton onClick={handleClose} disabled={createSubmission.isPending}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: "action.hover",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <Upload size={28} style={{ marginInline: "auto" }} />
          <Typography sx={{ mt: 1.5, fontWeight: 600 }}>
            {t("upload.pickFiles")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("upload.pickFilesHint")}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleFilesChange}
          />
        </Box>

        {files.length > 0 ? (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            {files.map((file, index) => (
              <Box
                key={`${file.name}-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <FileIcon size={16} />
                <Typography
                  variant="body2"
                  sx={{ flex: 1, minWidth: 0 }}
                  noWrap
                >
                  {file.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeFile(index)}
                  disabled={createSubmission.isPending}
                >
                  <X size={14} />
                </IconButton>
              </Box>
            ))}
          </Box>
        ) : null}

        {createSubmission.isPending ? (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
        <CancelButton onClick={handleClose} disabled={createSubmission.isPending} />
        <SaveButton
          onClick={handleSubmit}
          disabled={!files.length || createSubmission.isPending}
        >
          {t("upload.submit")}
        </SaveButton>
      </DialogActions>
    </Dialog>
  );
}
