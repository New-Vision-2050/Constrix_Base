import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/all-projects";

export function useProjectFormData(
  watchProjectTypeId?: string,
  watchSubProjectTypeId?: string,
  watchManagementId?: string,
  watchOwnerType?: "company" | "individual",
) {
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
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await AllProjectsApi.getBranches();
      return response.data.payload ?? [];
    },
  });

  const { data: managementsData } = useQuery({
    queryKey: ["managements"],
    queryFn: async () => {
      const response = await AllProjectsApi.getManagements();
      return response.data.payload ?? [];
    },
  });

  const { data: companyUsersData } = useQuery({
    queryKey: ["company-users"],
    queryFn: async () => {
      const response = await AllProjectsApi.getCompanyUsers();
      return response.data.payload ?? [];
    },
  });

  const { data: entityClientsData } = useQuery({
    queryKey: ["entity-clients"],
    queryFn: async () => {
      const response = await AllProjectsApi.getEntityClients();
      return response.data.payload ?? [];
    },
    enabled: watchOwnerType === "company",
  });

  const { data: individualClientsData } = useQuery({
    queryKey: ["individual-clients"],
    queryFn: async () => {
      const response = await AllProjectsApi.getIndividualClients();
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
  };
}
