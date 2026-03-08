import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
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
  const tDetails = useTranslations("projectSettings.section.details");
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
  const section = mockSections.find((s) => s.id === rowId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"lg"}
      PaperProps={{
        sx: {
          borderRadius: "8px",
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
          <Box className="flex justify-between gap-4">
            <Typography variant="body1">
              <strong>{tDetails("sectionCode")}:</strong> {section.sectionCode}
            </Typography>

            <Typography variant="body1">
              <strong>{tDetails("sectionDescription")}:</strong>{" "}
              {section.sectionDescription}
            </Typography>
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
