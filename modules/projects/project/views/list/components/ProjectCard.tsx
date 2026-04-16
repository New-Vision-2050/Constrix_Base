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
import { ProjectRow, PROJECT_STATUS_MAP } from "../columns";

interface ProjectCardProps {
  project: ProjectRow;
  onEdit: () => void;
  onDelete: () => void;
  t: (key: string) => string;
  tProject: (key: string) => string;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  t,
  tProject,
}: ProjectCardProps) {
  const statusCfg =
    project.status !== undefined
      ? PROJECT_STATUS_MAP[project.status]
      : undefined;

  const emptyCell = tProject("emptyCell");

  const fields = [
    {
      labelKey: "columnRefNumber",
      value:
        project.serial_number ??
        project.ref_number ??
        project.id ??
        emptyCell,
    },
    {
      labelKey: "columnClientName",
      value: project.project_owner_name ?? emptyCell,
    },
    {
      labelKey: "columnResponsibleEngineer",
      value: project.responsible_employee_name ?? emptyCell,
    },
    { labelKey: "management", value: project.management_name ?? emptyCell },
    { labelKey: "columnProjectStart", value: project.start_date ?? emptyCell },
    { labelKey: "columnProjectEnd", value: project.end_date ?? emptyCell },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
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
        {fields.map(({ labelKey, value }) => (
          <Box key={labelKey}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {tProject(labelKey)}
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
            label={tProject(statusCfg.labelKey)}
            size="small"
            sx={{
              backgroundColor: statusCfg.bg,
              color: "common.white",
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
                bgcolor: "action.hover",
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
