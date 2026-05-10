"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReportFormsApi } from "@/services/api/projects/report-forms";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";

const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";

export interface EditReportFormDialogProps {
  open: boolean;
  onClose: () => void;
  reportFormId?: string;
  projectTypeId: number;
  onSuccess?: () => void;
}

export default function EditReportFormDialog({
  open,
  onClose,
  reportFormId,
  projectTypeId,
  onSuccess,
}: EditReportFormDialogProps) {
  const t = useTranslations("projectSettings.reportForms");
  const tForm = useTranslations("projectSettings.reportForms.form");

  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [value, setValue] = useState("");
  const [numberOfAttachments, setNumberOfAttachments] = useState("");
  const [notes, setNotes] = useState("");

  const { data: workOrders = [] } = useQuery({
    queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled:
      open &&
      Number.isFinite(projectTypeId) &&
      projectTypeId > 0 &&
      Boolean(reportFormId),
  });

  const detailQuery = useQuery({
    queryKey: ["report-forms", reportFormId],
    queryFn: async () => {
      const res = await ReportFormsApi.show(reportFormId!);
      return res.data.payload;
    },
    enabled: open && Boolean(reportFormId),
  });

  const workOrderLabel = useMemo(() => {
    const wid = detailQuery.data?.project_sharing_work_order_id;
    if (wid == null) return "";
    const wo = workOrders.find((w) => w.id === wid);
    return wo ? `${wo.code}${wo.description ? ` — ${wo.description}` : ""}` : "";
  }, [detailQuery.data, workOrders]);

  useEffect(() => {
    const p = detailQuery.data;
    if (!p) return;
    setName(p.name ?? "");
    setQuestion(p.question ?? "");
    setValue(p.value ?? "");
    setNumberOfAttachments(p.number_of_attachments ?? "");
    setNotes(p.notes ?? "");
  }, [detailQuery.data]);

  useEffect(() => {
    if (!open) {
      setName("");
      setQuestion("");
      setValue("");
      setNumberOfAttachments("");
      setNotes("");
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      ReportFormsApi.update(reportFormId!, {
        name: name.trim(),
        question: question.trim(),
        value: value.trim(),
        number_of_attachments: numberOfAttachments.trim(),
        notes: notes.trim() ? notes.trim() : null,
      }),
    onSuccess: () => {
      toast.success(tForm("updateSuccess"));
      onSuccess?.();
      handleClose();
    },
    onError: () => {
      toast.error(tForm("updateError"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFormId) return;
    if (
      !name.trim() ||
      !question.trim() ||
      !value.trim() ||
      numberOfAttachments.trim() === ""
    ) {
      toast.error(tForm("validationError"));
      return;
    }
    updateMutation.mutate();
  };

  const loading = detailQuery.isLoading && open && Boolean(reportFormId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          color: "text.primary",
          borderRadius: "8px",
          border: 1,
          borderColor: "divider",
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <DialogTitle
          sx={{
            p: 0,
            mb: 3,
            textAlign: "center",
            fontSize: "1.125rem",
            fontWeight: 600,
          }}
        >
          {t("editReportForm")}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : detailQuery.isError ? (
          <Typography color="error" textAlign="center">
            {tForm("updateError")}
          </Typography>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {workOrderLabel ? (
              <Typography variant="body2" color="text.secondary">
                <strong>{tForm("workOrderType")}:</strong> {workOrderLabel}
              </Typography>
            ) : null}

            <TextField
              label={tForm("formName")}
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tForm("formNamePlaceholder")}
            />

            <TextField
              label={tForm("theQuestion")}
              required
              fullWidth
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={tForm("theQuestionPlaceholder")}
            />

            <TextField
              label={tForm("value")}
              required
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={tForm("valuePlaceholder")}
            />

            <TextField
              label={tForm("numberOfAttachments")}
              required
              fullWidth
              value={numberOfAttachments}
              onChange={(e) => setNumberOfAttachments(e.target.value)}
              placeholder={tForm("numberOfAttachmentsPlaceholder")}
            />

            <TextField
              label={tForm("notes")}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={tForm("notesPlaceholder")}
              multiline
              rows={3}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                tForm("save")
              )}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
