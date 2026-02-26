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

export interface WorkOrderDialogProps {
  open: boolean;
  onClose: () => void;
  workOrderId?: string;
}

export default function EditWorkOrderDialog({
  open,
  onClose,
  workOrderId,
}: WorkOrderDialogProps) {
  const t = useTranslations("projectSettings.workOrders");
  const tForm = useTranslations("projectSettings.workOrders.form");
  const isEditMode = !!workOrderId;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          color: "white",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          bgcolor: "background.paper",
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <DialogTitle sx={{ p: 0, mb: 3, textAlign: "center", fontSize: "1.125rem", fontWeight: 600 }}>
          {isEditMode ? t("editWorkOrder") : t("addWorkOrder")}
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Consultant Code, Work Order Description, and Work Order Type - 3 Column Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <TextField
              label={tForm("consultantCode")}
              required
              fullWidth
              placeholder={tForm("consultantCodePlaceholder")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />
            
            <TextField
              label={tForm("workOrderDescription")}
              required
              fullWidth
              placeholder={tForm("workOrderDescriptionPlaceholder")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />
            
            <TextField
              label={tForm("workOrderType")}
              required
              fullWidth
              placeholder={tForm("workOrderTypePlaceholder")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />
          </Box>

          {/* Task and Procedure Dropdowns - 2 Column Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>{tForm("addTask")}</InputLabel>
              <Select
                label={tForm("addTask")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.23)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "primary.main",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                }}
              >
                <MenuItem value="">Select a task</MenuItem>
                <MenuItem value="task1">Task 1</MenuItem>
                <MenuItem value="task2">Task 2</MenuItem>
                <MenuItem value="task3">Task 3</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>{tForm("addProcedure")}</InputLabel>
              <Select
                label={tForm("addProcedure")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.23)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "primary.main",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                }}
              >
                <MenuItem value="">Select a procedure</MenuItem>
                <MenuItem value="proc1">Procedure 1</MenuItem>
                <MenuItem value="proc2">Procedure 2</MenuItem>
                <MenuItem value="proc3">Procedure 3</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
