"use client";

import { Box, Paper, Tab, Tabs, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect } from "react";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddProjectTypeDialog from "../../../components/dialogs/add-project-type";
import { APP_ICONS } from "@/constants/icons";

interface SecondLevelTabsProps {
  parentId: number | null;
  selectedSecondLevelId: number | null;
  onSelectSecondLevel: (item: PRJ_ProjectType) => void;
  children: React.ReactNode;
}

export default function SecondLevelTabs({
  parentId,
  selectedSecondLevelId,
  onSelectSecondLevel,
  children,
}: SecondLevelTabsProps) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["project-types", "children", parentId],
    queryFn: async () => {
      if (!parentId) return [];
      const response = await ProjectTypesApi.getDirectChildren(parentId);
      return response.data.payload ?? [];
    },
    enabled: parentId !== null,
  });

  const items = data ?? [];

  useEffect(() => {
    if (items.length > 0 && !selectedSecondLevelId) {
      onSelectSecondLevel(items[0]);
    }
  }, [items, selectedSecondLevelId, onSelectSecondLevel]);

  const showContent = !parentId || !isLoading;

  return (
    <div className="space-y-4">
      {(isLoading || isFetching) && <LinearProgress />}
      {showContent && (
        <>
          <Paper>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tabs
                value={selectedSecondLevelId ?? false}
                onChange={(_, value: number) => {
                  const item = items.find((i) => i.id === value);
                  if (item) onSelectSecondLevel(item);
                }}
                sx={{ flex: 1 }}
              >
                {items.map((item) => {
                  const appIcon = APP_ICONS.find((i) => i.id === item.icon);
                  const IconComponent = appIcon?.component;
                  return (
                    <Tab
                      key={item.id}
                      value={item.id}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          {IconComponent && <IconComponent size={16} />}
                          {item.name}
                        </Box>
                      }
                    />
                  );
                })}
              </Tabs>
              {parentId && (
                <DialogTrigger
                  component={AddProjectTypeDialog}
                  dialogProps={{
                    parentId: parentId,
                    onSuccess: () => {
                      // Refetch will happen via query invalidation
                    },
                  }}
                  render={({ onOpen }) => (
                    <IconButton
                      onClick={onOpen}
                      sx={{ mr: 1 }}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                />
              )}
            </div>
          </Paper>
          {children}
        </>
      )}
    </div>
  );
}
