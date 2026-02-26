"use client";

import { useState, useEffect } from "react";
import { Paper, Tab, Tabs } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import { ProjectTermsApi } from "@/services/api/projects/project-terms";
import { TermSetting } from "@/services/api/projects/project-terms/types/response";
import LinearProgress from "@mui/material/LinearProgress";
import MainItemsCard from "../components/main-items-card";

export default function TermsTab() {
  const [selectedRoot, setSelectedRoot] = useState<PRJ_ProjectType | null>(null);

  const { data: termsData, isLoading: loadingTerms } = useQuery({
    queryKey: ["term-settings"],
    queryFn: async () => {
      const response = await ProjectTermsApi.getTermSettings({ page: 1, per_page: 15 });
      return response.data;
    },
  });

  const { data, isLoading: isLoadingRoots } = useQuery({
    queryKey: ["project-types", "roots"],
    queryFn: async () => {
      const response = await ProjectTypesApi.getRoots();
      return response.data.payload ?? [];
    },
  });

  const roots = data ?? [];
  const terms = termsData?.payload ?? [];

  useEffect(() => {
    if (roots.length > 0 && !selectedRoot) {
      setSelectedRoot(roots[0]);
    }
  }, [roots, selectedRoot]);

  if (loadingTerms) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-white">Loading terms...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
    
      <div className="space-y-4">
        {isLoadingRoots && <LinearProgress />}
        {!isLoadingRoots && (
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
        )}
        
        <MainItemsCard terms={terms || []} />
      </div>
    </div>
  );
}
