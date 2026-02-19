"use client";

import { Paper, Tab, Tabs } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect } from "react";

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
            <Tabs
              value={selectedSecondLevelId ?? false}
              onChange={(_, value: number) => {
                const item = items.find((i) => i.id === value);
                if (item) onSelectSecondLevel(item);
              }}
            >
              {items.map((item) => (
                <Tab key={item.id} label={item.name} value={item.id} />
              ))}
            </Tabs>
          </Paper>
          {children}
        </>
      )}
    </div>
  );
}
