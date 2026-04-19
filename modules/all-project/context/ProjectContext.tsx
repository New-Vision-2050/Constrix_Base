"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi, ProjectDetails } from "@/services/api/projects/all-projects";
import { useBreadcrumb } from "@/components/shared/breadcrumbs";

interface ProjectContextType {
  projectId: string;
  projectData: ProjectDetails | undefined;
  isLoading: boolean;
  isError: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  projectId: string;
  children: ReactNode;
}

export function ProjectProvider({ projectId, children }: ProjectProviderProps) {
  const { setPageTitle } = useBreadcrumb();
  
  const { data: projectData, isLoading, isError } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: async () => {
      const response = await AllProjectsApi.getProjectDetails(projectId);
      return response.data.payload;
    },
    enabled: !!projectId,
  });

  // Set the project name as the breadcrumb title
  useEffect(() => {
    if (projectData?.name) {
      setPageTitle(projectData.name);
    }
    return () => {
      setPageTitle(null);
    };
  }, [projectData?.name, setPageTitle]);

  return (
    <ProjectContext.Provider
      value={{
        projectId,
        projectData,
        isLoading,
        isError,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
