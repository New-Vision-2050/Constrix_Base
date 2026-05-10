"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DetailsDialogProps } from "../../types";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";

const WorkOrderDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
}: DetailsDialogProps) => {
  const t = useTranslations("projectSettings.workOrders");
  const tForm = useTranslations("projectSettings.workOrders.form");

  const handleClose = () => setOpenModal(false);

  const detailQuery = useQuery({
    queryKey: ["project-sharing-work-order", rowId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.show(rowId!);
      return res.data.payload;
    },
    enabled: open && Boolean(rowId),
  });

  const p = detailQuery.data;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          p: 2,
        },
      }}
    >
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

      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.25rem",
          pb: 1,
        }}
      >
        {t("detailsTitle")}
      </DialogTitle>

      <DialogContent>
        {detailQuery.isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : detailQuery.isError || !p ? (
          <Typography color="error" textAlign="center">
            {t("error")}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Typography variant="body2">
              <strong>{tForm("consultantCode")}:</strong> {p.code}
            </Typography>
            <Typography variant="body2">
              <strong>{tForm("workOrderType")}:</strong> {p.type}
            </Typography>
            <Typography variant="body2">
              <strong>{tForm("workOrderDescription")}:</strong> {p.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t("createdAt")}:</strong> {p.created_at}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t("updatedAt")}:</strong> {p.updated_at}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderDetailsDialog;
