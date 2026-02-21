import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DetailsDialogProps } from "../../types";
import { useTranslations } from "next-intl";

const SectionDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
}: DetailsDialogProps) => {
  const t = useTranslations("section");
  const tDetails = useTranslations("section.details");
  const handleClose = () => setOpenModal(false);

  // Mock section data
  const mockSections = [
    {
      id: "sec1",
      sectionCode: 100,
      sectionDescription: "قسم الكهرباء الرئيسي",
    },
    {
      id: "sec2",
      sectionCode: 101,
      sectionDescription: "قسم الصيانة",
    },
    {
      id: "sec3",
      sectionCode: 102,
      sectionDescription: "قسم التركيب",
    },
    {
      id: "sec4",
      sectionCode: 103,
      sectionDescription: "قسم الفحص والجودة",
    },
  ];

  // Find the section by ID
  const section = mockSections.find(s => s.id === rowId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"sm"}
      PaperProps={{
        sx: {
          color: "white",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          p: 8,
        },
      }}
    >
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

      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.5rem",
          mb: 2,
        }}
      >
        {tDetails("title")}
      </DialogTitle>

      <DialogContent>
        {section && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{tDetails("sectionCode")}:</strong> {section.sectionCode}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{tDetails("sectionDescription")}:</strong> {section.sectionDescription}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        {!section && (
          <Typography textAlign="center" color="error">
            {tDetails("notFound")}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SectionDetailsDialog;
