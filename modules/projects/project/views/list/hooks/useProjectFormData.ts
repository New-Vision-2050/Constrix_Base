import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { useState, useCallback, useRef } from "react";

export function useProjectFormData(
  watchProjectTypeId?: string,
  watchSubProjectTypeId?: string,
  watchManagementId?: string,
  watchOwnerType?: "company" | "individual",
) {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const { data: projectTypesData } = useQuery({
    queryKey: ["project-types-roots"],
    queryFn: async () => {
      const response = await AllProjectsApi.getProjectTypes();
      return response.data.payload ?? [];
    },
  });

  const { data: subProjectTypesData } = useQuery({
    queryKey: ["sub-project-types", watchProjectTypeId],
    queryFn: async () => {
      const response = await AllProjectsApi.getSubProjectTypes(
        parseInt(watchProjectTypeId!, 10),
      );
      return response.data.payload ?? [];
    },
    enabled: !!watchProjectTypeId,
  });

  const { data: subSubProjectTypesData } = useQuery({
    queryKey: ["sub-sub-project-types", watchSubProjectTypeId],
    queryFn: async () => {
      const response = await AllProjectsApi.getSubProjectTypes(
        parseInt(watchSubProjectTypeId!, 10),
      );
      return response.data.payload ?? [];
    },
    enabled: !!watchSubProjectTypeId,
  });

  const { data: branchesData } = useQuery({
    queryKey: ["branches", searchParams.branch_id],
    queryFn: async () => {
      const response = await AllProjectsApi.getBranches(
        searchParams.branch_id ? { name: searchParams.branch_id } : {},
      );
      return response.data.payload ?? [];
    },
  });

  const { data: managementsData } = useQuery({
    queryKey: ["managements", searchParams.management_id],
    queryFn: async () => {
      const response = await AllProjectsApi.getManagements(
        searchParams.management_id ? { name: searchParams.management_id } : {},
      );
      return response.data.payload ?? [];
    },
  });

  const { data: companyUsersData } = useQuery({
    queryKey: ["company-users", searchParams.manager_id],
    queryFn: async () => {
      const response = await AllProjectsApi.getCompanyUsers();
      return response.data.payload ?? [];
    },
  });

  const { data: entityClientsData } = useQuery({
    queryKey: ["entity-clients", watchOwnerType, searchParams.entity_clients],
    queryFn: async () => {
      const response = await AllProjectsApi.getEntityClients(
        searchParams.entity_clients
          ? { name: searchParams.entity_clients }
          : {},
      );
      return response.data.payload ?? [];
    },
    enabled: watchOwnerType === "company",
  });

  const { data: individualClientsData } = useQuery({
    queryKey: [
      "individual-clients",
      watchOwnerType,
      searchParams.individual_clients,
    ],
    queryFn: async () => {
      const response = await AllProjectsApi.getIndividualClients(
        searchParams.individual_clients
          ? { name: searchParams.individual_clients }
          : {},
      );
      return response.data.payload ?? [];
    },
    enabled: watchOwnerType === "individual",
  });

  // const { data: contractTypesData } = useQuery({
  //   queryKey: ["contract-types"],
  //   queryFn: async () => {
  //     const response = await AllProjectsApi.getContractTypes();
  //     return response.data.payload ?? [];
  //   },
  // });

  // const { data: projectClassificationsData } = useQuery({
  //   queryKey: ["project-classifications"],
  //   queryFn: async () => {
  //     const response = await AllProjectsApi.getProjectClassifications();
  //     return response.data.payload ?? [];
  //   },
  // });

  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const handleSearchChange = (fieldName: string, searchValue: string) => {
    // Clear existing timeout for this field
    if (timeoutRefs.current[fieldName]) {
      clearTimeout(timeoutRefs.current[fieldName]);
    }

    // Set new timeout
    timeoutRefs.current[fieldName] = setTimeout(() => {
      setSearchParams((prev) => ({
        ...prev,
        [fieldName]: searchValue,
      }));
    }, 300);
  };

  return {
    projectTypesData,
    subProjectTypesData,
    subSubProjectTypesData,
    branchesData,
    managementsData,
    companyUsersData,
    entityClientsData,
    individualClientsData,
    // contractTypesData,
    // projectClassificationsData,
    onSearchChange: handleSearchChange,
  };
}
