"use client";

import { Box, Typography } from "@mui/material";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectStamp } from "@/modules/projects/project/query/useProjectStamp";

export default function ProjectStampPreviewMode() {
  const { projectId } = useProject();
  const { data, isPending, isError } = useProjectStamp(projectId);
  const stampUrl = data?.url ?? null;

  if (isPending) {
    return (
      <Typography variant="body2" color="text.secondary">
        جاري التحميل...
      </Typography>
    );
  }

  if (isError) {
    return (
      <Typography variant="body2" color="error">
        تعذر تحميل ختم المشروع
      </Typography>
    );
  }

  if (!stampUrl) {
    return (
      <Typography variant="body2" color="text.secondary">
        لم يتم إضافة ختم للمشروع بعد
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1.5,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        ختم المشروع الحالي
      </Typography>
      <Box
        sx={{
          position: "relative",
          width: 220,
          height: 220,
          borderRadius: 2,
          border: "1px dashed",
          borderColor: "divider",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          p: 2,
        }}
      >
        <Box
          component="img"
          src={stampUrl}
          alt="ختم المشروع"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
    </Box>
  );
}
