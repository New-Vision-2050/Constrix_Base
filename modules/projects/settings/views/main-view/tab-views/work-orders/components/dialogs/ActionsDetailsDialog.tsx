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

const mockActions = [
  { id: "act1", code: 200, description: "إجراء أول" },
  { id: "act2", code: 201, description: "إجراء ثاني" },
  { id: "act3", code: 202, description: "إجراء ثالث" },
  { id: "act4", code: 203, description: "إجراء رابع" },
];

const ActionsDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
}: DetailsDialogProps) => {
  const tDetails = useTranslations("projectSettings.actions.details");
  const handleClose = () => setOpenModal(false);

  const action = mockActions.find((a) => a.id === rowId);

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
        {action && (
          <Box className="flex justify-between gap-4">
            <Typography variant="body1">
              <strong>{tDetails("actionCode")}:</strong> {action.code}
            </Typography>

            <Typography variant="body1">
              <strong>{tDetails("actionDescription")}:</strong>{" "}
              {action.description}
            </Typography>
          </Box>
        )}
        {!action && (
          <Typography textAlign="center" color="error">
            {tDetails("notFound")}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ActionsDetailsDialog;
