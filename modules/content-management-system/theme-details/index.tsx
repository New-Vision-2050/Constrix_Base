import { Box, Typography, Paper, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { ThemeData } from "../themes/types";
import ThemeHeader from "./components/ThemeHeader";
import ThemeDepartments from "./components/ThemeDepartments";
import RelatedThemes from "./components/RelatedThemes";

interface PropsT {
  initialData: ThemeData;
}

/**
 * Theme detail view component
 * - Displays full theme information
 * - RTL/LTR support via MUI
 * - Light/Dark mode styling
 * - Responsive layout
 */
export default function ThemeDetailView({ initialData }: PropsT) {
  const t = useTranslations("content-management-system.themes");

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header with title , description , rating , isDefault  and main image */}
      <ThemeHeader
        isDefault={initialData.is_default === 1}
        title={initialData.title}
        description={initialData.description}
        rating={5.0} 
        mainImageUrl={initialData.main_image}
        mainImageAlt={initialData.title}
        />

      {/* About section */}
      <Box sx={{ mb: 4, p: 4 }} className="bg-sidebar rounded-lg">
        <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
          {t("about")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
          {initialData.about}
        </Typography>
      </Box>

      {/* Departments */}
      {initialData.departments && <ThemeDepartments departments={initialData.departments} />}

      {/* Related themes */}
      <RelatedThemes currentThemeId={initialData.id} />
    </Container>
  );
}
