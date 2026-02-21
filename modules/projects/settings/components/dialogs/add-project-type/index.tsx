"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
import LinearProgress from "@mui/material/LinearProgress";
import SaveButton from "@/components/shared/buttons/save";
import CancelButton from "@/components/shared/buttons/cancel";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import IconPicker from "@/components/shared/icon-picker";
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
  const { data: secondLevelData } = useQuery({
    queryKey: ["project-types", "children", parentId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getDirectChildren(parentId);
      return response.data.payload ?? [];
    },
    enabled: open,
  });

  const secondLevelItems: PRJ_ProjectType[] = secondLevelData ?? [];

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

  const { data: referenceSchemasData, isLoading: isSchemasLoading } = useQuery({
    queryKey: ["project-types", "schemas", referenceProjectTypeId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getProjectTypeSchemas(
        referenceProjectTypeId!,
      );
      return response.data.payload ?? [];
    },
    enabled: !!referenceProjectTypeId,
    gcTime: 0,
    staleTime: 0,
  });

  const referenceSchemas = useMemo(() => referenceSchemasData ?? [], [referenceSchemasData]);

  const visibleTabs = useMemo(
    () =>
      referenceSchemas.length === 0
        ? CURRENT_TABS
        : CURRENT_TABS.filter((tab) =>
            referenceSchemas.some((schema) => schema.id === tab.schema_id),
          ),
    [referenceSchemas],
  );

  const handleReferenceChange = (value: string | null) => {
    setValue("reference_project_type_id", value);
    setValue("selected_tab_values", null);
  };

  const handleFormSubmit = async (data: AddProjectTypeFormData) => {
    try {
      const iconValue = data.icon_id;

      // Map selected tab values to schema IDs
      const schemaIds =
        data.selected_tab_values && data.selected_tab_values.length > 0
          ? data.selected_tab_values
              .map(
                (value) =>
                  CURRENT_TABS.find((tab) => tab.value === value)?.schema_id,
              )
              .filter((id): id is number => typeof id === "number")
          : [];

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
          <IconPicker
            value={watch("icon_id")}
            onChange={(id) => setValue("icon_id", id, { shouldValidate: true })}
            disabled={isSubmitting}
            error={errors.icon_id?.message}
          />

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
              {secondLevelItems.map((item) => (
                <MenuItem key={item.id} value={item.id.toString()}>
                  {item.name}
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
          {isCheckboxesEnabled && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                تحديد عناصر المشروع
              </Typography>
              {isSchemasLoading ? (
                <LinearProgress sx={{ mt: 1 }} />
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, pt: 1 }}>
                  {visibleTabs.map((tab) => (
                    <FormControlLabel
                      key={tab.value}
                      disabled={isSubmitting}
                      control={
                        <Checkbox
                          checked={(selectedTabValues ?? []).includes(tab.value)}
                          onChange={() => toggleTabValue(tab.value)}
                          disabled={isSubmitting}
                        />
                      }
                      label={tab.name}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <CancelButton onClick={handleClose} disabled={isSubmitting} />
          <SaveButton type="submit" disabled={isSubmitting} loading={isSubmitting} />
        </DialogActions>
      </form>
    </Dialog>
  );
}
