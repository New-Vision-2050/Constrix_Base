"use client";

import { Typography, Rating, Stack } from "@mui/material";
import ThemeImageSection from "./ThemeImageSection";
import { useTranslations } from "next-intl";

interface ThemeHeaderProps {
  title: string;
  isDefault: boolean;
  description: string;
  rating: number;
  mainImageUrl: string;
  mainImageAlt: string;
}

/**
 * Theme header component with title and rating
 * - RTL/LTR support via MUI
 * - Light/Dark mode styling
 */
export default function ThemeHeader({
  title,
  isDefault,
  description,
  rating = 5.0,
  mainImageUrl,
  mainImageAlt,
}: ThemeHeaderProps) {
  const t = useTranslations("content-management-system.themes");
  return (
    <Stack spacing={2} sx={{ mb: 4, p: 4 }} className="bg-sidebar rounded-lg">
      {/* title & isDefault */}
      <Stack
        width={"100%"}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isDefault ? t("default") : t("notDefault")}
        </Typography>
      </Stack>
      {/* description */}
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Rating
          value={rating}
          precision={0.1}
          readOnly
          size="small"
          sx={{ color: "primary.main" }}
        />
        <Typography variant="body2" color="text.secondary">
          {rating.toFixed(1)}
        </Typography>
      </Stack>
      {/* Main image */}
      <ThemeImageSection imageUrl={mainImageUrl} alt={mainImageAlt} />
    </Stack>
  );
}
