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
import type { DetailsDialogProps } from "../../shared/types";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ProjectSharingDepartmentApi } from "@/services/api/projects/project-sharing-department";

const SectionDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
}: DetailsDialogProps) => {
  const tDetails = useTranslations("projectSettings.section.details");

  const handleClose = () => setOpenModal(false);

  const detailQuery = useQuery({
    queryKey: ["project-sharing-department", rowId],
    queryFn: async () => {
      const res = await ProjectSharingDepartmentApi.show(rowId!);
      return res.data.payload;
    },
    enabled: open && Boolean(rowId),
  });

  const section = detailQuery.data;

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
        ) : detailQuery.isError || !section ? (
          <Typography textAlign="center" color="error">
            {tDetails("notFound")}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Typography variant="body2">
              <strong>{tDetails("sectionCode")}:</strong> {section.code}
            </Typography>
            <Typography variant="body2">
              <strong>{tDetails("sectionDescription")}:</strong>{" "}
              {section.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{tDetails("createdAt")}:</strong> {section.created_at}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{tDetails("updatedAt")}:</strong> {section.updated_at}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SectionDetailsDialog;
