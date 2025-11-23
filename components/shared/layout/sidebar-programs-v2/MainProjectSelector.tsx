"use client";

import { Project } from "@/types/sidebar-menu";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import CustomMenu from "@/components/headless/custom-menu";
import {
  MenuItem,
  ListItemText,
  Box,
  Button,
  ButtonBase,
  Typography,
} from "@mui/material";
import { ChevronDown, Check } from "lucide-react";
import { memo } from "react";
import Link from "next/link";

type MainProjectSelectorProps = {
  projects: Project[];
  activeProject: Project;
  onProjectChange: (project: Project) => void;
  onSubEntityClick: (url: string) => void;
};

export const MainProjectSelector = memo(function MainProjectSelector({
  projects,
  activeProject,
  onProjectChange,
  onSubEntityClick,
}: MainProjectSelectorProps) {
  const t = useTranslations();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  // Handle project selection from dropdown
  const handleProjectSelect = (project: Project) => {
    onProjectChange(project);

    // Update active URL state
    const firstSubEntity = project?.sub_entities?.[0];
    if (firstSubEntity?.url) {
      onSubEntityClick(firstSubEntity.url);
    }
  };

  return (
    <div className="w-full px-2">
      <label
        className={cn(
          "block mb-2 text-sm font-medium",
          isDarkMode ? "text-gray-300" : "text-gray-700"
        )}
      >
        {t("Sidebar.mainPrograms")}
      </label>

      <CustomMenu
        renderAnchor={({ onClick, open }) => (
          <ButtonBase
            onClick={onClick}
            className="flex items-center justify-between w-full p-2"
          >
            <Typography variant="h6" fontWeight={600}>
              {activeProject?.name}
            </Typography>
            <ChevronDown
              className={cn(
                "w-7 h-7 transition-transform",
                open ? "rotate-180" : ""
              )}
            />
          </ButtonBase>
        )}
        menuProps={{
          PaperProps: {
            sx: {
              maxHeight: 400,
              width: "auto",
              minWidth: 250,
              mt: 1,
            },
          },
        }}
      >
        {projects.map((project) => {
          const firstSubEntityUrl = project?.sub_entities?.[0]?.url || "#";

          return (
            <MenuItem
              key={project.name}
              component={Link}
              href={firstSubEntityUrl}
              onClick={() => handleProjectSelect(project)}
              selected={activeProject?.name === project.name}
              sx={{
                py: 1.5,
                px: 2,
                "&.Mui-selected": {
                  backgroundColor: isDarkMode ? "#2D174D" : "#f3f4f6",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#3D2460" : "#e5e7eb",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <ListItemText
                  primary={project.name}
                  primaryTypographyProps={{
                    fontSize: "16px",
                    fontWeight:
                      activeProject?.name === project.name ? 600 : 400,
                  }}
                />
                {activeProject?.name === project.name && (
                  <Check className="w-5 h-5 text-purple-500" />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </CustomMenu>
    </div>
  );
});
