"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveButton from "@/components/shared/buttons/save";
import CancelButton from "@/components/shared/buttons/cancel";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import IconPicker from "@/components/shared/icon-picker";
import { useTranslations } from "next-intl";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";

interface EditSubProjectTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  parentId: number;
  projectType: PRJ_ProjectType | null;
}

export default function EditSubProjectTypeDialog({
  open,
  onClose,
  onSuccess,
  parentId,
  projectType,
}: EditSubProjectTypeDialogProps) {
  const t = useTranslations("Projects.Settings.projectTypes.editSubProjectType");
  const queryClient = useQueryClient();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("nameRequired")),
        icon_id: z.string().min(1, t("iconRequired")),
      }),
    [t],
  );

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", icon_id: "" },
  });

  useEffect(() => {
    if (open && projectType) {
      reset({
        name: projectType.name,
        icon_id: projectType.icon,
      });
    }
  }, [open, projectType, reset]);

  const updateCacheWithFormData = (data: FormData) => {
    if (!projectType) return;
    const optimisticItem: PRJ_ProjectType = {
      ...projectType,
      name: data.name,
      icon: data.icon_id,
    };
    queryClient.setQueryData<PRJ_ProjectType[]>(
      ["third-level-project-types", parentId],
      (prev) =>
        prev
          ? prev.map((item) =>
              item.id === projectType.id ? optimisticItem : item,
            )
          : prev,
    );
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!projectType) return;
    try {
      const response = await ProjectTypesApi.updateThirdLevelProjectType(
        projectType.id,
        {
          name: data.name,
          icon: data.icon_id,
          is_have_schema: true,
          is_active: true,
        },
      );

      const updatedItem = response.data.payload as PRJ_ProjectType | undefined;
      if (updatedItem) {
        queryClient.setQueryData<PRJ_ProjectType[]>(
          ["third-level-project-types", parentId],
          (prev) =>
            prev
              ? prev.map((item) =>
                  item.id === projectType.id ? updatedItem : item,
                )
              : prev,
        );
      } else {
        updateCacheWithFormData(data);
      }

      toast.success(t("successMessage"));
      reset();
      onClose();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? t("errorMessage"));
      updateCacheWithFormData(data);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  if (!projectType) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 6,
        }}
      >
        {t("title")}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            {...register("name")}
            label={t("nameLabel")}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isSubmitting}
            fullWidth
          />

          <IconPicker
            value={watch("icon_id")}
            onChange={(id) => setValue("icon_id", id, { shouldValidate: true })}
            disabled={isSubmitting}
            error={errors.icon_id?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <CancelButton onClick={handleClose} disabled={isSubmitting} />
          <SaveButton
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
