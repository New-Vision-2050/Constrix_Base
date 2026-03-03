"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/all-projects";

interface ProjectData {
  id: string;
  serial_number: string;
  name: string;
  project_type_id: number;
  sub_project_type_id: number;
  sub_sub_project_type_id: number;
  manager_id: string | null;
  branch_id: number | null;
  project_owner_type: string | null;
  project_owner_id: string | null;
  contract_id: string | null;
  client_id: string | null;
  project_classification_id: number | null;
  cost_center_branch_id: number | null;
  management_id: number | null;
  currency_id: number | null;
  project_value: string;
  status: number;
  company_id: string;
  created_at: string;
  updated_at: string;
  project_type: {
    id: number;
    name: string;
  } | null;
  sub_project_type: {
    id: number;
    name: string;
  } | null;
  sub_sub_project_type: {
    id: number;
    name: string;
  } | null;
  manager: {
    id: string;
    name: string;
  } | null;
  branch: any;
  project_owner: any;
  project_classification: any;
  company: {
    id: string;
    name: string;
  };
  client: any;
  cost_center_branch: any;
  management: any;
  currency: any;
  permissions: any;
}

interface ProjectContextType {
  projectId: string;
  projectData: ProjectData | undefined;
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
      return response.data.payload as ProjectData;
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
