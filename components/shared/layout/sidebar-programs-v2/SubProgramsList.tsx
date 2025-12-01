"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { tableIcon } from "@/modules/program-settings/users-settings/tableIcon";
import React, { memo } from "react";
import Link from "next/link";
import { Project } from "@/types/sidebar-menu";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  alpha,
} from "@mui/material";

type SubProgramsListProps = {
  activeUrl: string;
  activeProject: Project;
  onSubEntityClick: (url: string) => void;
};

type IconKey = keyof typeof tableIcon;

function isValidIconKey(key: string): key is IconKey {
  return key in tableIcon;
}

export const SubProgramsList = memo(function SubProgramsList({
  activeProject,
  activeUrl,
  onSubEntityClick,
}: SubProgramsListProps) {
  const { open } = useSidebar();
  const t = useTranslations();
  const { palette } = useTheme();

  const visibleSubEntities =
    activeProject?.sub_entities?.filter((item) => item.show) ?? [];

  if (!visibleSubEntities.length) return null;

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Label with animation */}
      <motion.div
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        initial={false}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
      >
        <Box
          sx={{
            display: "block",
            mb: 1.5,
            px: 1,
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "text.secondary",
          }}
        >
          {t("Sidebar.subPrograms")}
        </Box>
      </motion.div>

      {/* Sub Programs Menu List */}
      <List sx={{ py: 0 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {visibleSubEntities.map((sub, index) => {
            const subUrl = sub.url || `/${activeProject?.slug}/${sub.slug}`;
            const isActive = subUrl === activeUrl;

            return (
              <motion.div
                key={sub.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <ListItemButton
                  component={Link}
                  href={subUrl}
                  onClick={() => onSubEntityClick(subUrl)}
                  selected={isActive}
                  sx={{
                    position: "relative",
                    borderRadius: 1.5,
                    mb: 0.5,
                    mx: 0.5,
                    transition: "all 0.2s ease-in-out",
                    overflow: "hidden",
                    "&.Mui-selected": {
                      backgroundColor: alpha(palette.primary.main, 0.1),
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: alpha(palette.primary.main, 0.2),
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        backgroundColor: "primary.main",
                        borderRadius: "0 4px 4px 0",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "action.hover",
                      transform: "translateX(4px)",
                    },
                    pl: isActive ? 3 : 2,
                  }}
                >
                  {/* Icon */}
                  {sub.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive ? "primary.main" : "text.primary",
                        transition: "all 0.2s ease-in-out",
                        "& svg": {
                          fontSize: "1.25rem",
                        },
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {typeof sub.icon !== "string" ? (
                        <sub.icon />
                      ) : isValidIconKey(sub.icon) ? (
                        React.createElement(tableIcon[sub.icon], {
                          style: {
                            width: "20px",
                            height: "20px",
                            fill: isActive ? "currentColor" : undefined,
                          },
                        })
                      ) : (
                        <Box
                          component="span"
                          sx={{
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                          }}
                        >
                          •
                        </Box>
                      )}
                    </ListItemIcon>
                  )}

                  {/* Text */}
                  <ListItemText
                    primary={sub.name}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 400,
                      noWrap: true,
                      sx: {
                        color: isActive ? "primary.main" : "text.primary",
                        transition: "color 0.2s ease-in-out",
                      },
                    }}
                  />
                </ListItemButton>
              </motion.div>
            );
          })}
        </motion.div>
      </List>
    </Box>
  );
});
