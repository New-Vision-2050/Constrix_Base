"use client";

import React, { useMemo } from "react";
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
import type { DetailsDialogProps } from "../../shared/types";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ReportFormsApi } from "@/services/api/projects/report-forms";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";

const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";

export interface ReportFormDetailsDialogProps extends DetailsDialogProps {
  projectTypeId: number;
}

const ReportFormDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
  projectTypeId,
}: ReportFormDetailsDialogProps) => {
  const tDetails = useTranslations("projectSettings.reportForms.details");

  const handleClose = () => setOpenModal(false);

  const { data: workOrders = [] } = useQuery({
    queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled:
      open &&
      Boolean(rowId) &&
      Number.isFinite(projectTypeId) &&
      projectTypeId > 0,
  });

  const detailQuery = useQuery({
    queryKey: ["report-forms", rowId],
    queryFn: async () => {
      const res = await ReportFormsApi.show(rowId!);
      return res.data.payload;
    },
    enabled: open && Boolean(rowId),
  });

  const rf = detailQuery.data;

  const workOrderLabel = useMemo(() => {
    if (!rf) return "";
    const wo = workOrders.find((w) => w.id === rf.order_permit_procedure_id);
    return wo
      ? `${wo.code}${wo.description ? ` — ${wo.description}` : ""}`
      : "—";
  }, [rf, workOrders]);

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
        {tDetails("title")}
      </DialogTitle>

      <DialogContent>
        {detailQuery.isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : detailQuery.isError || !rf ? (
          <Typography textAlign="center" color="error">
            {tDetails("notFound")}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Typography variant="body2">
              <strong>{tDetails("formName")}:</strong> {rf.name}
            </Typography>
            <Typography variant="body2">
              <strong>{tDetails("workOrderType")}:</strong> {workOrderLabel}
            </Typography>
            <Typography variant="body2">
              <strong>{tDetails("question")}:</strong> {rf.question}
            </Typography>
            <Typography variant="body2">
              <strong>{tDetails("value")}:</strong> {rf.value}
            </Typography>
            <Typography variant="body2">
              <strong>{tDetails("numberOfAttachments")}:</strong>{" "}
              {rf.number_of_attachments}
            </Typography>
            <Typography variant="body2">
              <strong>{tDetails("notes")}:</strong> {rf.notes ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{tDetails("createdAt")}:</strong> {rf.created_at}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{tDetails("updatedAt")}:</strong> {rf.updated_at}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportFormDetailsDialog;
