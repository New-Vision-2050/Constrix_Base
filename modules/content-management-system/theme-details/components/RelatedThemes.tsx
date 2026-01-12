"use client";

import { Box, Typography, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { ThemeData } from "../../themes/types";
import { useQuery } from "@tanstack/react-query";
import { ThemesApi } from "@/services/api/company-dashboard/themes";
import { useMemo } from "react";
import { ThemeCard } from "../../themes/components/ThemesGrid";
import { useRouter } from "@i18n/navigation";

interface RelatedThemesProps {
  currentThemeId: string;
}

/**
 * Related themes section
 * - Shows 3 related theme cards
 * - RTL/LTR support
 * - Cached API call
 */
export default function RelatedThemes({ currentThemeId }: RelatedThemesProps) {
  const t = useTranslations("content-management-system.themes");
  const router = useRouter();
  // Fetch themes excluding current one
  const { data: themesData } = useQuery({
    queryKey: ["related-themes", currentThemeId],
    queryFn: () => ThemesApi.list({ limit: 4 }),
    staleTime: 5 * 60 * 1000,
  });

  const relatedThemes = useMemo(
    () =>
      themesData?.data?.payload
        ?.filter((t: ThemeData) => t.id !== currentThemeId)
        .slice(0, 3) || [],
    [themesData, currentThemeId]
  );

  if (relatedThemes.length === 0) return null;

  return (
    <Box sx={{ mt: 6, p: 4 }} className="bg-sidebar rounded-lg">
      <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
        {t("relatedThemes")}
      </Typography>
      <Grid container spacing={3}>
        {relatedThemes.map((theme: ThemeData) => (
          <Grid key={theme.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ThemeCard
              id={theme.id}
              src={theme.main_image}
              title={theme.title}
              description={theme.description}
              onClick={() => {
                router.push(`/content-management-system/themes/${theme.id}`);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
