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
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReportFormsApi } from "@/services/api/projects/report-forms";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";
import { RhfTextField, RhfSelect } from "../../shared/rhf-mui";
import {
  createReportFormCreateSchema,
  type ReportFormCreateValues,
} from "../../shared/form-schemas";

const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";

export interface AddReportFormDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
  projectTypeId: number;
  onSuccess?: () => void;
}

const defaultValues: ReportFormCreateValues = {
  projectSharingWorkOrderId: "",
  name: "",
  question: "",
  value: "",
  numberOfAttachments: "",
  notes: "",
};

export default function AddReportFormDialog({
  open,
  setOpenModal,
  projectTypeId,
  onSuccess,
}: AddReportFormDialogProps) {
  const t = useTranslations("projectSettings.reportForms");
  const tForm = useTranslations("projectSettings.reportForms.form");

  const schema = useMemo(() => createReportFormCreateSchema(tForm), [tForm]);

  const form = useForm<ReportFormCreateValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit, reset } = form;

  const { data: workOrders = [], isLoading: workOrdersLoading } = useQuery({
    queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled: open && Number.isFinite(projectTypeId) && projectTypeId > 0,
  });

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const handleClose = () => {
    reset(defaultValues);
    setOpenModal(false);
  };

  const createMutation = useMutation({
    mutationFn: (values: ReportFormCreateValues) =>
      ReportFormsApi.create({
        project_type_id: projectTypeId,
        order_permit_procedure_id: Number(values.projectSharingWorkOrderId),
        name: values.name,
        question: values.question,
        value: values.value,
        number_of_attachments: values.numberOfAttachments,
        notes: values.notes.trim() ? values.notes.trim() : null,
      }),
    onSuccess: () => {
      toast.success(tForm("createSuccess"));
      onSuccess?.();
      handleClose();
    },
    onError: () => {
      toast.error(tForm("createError"));
    },
  });

  const onSubmit = (values: ReportFormCreateValues) => {
    createMutation.mutate(values);
  };

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
          {t("addReportForm")}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <RhfTextField
            name="name"
            control={control}
            label={tForm("formName")}
            fullWidth
            placeholder={tForm("formNamePlaceholder")}
          />

          <RhfSelect
            name="projectSharingWorkOrderId"
            control={control}
            label={tForm("workOrderType")}
            disabled={workOrdersLoading}
          >
            <MenuItem value="">
              <em>{tForm("workOrderTypePlaceholder")}</em>
            </MenuItem>
            {workOrders.map((wo) => (
              <MenuItem key={wo.id} value={String(wo.id)}>
                {wo.type}
              </MenuItem>
            ))}
          </RhfSelect>

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
            disabled={
              createMutation.isPending ||
              !projectTypeId ||
              workOrdersLoading ||
              workOrders.length === 0
            }
          >
            {createMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              tForm("save")
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
