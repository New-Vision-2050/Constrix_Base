"use client";

import { useState, useEffect } from "react";
import { Paper, Tab, Tabs } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import LinearProgress from "@mui/material/LinearProgress";
import MainItemsCard from "../components/main-items-card";

interface Term {
  id: number;
  label: string;
}

export default function TermsTab() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoot, setSelectedRoot] = useState<PRJ_ProjectType | null>(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await fetch("/api/crm/terms");
      const data = await response.json();
      
      if (data.status === 200) {
        setTerms(data.payload);
      }
    } catch (error) {
      console.error("Error fetching terms:", error);
    } finally {
      setLoading(false);
    }
  };

  const { data, isLoading: isLoadingRoots } = useQuery({
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-white">Loading...</div>
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
        
        <MainItemsCard />
      </div>
    </div>
  );
}
