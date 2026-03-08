"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi, ProjectDetails } from "@/services/api/projects/all-projects";

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
  const { data: projectData, isLoading, isError } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: async () => {
      const response = await AllProjectsApi.getProjectDetails(projectId);
      return response.data.payload;
    },
    enabled: !!projectId,
  });

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
