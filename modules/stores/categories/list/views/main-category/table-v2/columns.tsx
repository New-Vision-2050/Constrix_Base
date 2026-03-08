import Image from "next/image";
import { Box, Stack, Typography } from "@mui/material";
import TheStatus from "../../../../component/the-status";
import { CategoryRow } from "./types";

/**
 * Creates column definitions for the Main Categories table
 * Handles image display, priority, and status with MUI components
 */
export const createColumns = (t: (key: string) => string) => {
  return [
    {
      key: "name",
      name: t("table.category"),
      sortable: true,
      render: (row: CategoryRow) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Stack
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "#f3f4f6",
              borderRadius: 1,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {row.file?.url ? (
              <Image
                src={row.file.url}
                alt={row.name}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                {t("table.image")}
              </Typography>
            )}
          </Stack>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      key: "priority",
      name: t("table.priority"),
      sortable: true,
      render: (row: CategoryRow) => (
        <Typography variant="body2">{row.priority}</Typography>
      ),
    },
    {
      key: "is_active",
      name: t("table.status"),
      sortable: true,
      render: (row: CategoryRow) => (
        <TheStatus theStatus={row.is_active} id={row.id} />
      ),
    },
  ];
};
