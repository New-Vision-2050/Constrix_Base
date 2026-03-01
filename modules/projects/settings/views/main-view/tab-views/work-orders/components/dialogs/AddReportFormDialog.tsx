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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface AddReportFormDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
}

export default function AddReportFormDialog({
  open,
  setOpenModal,
}: AddReportFormDialogProps) {
  const t = useTranslations("projectSettings.reportForms");
  const tForm = useTranslations("projectSettings.reportForms.form");

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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Form Name */}
          <TextField
            label={tForm("formName")}
            required
            fullWidth
            placeholder={tForm("formNamePlaceholder")}
          />

          {/* Work Order Type - Select */}
          <FormControl fullWidth>
            <InputLabel>{tForm("workOrderType")}</InputLabel>
            <Select label={tForm("workOrderType")}>
              <MenuItem value="">
                {tForm("workOrderTypePlaceholder")}
              </MenuItem>
              <MenuItem value="type1">نوع أمر العمل 1</MenuItem>
              <MenuItem value="type2">نوع أمر العمل 2</MenuItem>
              <MenuItem value="type3">نوع أمر العمل 3</MenuItem>
            </Select>
          </FormControl>

          {/* The Question */}
          <TextField
            label={tForm("theQuestion")}
            fullWidth
            placeholder={tForm("theQuestionPlaceholder")}
          />

          {/* Value */}
          <TextField
            label={tForm("value")}
            fullWidth
            placeholder={tForm("valuePlaceholder")}
          />

          {/* Add and Remove buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" size="small">
              {tForm("add")}
            </Button>
            <Button variant="outlined" size="small" color="error">
              {tForm("remove")}
            </Button>
          </Box>

          {/* Number of Attachments */}
          <TextField
            label={tForm("numberOfAttachments")}
            fullWidth
            placeholder={tForm("numberOfAttachmentsPlaceholder")}
          />

          {/* Notes */}
          <TextField
            label={tForm("notes")}
            fullWidth
            placeholder={tForm("notesPlaceholder")}
            multiline
            rows={3}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {tForm("save")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
