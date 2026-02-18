"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { CompanyDashboardIconsApi } from "@/services/api/company-dashboard/icons";
import { CURRENT_TABS } from "../../../constants/current-tabs";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";

const addProjectTypeSchema = z.object({
  name: z.string().min(1, "اسم التصنيف مطلوب"),
  icon_id: z.string().min(1, "اختيار الأيقونة مطلوب"),
  reference_project_type_id: z.string().nullable(),
  selected_tab_values: z.array(z.string()).nullable(),
});

type AddProjectTypeFormData = z.infer<typeof addProjectTypeSchema>;

interface AddProjectTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  parentId: number;
}

export default function AddProjectTypeDialog({
  open,
  onClose,
  onSuccess,
  parentId,
}: AddProjectTypeDialogProps) {
  const queryClient = useQueryClient();
  const { data: rootsData } = useQuery({
    queryKey: ["project-types", "roots"],
    queryFn: async () => {
      const response = await ProjectTypesApi.getRoots();
      return response.data.payload ?? [];
    },
    enabled: open,
  });

  const { data: iconsData } = useQuery({
    queryKey: ["icons-list", "add-project-type"],
    queryFn: async () => {
      const response = await CompanyDashboardIconsApi.list({
        page: 1,
        limit: 100,
      });
      return response.data?.payload ?? [];
    },
    enabled: open,
  });

  const roots: PRJ_ProjectType[] = rootsData ?? [];
  const icons = Array.isArray(iconsData) ? iconsData : [];

  const form = useForm<AddProjectTypeFormData>({
    resolver: zodResolver(addProjectTypeSchema),
    defaultValues: {
      name: "",
      icon_id: "",
      reference_project_type_id: null,
      selected_tab_values: null,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const selectedTabValues = watch("selected_tab_values");
  const referenceProjectTypeId = watch("reference_project_type_id");
  const isCheckboxesEnabled = !!referenceProjectTypeId;

  const handleReferenceChange = (value: string | null) => {
    setValue("reference_project_type_id", value);
    if (!value) {
      setValue("selected_tab_values", null);
    }
  };

  const handleFormSubmit = async (data: AddProjectTypeFormData) => {
    try {
      const selectedIcon = icons.find(
        (icon: { id: string; icon?: string }) =>
          icon.id.toString() === data.icon_id,
      );
      const iconValue = selectedIcon?.icon ?? data.icon_id;

      const schemaIds = (data.selected_tab_values ?? [])
        .map(
          (value) => CURRENT_TABS.find((tab) => tab.value === value)?.schema_id,
        )
        .filter((id): id is number => typeof id === "number");

      await ProjectTypesApi.createSecondLevelProjectType({
        name: data.name,
        icon: iconValue,
        parent_id: parentId,
        reference_project_type_id: data.reference_project_type_id
          ? Number(data.reference_project_type_id)
          : null,
        schema_ids: schemaIds,
        is_active: true,
      });

      queryClient.invalidateQueries({ queryKey: ["project-types"] });
      toast.success("تم اضافة نوع المشروع بنجاح");
      reset();
      onClose();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "فشل في اضافة نوع المشروع");
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  const toggleTabValue = (value: string) => {
    if (!isCheckboxesEnabled) return;
    const current = selectedTabValues ?? [];
    if (current.includes(value)) {
      const next = current.filter((v) => v !== value);
      setValue("selected_tab_values", next.length ? next : null);
    } else {
      setValue("selected_tab_values", [...current, value]);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 6,
        }}
      >
        اضافة نوع المشروع
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* أسم التصنيف */}
          <TextField
            {...register("name")}
            label="اسم التصنيف"
            placeholder="اسم التصنيف"
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isSubmitting}
            fullWidth
            size="medium"
          />

          {/* اختيار Icon */}
          <FormControl
            fullWidth
            error={!!errors.icon_id}
            disabled={isSubmitting}
          >
            <InputLabel id="icon-select-label">اختيار Icon</InputLabel>
            <Select
              labelId="icon-select-label"
              label="اختيار Icon"
              value={watch("icon_id")}
              onChange={(e) => setValue("icon_id", e.target.value)}
            >
              <MenuItem value="">
                <em>اختيار Icon</em>
              </MenuItem>
              {icons.map(
                (icon: { id: string; name_ar?: string; name?: string }) => (
                  <MenuItem key={icon.id} value={icon.id.toString()}>
                    {icon.name_ar ?? icon.name ?? icon.id}
                  </MenuItem>
                ),
              )}
            </Select>
            {errors.icon_id && (
              <FormHelperText>{errors.icon_id.message}</FormHelperText>
            )}
          </FormControl>

          {/* مرجعية المشروع */}
          <FormControl
            fullWidth
            error={!!errors.reference_project_type_id}
            disabled={isSubmitting}
          >
            <InputLabel id="reference-select-label">مرجعية المشروع</InputLabel>
            <Select
              labelId="reference-select-label"
              label="مرجعية المشروع"
              value={watch("reference_project_type_id") ?? ""}
              onChange={(e) =>
                handleReferenceChange(
                  e.target.value ? String(e.target.value) : null,
                )
              }
            >
              <MenuItem value="">
                <em>مرجعية المشروع</em>
              </MenuItem>
              {roots.map((root) => (
                <MenuItem key={root.id} value={root.id.toString()}>
                  {root.name}
                </MenuItem>
              ))}
            </Select>
            {errors.reference_project_type_id && (
              <FormHelperText>
                {errors.reference_project_type_id.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* تحديد عناصر المشروع - CURRENT_TABS as checkboxes */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              تحديد عناصر المشروع
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, pt: 1 }}>
              {CURRENT_TABS.map((tab) => (
                <FormControlLabel
                  key={tab.value}
                  disabled={isSubmitting || !isCheckboxesEnabled}
                  control={
                    <Checkbox
                      checked={(selectedTabValues ?? []).includes(tab.value)}
                      onChange={() => toggleTabValue(tab.value)}
                      disabled={isSubmitting || !isCheckboxesEnabled}
                    />
                  }
                  label={tab.name}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            الغاء
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
            )}
            حفظ
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
