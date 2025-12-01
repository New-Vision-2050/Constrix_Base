"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Box, Typography, Paper } from "@mui/material";
import { OurServicesFormData } from "../schemas/our-services-form.schema";
import FormTextField from "./shared/FormTextField";

interface MainSectionProps {
  control: Control<OurServicesFormData>;
  isSubmitting: boolean;
}

/**
 * Main section component for our services form
 * Contains title and description fields
 * Supports RTL/LTR and theme modes
 */
export default function MainSection({
  control,
  isSubmitting,
}: MainSectionProps) {
  const t = useTranslations("content-management-system.services");
  const tForm = useTranslations("content-management-system.services.form");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
      }}
    >
      {/* Section Title */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        {t("mainSection")}
      </Typography>

      {/* Main Title Field */}
      <Box sx={{ mb: 3 }}>
        <FormTextField
          control={control}
          name="mainTitle"
          label={tForm("mainTitle")}
          placeholder={tForm("mainTitlePlaceholder")}
          disabled={isSubmitting}
          required
        />
      </Box>

      {/* Main Description Field */}
      <Box>
        <FormTextField
          control={control}
          name="mainDescription"
          label={tForm("mainDescription")}
          placeholder={tForm("mainDescriptionPlaceholder")}
          disabled={isSubmitting}
          required
          multiline
          rows={4}
        />
      </Box>
    </Paper>
  );
}
