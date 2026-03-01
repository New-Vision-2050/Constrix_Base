import {
  Box,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  MenuItem,
} from "@mui/material";
import { EditIcon, Trash2, MoreVertical } from "lucide-react";
import CustomMenu from "@/components/headless/custom-menu";
import { ProjectRow, STATUS_MAP } from "../columns";

interface ProjectCardProps {
  project: ProjectRow;
  onEdit: () => void;
  onDelete: () => void;
  t: (key: string) => string;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  t,
}: ProjectCardProps) {
  const statusCfg =
    project.status !== undefined ? STATUS_MAP[project.status] : undefined;

  const fields = [
    { label: "الرقم المرجعي", value: project.ref_number ?? project.id },
    { label: "اسم العميل", value: project.client_name ?? "—" },
    {
      label: "المهندس المسؤول",
      value: project.project_owner_name ?? "—",
    },
    { label: "الادارة", value: project.management_name ?? "—" },
    { label: "بداية المشروع", value: project.start_date ?? "—" },
    { label: "نهاية المشروع", value: project.end_date ?? "—" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {project.name}
        </Typography>
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Box
              component="button"
              onClick={onClick}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "text.secondary",
                p: 0.5,
                borderRadius: 1,
                display: "flex",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <MoreVertical size={18} />
            </Box>
          )}
        >
          <MenuItem onClick={onEdit}>
            <EditIcon className="w-4 h-4 ml-2" />
            {t("labels.edit")}
          </MenuItem>
          <MenuItem onClick={onDelete}>
            <Trash2 className="w-4 h-4 ml-2" />
            {t("labels.delete")}
          </MenuItem>
        </CustomMenu>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        {fields.map(({ label, value }) => (
          <Box key={label}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {label}
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {String(value)}
            </Typography>
          </Box>
        ))}
      </Box>

      {statusCfg && (
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            label={statusCfg.label}
            size="small"
            sx={{
              backgroundColor: statusCfg.bg,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.7rem",
            }}
          />
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(project.completion_percentage ?? 0, 100)}
              sx={{
                height: 5,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: statusCfg.bg,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
          <Typography variant="caption">
            {project.completion_percentage ?? 0}%
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
