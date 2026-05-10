"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectSharingDepartmentApi } from "@/services/api/projects/project-sharing-department";
import { RhfTextField } from "../../shared/rhf-mui";
import {
  createSectionFormSchema,
  type SectionFormValues,
} from "../../shared/form-schemas";

export interface AddSectionDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
  projectTypeId: number;
  onSuccess?: () => void;
}

const defaultValues: SectionFormValues = {
  code: "",
  description: "",
};

export default function AddSectionDialog({
  open,
  setOpenModal,
  projectTypeId,
  onSuccess,
}: AddSectionDialogProps) {
  const t = useTranslations("projectSettings.section");
  const tForm = useTranslations("projectSettings.section.form");

  const schema = useMemo(() => createSectionFormSchema(tForm), [tForm]);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const handleClose = () => {
    reset(defaultValues);
    setOpenModal(false);
  };

  const createMutation = useMutation({
    mutationFn: (values: SectionFormValues) =>
      ProjectSharingDepartmentApi.create({
        project_type_id: projectTypeId,
        code: values.code,
        description: values.description,
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

  const onSubmit = (values: SectionFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          color: "text.primary",
          borderRadius: "8px",
          border: 1,
          borderColor: "divider",
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
          {t("addSection")}
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
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <RhfTextField
            name="code"
            control={control}
            label={tForm("sectionCode")}
            
            fullWidth
            placeholder={tForm("sectionCodePlaceholder")}
          />

          <RhfTextField
            name="description"
            control={control}
            label={tForm("sectionDescription")}
            
            fullWidth
            placeholder={tForm("sectionDescriptionPlaceholder")}
            multiline
            rows={3}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={createMutation.isPending || !projectTypeId}
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
