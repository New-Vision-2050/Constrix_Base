"use client";

import React, { useEffect, useState } from "react";
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
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";

export interface WorkOrderDialogProps {
  open: boolean;
  onClose: () => void;
  workOrderId?: string;
  onSuccess?: () => void;
}

export default function EditWorkOrderDialog({
  open,
  onClose,
  workOrderId,
  onSuccess,
}: WorkOrderDialogProps) {
  const t = useTranslations("projectSettings.workOrders");
  const tForm = useTranslations("projectSettings.workOrders.form");

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

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
    setCode(p.code ?? "");
    setDescription(p.description ?? "");
    setType(p.type ?? "");
  }, [detailQuery.data]);

  useEffect(() => {
    if (!open) {
      setCode("");
      setDescription("");
      setType("");
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      ProjectSharingWorkOrdersApi.update(workOrderId!, {
        code: code.trim(),
        description: description.trim(),
        type: type.trim(),
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
    if (!workOrderId) return;
    if (!code.trim() || !description.trim() || !type.trim()) {
      toast.error(tForm("validationError"));
      return;
    }
    updateMutation.mutate();
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
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label={tForm("consultantCode")}
              required
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={tForm("consultantCodePlaceholder")}
            />

            <TextField
              label={tForm("workOrderDescription")}
              required
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={tForm("workOrderDescriptionPlaceholder")}
              multiline
              rows={3}
            />

            <TextField
              label={tForm("workOrderType")}
              required
              fullWidth
              value={type}
              onChange={(e) => setType(e.target.value)}
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
