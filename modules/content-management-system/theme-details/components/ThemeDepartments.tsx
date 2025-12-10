import { Box, Typography, Chip, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ThemeDepartment } from "../../themes/types";

interface ThemeDepartmentsProps {
  departments: ThemeDepartment[];
}

/**
 * Theme departments/categories section
 * - Displays department chips
 * - RTL/LTR support via MUI
 * - Responsive layout
 */
export default function ThemeDepartments({ departments }: ThemeDepartmentsProps) {
  const t = useTranslations("content-management-system.themes");

  if (!departments || departments.length === 0) return null;

  return (
    <Box sx={{ mb: 4, p: 4 }} className="bg-sidebar rounded-lg">
      <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
        {t("departments")}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {departments.map((dept) => (
          <Chip
            key={dept.id}
            label={dept.name}
            variant="outlined"
            sx={{ mb: 1, borderRadius: 0.375 }}
          />
        ))}
      </Stack>
    </Box>
  );
}

