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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";
import { RhfTextField } from "../../shared/rhf-mui";
import {
  createWorkOrderFormSchema,
  type WorkOrderFormValues,
} from "../../shared/form-schemas";

export interface AddWorkOrderDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
  projectTypeId: number;
  onSuccess?: () => void;
}

const defaultValues: WorkOrderFormValues = {
  code: "",
  description: "",
  type: "",
};

export default function AddWorkOrderDialog({
  open,
  setOpenModal,
  projectTypeId,
  onSuccess,
}: AddWorkOrderDialogProps) {
  const t = useTranslations("projectSettings.workOrders");
  const tForm = useTranslations("projectSettings.workOrders.form");

  const schema = useMemo(() => createWorkOrderFormSchema(tForm), [tForm]);

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit, reset } = form;

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
    mutationFn: (values: WorkOrderFormValues) =>
      ProjectSharingWorkOrdersApi.create({
        project_type_id: projectTypeId,
        code: values.code,
        description: values.description,
        type: values.type,
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

  const onSubmit = (values: WorkOrderFormValues) => {
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
          bgcolor: "background.paper",
        },
      }}
    >
      <DialogContent>
        <DialogTitle
          sx={{
            p: 0,
            mb: 3,
            textAlign: "center",
            fontSize: "1.125rem",
            fontWeight: 600,
          }}
        >
          {t("addWorkOrder")}
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
            disabled={createMutation.isPending || !projectTypeId}
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
