import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { useState, useCallback } from "react";

type OptionItem = { id: number | string; name: string };

export interface ProjectFilterValues {
  project_type_id: string;
  sub_project_type_id: string;
  sub_sub_project_type_id: string;
  manager_id: string;
  branch_id: string;
  project_owner_type: string;
  project_owner_id: string;
  management_id: string;
  status: string;
}

export const initialFilterValues: ProjectFilterValues = {
  project_type_id: "",
  sub_project_type_id: "",
  sub_sub_project_type_id: "",
  manager_id: "",
  branch_id: "",
  project_owner_type: "",
  project_owner_id: "",
  management_id: "",
  status: "",
};

export function useProjectFilters() {
  const [filters, setFilters] = useState<ProjectFilterValues>(initialFilterValues);

  const { data: projectTypesData } = useQuery<OptionItem[]>({
    queryKey: ["project-filter-types-roots"],
    queryFn: async () => {
      const response = await AllProjectsApi.getProjectTypes();
      return response.data.payload ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: subProjectTypesData } = useQuery<OptionItem[]>({
    queryKey: ["project-filter-sub-types", filters.project_type_id],
    queryFn: async () => {
      const response = await AllProjectsApi.getSubProjectTypes(
        parseInt(filters.project_type_id, 10),
      );
      return response.data.payload ?? [];
    },
    enabled: !!filters.project_type_id,
  });

  const { data: subSubProjectTypesData } = useQuery<OptionItem[]>({
    queryKey: ["project-filter-sub-sub-types", filters.sub_project_type_id],
    queryFn: async () => {
      const response = await AllProjectsApi.getSubProjectTypes(
        parseInt(filters.sub_project_type_id, 10),
      );
      return response.data.payload ?? [];
    },
    enabled: !!filters.sub_project_type_id,
  });

  const { data: managersData } = useQuery<OptionItem[]>({
    queryKey: ["project-filter-managers"],
    queryFn: async () => {
      const response = await AllProjectsApi.getCompanyUsers({ per_page: 100 });
      return response.data.payload ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: ownerOptionsData } = useQuery<OptionItem[]>({
    queryKey: ["project-filter-owners", filters.project_owner_type],
    queryFn: async () => {
      if (filters.project_owner_type === "company") {
        const response = await AllProjectsApi.getEntityClients({
          page: 1,
          per_page: 100,
        });
        return response.data.payload ?? [];
      } else {
        const response = await AllProjectsApi.getIndividualClients({
          page: 1,
          per_page: 100,
        });
        return response.data.payload ?? [];
      }
    },
    enabled:
      filters.project_owner_type === "company" ||
      filters.project_owner_type === "individual",
  });

  const setFilter = useCallback(
    <K extends keyof ProjectFilterValues>(key: K, value: ProjectFilterValues[K]) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };

        if (key === "project_type_id") {
          next.sub_project_type_id = "";
          next.sub_sub_project_type_id = "";
        }
        if (key === "sub_project_type_id") {
          next.sub_sub_project_type_id = "";
        }
        if (key === "project_owner_type") {
          next.project_owner_id = "";
        }

        return next;
      });
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilterValues);
  }, []);

  return {
    filters,
    setFilter,
    resetFilters,
    projectTypesData: projectTypesData ?? [],
    subProjectTypesData: subProjectTypesData ?? [],
    subSubProjectTypesData: subSubProjectTypesData ?? [],
    managersData: managersData ?? [],
    ownerOptionsData: ownerOptionsData ?? [],
  };
}
