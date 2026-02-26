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

const mockReportForms = [
  {
    id: "rf1",
    referenceNumber: "REF-001",
    formName: "نموذج التقرير الأول",
    workOrderType: "نوع أمر العمل 1",
    notes: "ملاحظات أولى",
  },
  {
    id: "rf2",
    referenceNumber: "REF-002",
    formName: "نموذج التقرير الثاني",
    workOrderType: "نوع أمر العمل 2",
    notes: "ملاحظات ثانية",
  },
  {
    id: "rf3",
    referenceNumber: "REF-003",
    formName: "نموذج التقرير الثالث",
    workOrderType: "نوع أمر العمل 3",
    notes: "ملاحظات ثالثة",
  },
];

const ReportFormDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
}: DetailsDialogProps) => {
  const tDetails = useTranslations("projectSettings.reportForms.details");
  const handleClose = () => setOpenModal(false);

  const reportForm = mockReportForms.find((rf) => rf.id === rowId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
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
        {reportForm && (
          <Box className="flex flex-col gap-4">
            <Typography variant="body1">
              <strong>{tDetails("referenceNumber")}:</strong>{" "}
              {reportForm.referenceNumber}
            </Typography>
            <Typography variant="body1">
              <strong>{tDetails("formName")}:</strong> {reportForm.formName}
            </Typography>
            <Typography variant="body1">
              <strong>{tDetails("workOrderType")}:</strong>{" "}
              {reportForm.workOrderType}
            </Typography>
            <Typography variant="body1">
              <strong>{tDetails("notes")}:</strong> {reportForm.notes}
            </Typography>
          </Box>
        )}
        {!reportForm && (
          <Typography textAlign="center" color="error">
            {tDetails("notFound")}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportFormDetailsDialog;
