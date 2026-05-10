"use client";

import React, { useEffect, useState } from "react";
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
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReportFormsApi } from "@/services/api/projects/report-forms";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";

const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";

export interface AddReportFormDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
  projectTypeId: number;
  onSuccess?: () => void;
}

export default function AddReportFormDialog({
  open,
  setOpenModal,
  projectTypeId,
  onSuccess,
}: AddReportFormDialogProps) {
  const t = useTranslations("projectSettings.reportForms");
  const tForm = useTranslations("projectSettings.reportForms.form");

  const [projectSharingWorkOrderId, setProjectSharingWorkOrderId] =
    useState("");
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [value, setValue] = useState("");
  const [numberOfAttachments, setNumberOfAttachments] = useState("");
  const [notes, setNotes] = useState("");

  const { data: workOrders = [], isLoading: workOrdersLoading } = useQuery({
    queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled: open && Number.isFinite(projectTypeId) && projectTypeId > 0,
  });

  useEffect(() => {
    if (!open) {
      setProjectSharingWorkOrderId("");
      setName("");
      setQuestion("");
      setValue("");
      setNumberOfAttachments("");
      setNotes("");
    }
  }, [open]);

  const handleClose = () => {
    setOpenModal(false);
  };

  const createMutation = useMutation({
    mutationFn: () =>
      ReportFormsApi.create({
        project_type_id: projectTypeId,
        project_sharing_work_order_id: Number(projectSharingWorkOrderId),
        name: name.trim(),
        question: question.trim(),
        value: value.trim(),
        number_of_attachments: numberOfAttachments.trim(),
        notes: notes.trim() ? notes.trim() : null,
      }),
    onSuccess: () => {
      toast.success(tForm("createSuccess"));
      onSuccess?.();
      handleClose();
    },
    onError: () => {
      toast.error(tForm("createError"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !projectSharingWorkOrderId ||
      !name.trim() ||
      !question.trim() ||
      !value.trim() ||
      numberOfAttachments.trim() === ""
    ) {
      toast.error(tForm("validationError"));
      return;
    }
    createMutation.mutate();
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

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label={tForm("formName")}
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={tForm("formNamePlaceholder")}
          />

          <FormControl fullWidth required disabled={workOrdersLoading}>
            <InputLabel>{tForm("workOrderType")}</InputLabel>
            <Select
              label={tForm("workOrderType")}
              value={projectSharingWorkOrderId}
              onChange={(e) => setProjectSharingWorkOrderId(e.target.value)}
            >
              <MenuItem value="">
                <em>{tForm("workOrderTypePlaceholder")}</em>
              </MenuItem>
              {workOrders.map((wo) => (
                <MenuItem key={wo.id} value={String(wo.id)}>
                  {wo.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={tForm("theQuestion")}
            required
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={tForm("theQuestionPlaceholder")}
          />

          <TextField
            label={tForm("value")}
            required
            fullWidth
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={tForm("valuePlaceholder")}
          />

          <TextField
            label={tForm("numberOfAttachments")}
            required
            fullWidth
            value={numberOfAttachments}
            onChange={(e) => setNumberOfAttachments(e.target.value)}
            placeholder={tForm("numberOfAttachmentsPlaceholder")}
          />

          <TextField
            label={tForm("notes")}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={tForm("notesPlaceholder")}
            multiline
            rows={3}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={
              createMutation.isPending ||
              !projectTypeId ||
              workOrdersLoading ||
              workOrders.length === 0
            }
          >
            {createMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              tForm("save")
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
