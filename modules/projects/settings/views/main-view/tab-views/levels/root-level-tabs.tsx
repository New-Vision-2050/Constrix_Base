"use client";

import { Paper, Tab, Tabs } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import SecondLevelTabs from "./second-level-tabs";

export default function RootLevelTabs() {
  const [selectedRoot, setSelectedRoot] = useState<PRJ_ProjectType | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["project-types", "roots"],
    queryFn: async () => {
      const response = await ProjectTypesApi.getRoots();
      return response.data.payload ?? [];
    },
  });

  const roots = data ?? [];

  useEffect(() => {
    if (roots.length > 0 && !selectedRoot) {
      setSelectedRoot(roots[0]);
    }
  }, [roots, selectedRoot]);

  return (
    <div className="space-y-4">
      {isLoading && <LinearProgress />}
      {!isLoading && (
        <>
          <Paper>
            <Tabs
              value={selectedRoot?.id ?? false}
              onChange={(_, value: number) => {
                const root = roots.find((r) => r.id === value);
                if (root) setSelectedRoot(root);
              }}
            >
              {roots.map((root) => (
                <Tab key={root.id} label={root.name} value={root.id} />
              ))}
            </Tabs>
          </Paper>
          {selectedRoot && (
            <SecondLevelTabs key={selectedRoot.id} parentId={selectedRoot.id} />
          )}
        </>
      )}
    </div>
  );
}
