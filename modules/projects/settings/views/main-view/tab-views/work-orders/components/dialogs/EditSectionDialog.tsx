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

// Types
export interface SectionFormData {
  sectionCode: string;
  sectionDescription: string;
}

export interface SectionDialogProps {
  open: boolean;
  onClose: () => void;
  sectionId?: string;
}


export default function EditSectionDialog({
  open,
  onClose,
}: SectionDialogProps) {
  const t = useTranslations("projectSettings.section");
  const tForm = useTranslations("projectSettings.section.form");

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          color: "white",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
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
          {t("editSection")}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* Section Code and Description */}
          <TextField
            label={tForm("sectionCode")}
            required
            fullWidth
            placeholder={tForm("sectionCodePlaceholder")}
          />

          <TextField
            label={tForm("sectionDescription")}
            required
            fullWidth
            placeholder={tForm("sectionDescriptionPlaceholder")}
            multiline
            rows={3}
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
