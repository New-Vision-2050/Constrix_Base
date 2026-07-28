"use client";

import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { File as FileIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRequirementSubmissions } from "@/modules/projects/project/query/useProjectRequirements";
import type { DocumentRequirementRow } from "../types";

interface SubmissionHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  projectId?: string;
  requirement: DocumentRequirementRow | null;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function SubmissionHistoryDialog({
  open,
  onClose,
  projectId,
  requirement,
}: SubmissionHistoryDialogProps) {
  const t = useTranslations("project.documentRequirements");
  const submissionsQuery = useRequirementSubmissions(
    projectId,
    requirement?.id,
    open && !!requirement,
  );

  const submissions = submissionsQuery.data ?? [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            {t("history.title")}
          </Typography>
          {requirement ? (
            <Typography variant="body2" color="text.secondary">
              {requirement.requiredDocumentName}
            </Typography>
          ) : null}
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {submissionsQuery.isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : submissions.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
            {t("history.empty")}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {submissions.map((submission) => (
              <Box
                key={submission.id}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography fontWeight={700} sx={{ mb: 1 }}>
                  {formatDate(submission.submitted_at ?? submission.created_at)}
                </Typography>
                {(submission.files ?? []).length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t("history.noFiles")}
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    {(submission.files ?? []).map((file) => {
                      const label =
                        file.file_name?.trim() ||
                        file.name?.trim() ||
                        String(file.id);
                      return (
                        <Box
                          key={String(file.id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <FileIcon size={14} />
                          {file.url ? (
                            <Link
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              variant="body2"
                            >
                              {label}
                            </Link>
                          ) : (
                            <Typography variant="body2">{label}</Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
