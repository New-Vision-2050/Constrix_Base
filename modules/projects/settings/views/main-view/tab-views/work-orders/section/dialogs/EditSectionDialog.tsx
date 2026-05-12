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
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectSharingDepartmentApi } from "@/services/api/projects/project-sharing-department";
import { RhfTextField } from "../../shared/rhf-mui";
import {
  createSectionFormSchema,
  type SectionFormValues,
} from "../../shared/form-schemas";

export interface SectionDialogProps {
  open: boolean;
  onClose: () => void;
  sectionId?: string;
  onSuccess?: () => void;
}

const emptyValues: SectionFormValues = {
  code: "",
  description: "",
};

export default function EditSectionDialog({
  open,
  onClose,
  sectionId,
  onSuccess,
}: SectionDialogProps) {
  const t = useTranslations("projectSettings.section");
  const tForm = useTranslations("projectSettings.section.form");

  const schema = useMemo(() => createSectionFormSchema(tForm), [tForm]);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const { control, handleSubmit, reset } = form;

  const detailQuery = useQuery({
    queryKey: ["project-sharing-department", sectionId],
    queryFn: async () => {
      const res = await ProjectSharingDepartmentApi.show(sectionId!);
      return res.data.payload;
    },
    enabled: open && Boolean(sectionId),
  });

  useEffect(() => {
    const p = detailQuery.data;
    if (!p) return;
    reset({
      code: p.code ?? "",
      description: p.description ?? "",
    });
  }, [detailQuery.data, reset]);

  useEffect(() => {
    if (!open) {
      reset(emptyValues);
    }
  }, [open, reset]);

  const handleClose = () => {
    onClose();
  };

  const updateMutation = useMutation({
    mutationFn: (values: SectionFormValues) =>
      ProjectSharingDepartmentApi.update(sectionId!, {
        code: values.code,
        description: values.description,
      }),
    onSuccess: () => {
      toast.success(tForm("updateSuccess"));
      onSuccess?.();
      handleClose();
    },
    onError: () => {
      toast.error(tForm("updateError"));
    },
  });

  const onSubmit = (values: SectionFormValues) => {
    if (!sectionId) return;
    updateMutation.mutate(values);
  };

  const loading = detailQuery.isLoading && open && Boolean(sectionId);

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
          {t("editSection")}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : detailQuery.isError ? (
          <Typography color="error" textAlign="center">
            {tForm("updateError")}
          </Typography>
        ) : (
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
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                tForm("save")
              )}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
