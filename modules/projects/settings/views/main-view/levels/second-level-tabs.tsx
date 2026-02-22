"use client";

import { Box, Paper, Tab, Tabs, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddProjectTypeDialog from "../../../components/dialogs/add-project-type";
import { APP_ICONS } from "@/constants/icons";
import SchemaLevelTabs from "./schema-level-tabs";

interface SecondLevelTabsProps {
  parentId: number;
}

export default function SecondLevelTabs({ parentId }: SecondLevelTabsProps) {
  const [selectedItem, setSelectedItem] = useState<PRJ_ProjectType | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["project-types", "children", parentId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getDirectChildren(parentId);
      return response.data.payload ?? [];
    },
  });

  const items = data ?? [];

  useEffect(() => {
    if (items.length > 0 && !selectedItem) {
      setSelectedItem(items[0]);
    }
  }, [items, selectedItem]);

  return (
    <div className="space-y-4">
      {(isLoading || isFetching) && <LinearProgress />}
      {!isLoading && (
        <>
          <Paper>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tabs
                value={selectedItem?.id ?? false}
                onChange={(_, value: number) => {
                  const item = items.find((i) => i.id === value);
                  if (item) setSelectedItem(item);
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
              <DialogTrigger
                component={AddProjectTypeDialog}
                dialogProps={{
                  parentId,
                  onSuccess: () => refetch(),
                }}
                render={({ onOpen }) => (
                  <IconButton onClick={onOpen} sx={{ mr: 1 }} color="primary">
                    <AddIcon />
                  </IconButton>
                )}
              />
            </div>
          </Paper>
          {selectedItem && (
            <SchemaLevelTabs key={selectedItem.id} parentId={selectedItem.id} />
          )}
        </>
      )}
    </div>
  );
}
