"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface AddWorkOrderDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
}

export default function AddWorkOrderDialog({
  open,
  setOpenModal,
}: AddWorkOrderDialogProps) {
  const t = useTranslations("projectSettings.workOrders");
  const tForm = useTranslations("projectSettings.workOrders.form");

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          position: "fixed",
          top: 0,
          right: 0,
        },
      }}
    >
      <DialogContent>
        <DialogTitle sx={{ p: 0, mb: 3, textAlign: "center", fontSize: "1.125rem", fontWeight: 600 }}>
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Consultant Code */}
          <TextField
            label={tForm("consultantCode")}
            required
            fullWidth
            placeholder={tForm("consultantCodePlaceholder")}
          />
          
          {/* Work Order Description */}
          <TextField
            label={tForm("workOrderDescription")}
            required
            fullWidth
            placeholder={tForm("workOrderDescriptionPlaceholder")}
            multiline
            rows={3}
          />
          
          {/* Work Order Type */}
          <TextField
            label={tForm("workOrderType")}
            required
            fullWidth
            placeholder={tForm("workOrderTypePlaceholder")}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            {tForm("save")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
