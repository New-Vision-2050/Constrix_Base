"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import { toast } from "sonner";
import { z } from "zod";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Types
export interface SectionFormData {
  sectionCode: string;
  sectionDescription: string;
}

export interface SectionDialogProps {
  open: boolean;
  onClose: () => void;
  sectionId?: string;
}

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

// Form schema
const createSectionFormSchema = (t: any) => {
  return z.object({
    sectionCode: z
      .string()
      .min(1, t("sectionCodeRequired"))
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        t("sectionCodeRequired"),
      ),
    sectionDescription: z.string().min(1, t("sectionDescriptionRequired")),
  });
};

const getDefaultSectionFormValues = (): SectionFormData => ({
  sectionCode: "",
  sectionDescription: "",
});

export default function EditSectionDialog({
  open,
  onClose,
  sectionId,
}: SectionDialogProps) {
  const t = useTranslations("projectSettings.section");
  const tForm = useTranslations("projectSettings.section.form");
  const isEditMode = !!sectionId;

  // Mock fetch section data when editing (replace with actual API call)
  const { data: sectionData, isLoading: isFetching } = useQuery({
    queryKey: ["section", sectionId],
    queryFn: async () => {
      if (!sectionId) return null;

      // Find section from mock data
      const section = mockSections.find((s) => s.id === sectionId);

      return {
        payload: section || {
          sectionCode: 0,
          sectionDescription: "",
        },
      };
    },
    enabled: isEditMode && open && !!sectionId,
  });

  const form = useForm({
    resolver: zodResolver(createSectionFormSchema(tForm)),
    defaultValues: getDefaultSectionFormValues(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = form;

  // Show toast for validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(tForm("validationError"));
      }
    }
  }, [errors]);

  // Reset form to default values when opening Add dialog
  useEffect(() => {
    if (open && !isEditMode) {
      reset(getDefaultSectionFormValues());
    }
  }, [open, isEditMode, reset]);

  // Populate form with section data when editing
  useEffect(() => {
    if (isEditMode && sectionData?.payload) {
      const section = sectionData.payload;
      reset({
        sectionCode: section.sectionCode?.toString() || "",
        sectionDescription: section.sectionDescription || "",
      });
    }
  }, [isEditMode, sectionData, open, reset]);

  const onSubmit = async (data: SectionFormData) => {
    try {
      // Convert string numbers to actual numbers for API
      const apiData = {
        ...data,
        sectionCode: parseInt(data.sectionCode) || 0,
      };

      // Replace with actual API calls
      if (isEditMode && sectionId) {
        // await SectionApi.update(sectionId, apiData);
        console.log("Updating section:", apiData);
      } else {
        // await SectionApi.create(apiData);
        console.log("Creating section:", apiData);
      }

      toast.success(
        isEditMode ? tForm("updateSuccess") : tForm("createSuccess"),
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} section:`,
        error,
      );
      toast.error(isEditMode ? tForm("updateError") : tForm("createError"));
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          {t("editSection")}
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

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* Section Code and Description */}
          <TextField
            label={tForm("sectionCode")}
            required
            fullWidth
            disabled={isSubmitting || isFetching}
            placeholder={tForm("sectionCodePlaceholder")}
            error={!!errors.sectionCode}
            helperText={errors.sectionCode?.message}
            {...register("sectionCode")}
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
            label={tForm("sectionDescription")}
            required
            fullWidth
            disabled={isSubmitting || isFetching}
            placeholder={tForm("sectionDescriptionPlaceholder")}
            error={!!errors.sectionDescription}
            helperText={errors.sectionDescription?.message}
            {...register("sectionDescription")}
            multiline
            rows={3}
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

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isFetching}
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            startIcon={isSubmitting || isFetching ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {tForm("save")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
