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
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";
import { RhfTextField } from "../../shared/rhf-mui";
import {
  createWorkOrderFormSchema,
  type WorkOrderFormValues,
} from "../../shared/form-schemas";

export interface WorkOrderDialogProps {
  open: boolean;
  onClose: () => void;
  workOrderId?: string;
  onSuccess?: () => void;
}

const emptyValues: WorkOrderFormValues = {
  code: "",
  description: "",
  type: "",
};

export default function EditWorkOrderDialog({
  open,
  onClose,
  workOrderId,
  onSuccess,
}: WorkOrderDialogProps) {
  const t = useTranslations("projectSettings.workOrders");
  const tForm = useTranslations("projectSettings.workOrders.form");

  const schema = useMemo(() => createWorkOrderFormSchema(tForm), [tForm]);

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const { control, handleSubmit, reset } = form;

  const detailQuery = useQuery({
    queryKey: ["project-sharing-work-order", workOrderId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.show(workOrderId!);
      return res.data.payload;
    },
    enabled: open && Boolean(workOrderId),
  });

  useEffect(() => {
    const p = detailQuery.data;
    if (!p) return;
    reset({
      code: p.code ?? "",
      description: p.description ?? "",
      type: p.type ?? "",
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
    mutationFn: (values: WorkOrderFormValues) =>
      ProjectSharingWorkOrdersApi.update(workOrderId!, {
        code: values.code,
        description: values.description,
        type: values.type,
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

  const onSubmit = (values: WorkOrderFormValues) => {
    if (!workOrderId) return;
    updateMutation.mutate(values);
  };

  const loading = detailQuery.isLoading && open && Boolean(workOrderId);

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
          bgcolor: "background.paper",
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
          {t("editWorkOrder")}
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
            <RhfTextField
              name="code"
              control={control}
              label={tForm("consultantCode")}
              fullWidth
              placeholder={tForm("consultantCodePlaceholder")}
            />

            <RhfTextField
              name="description"
              control={control}
              label={tForm("workOrderDescription")}
              fullWidth
              placeholder={tForm("workOrderDescriptionPlaceholder")}
              multiline
              rows={3}
            />

            <RhfTextField
              name="type"
              control={control}
              label={tForm("workOrderType")}
              fullWidth
              placeholder={tForm("workOrderTypePlaceholder")}
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
