"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
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
import { RhfTextField } from "../../shared/rhf-mui";
import {
  createReportFormEditSchema,
  type ReportFormEditValues,
} from "../../shared/form-schemas";

const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";

export interface EditReportFormDialogProps {
  open: boolean;
  onClose: () => void;
  reportFormId?: string;
  projectTypeId: number;
  onSuccess?: () => void;
}

const emptyValues: ReportFormEditValues = {
  name: "",
  question: "",
  value: "",
  numberOfAttachments: "",
  notes: "",
};

export default function EditReportFormDialog({
  open,
  onClose,
  reportFormId,
  projectTypeId,
  onSuccess,
}: EditReportFormDialogProps) {
  const t = useTranslations("projectSettings.reportForms");
  const tForm = useTranslations("projectSettings.reportForms.form");

  const schema = useMemo(() => createReportFormEditSchema(tForm), [tForm]);

  const form = useForm<ReportFormEditValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const { control, handleSubmit, reset } = form;

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
    return wo
      ? `${wo.code}${wo.description ? ` — ${wo.description}` : ""}`
      : "";
  }, [detailQuery.data, workOrders]);

  useEffect(() => {
    const p = detailQuery.data;
    if (!p) return;
    reset({
      name: p.name ?? "",
      question: p.question ?? "",
      value: p.value ?? "",
      numberOfAttachments: p.number_of_attachments ?? "",
      notes: p.notes ?? "",
    });
  }, [detailQuery.data, reset]);

  useEffect(() => {
    if (!open) {
      reset(emptyValues);
    }
  }, [open, reset]);

  const handleClose = () => {
    onClose();
  };

  const updateMutation = useMutation({
    mutationFn: (values: ReportFormEditValues) =>
      ReportFormsApi.update(reportFormId!, {
        name: values.name,
        question: values.question,
        value: values.value,
        number_of_attachments: values.numberOfAttachments,
        notes: values.notes.trim() ? values.notes.trim() : null,
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

  const onSubmit = (values: ReportFormEditValues) => {
    if (!reportFormId) return;
    updateMutation.mutate(values);
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
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {workOrderLabel ? (
              <Typography variant="body2" color="text.secondary">
                <strong>{tForm("workOrderType")}:</strong> {workOrderLabel}
              </Typography>
            ) : null}

            <RhfTextField
              name="name"
              control={control}
              label={tForm("formName")}
              fullWidth
              placeholder={tForm("formNamePlaceholder")}
            />

            <RhfTextField
              name="question"
              control={control}
              label={tForm("theQuestion")}
              fullWidth
              placeholder={tForm("theQuestionPlaceholder")}
            />

            <RhfTextField
              name="value"
              control={control}
              label={tForm("value")}
              fullWidth
              placeholder={tForm("valuePlaceholder")}
            />

            <RhfTextField
              name="numberOfAttachments"
              control={control}
              label={tForm("numberOfAttachments")}
              fullWidth
              placeholder={tForm("numberOfAttachmentsPlaceholder")}
            />

            <RhfTextField
              name="notes"
              control={control}
              label={tForm("notes")}
              fullWidth
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
