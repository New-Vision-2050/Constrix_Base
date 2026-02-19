"use client";

import { Paper, Tab, Tabs } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect } from "react";

interface RootLevelTabsProps {
  selectedRootId: number | null;
  onSelectRoot: (root: PRJ_ProjectType) => void;
  children: React.ReactNode;
}

export default function RootLevelTabs({
  selectedRootId,
  onSelectRoot,
  children,
}: RootLevelTabsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["project-types", "roots"],
    queryFn: async () => {
      const response = await ProjectTypesApi.getRoots();
      return response.data.payload ?? [];
    },
  });

  const roots = data ?? [];

  useEffect(() => {
    if (roots.length > 0 && !selectedRootId) {
      onSelectRoot(roots[0]);
    }
  }, [roots, selectedRootId, onSelectRoot]);

  const showContent = !isLoading;

  return (
    <div className="space-y-4">
      {isLoading && <LinearProgress />}
      {showContent && (
        <>
          <Paper>
            <Tabs
              value={selectedRootId ?? false}
              onChange={(_, value: number) => {
                const root = roots.find((r) => r.id === value);
                if (root) onSelectRoot(root);
              }}
            >
              {roots.map((root) => (
                <Tab key={root.id} label={root.name} value={root.id} />
              ))}
            </Tabs>
          </Paper>
          {children}
        </>
      )}
    </div>
  );
}
