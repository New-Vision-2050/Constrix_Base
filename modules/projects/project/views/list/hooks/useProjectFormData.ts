import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { useState, useCallback, useRef, useMemo } from "react";
import { useLocale } from "next-intl";

const CLIENTS_PER_PAGE = 20;

export function useProjectFormData(
  watchProjectTypeId?: string,
  watchSubProjectTypeId?: string,
  watchManagementId?: string,
  watchOwnerType?: "company" | "individual",
  watchBranchId?: string,
) {
  const locale = useLocale();
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
    queryKey: ["managements", watchBranchId, searchParams.management_id],
    queryFn: async () => {
      const params: { name?: string; branch_id?: number } = {};
      if (searchParams.management_id) params.name = searchParams.management_id;
      if (watchBranchId) params.branch_id = Number(watchBranchId);
      const response = await AllProjectsApi.getManagements(params);
      return response.data.payload ?? [];
    },
    enabled: !!watchBranchId,
  });

  const { data: companyUsersData } = useQuery({
    queryKey: ["company-users", searchParams.manager_id],
    queryFn: async () => {
      const params: { name?: string; per_page?: number } = { per_page: 100 };
      if (searchParams.manager_id) {
        params.name = searchParams.manager_id;
      }
      const response = await AllProjectsApi.getCompanyUsers(params);
      return response.data.payload ?? [];
    },
  });

  const entityClientsQuery = useInfiniteQuery({
    queryKey: ["entity-clients", watchOwnerType, searchParams.entity_clients],
    queryFn: async ({ pageParam }) => {
      const params: { name?: string; page: number; per_page: number } = {
        page: pageParam,
        per_page: CLIENTS_PER_PAGE,
      };
      if (searchParams.entity_clients) {
        params.name = searchParams.entity_clients;
      }
      const response = await AllProjectsApi.getEntityClients(params);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const pagination = lastPage.pagination;
      if (pagination && lastPageParam < pagination.last_page) {
        return lastPageParam + 1;
      }
      const itemCount = lastPage.payload?.length ?? 0;
      if (itemCount >= CLIENTS_PER_PAGE) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    enabled: watchOwnerType === "company",
  });

  const entityClientsData = useMemo(() => {
    const merged: NonNullable<typeof entityClientsQuery.data>["pages"][0]["payload"] = [];
    const seen = new Set<string>();
    for (const page of entityClientsQuery.data?.pages ?? []) {
      for (const item of page.payload ?? []) {
        if (!seen.has(String(item.id))) {
          seen.add(String(item.id));
          merged.push(item);
        }
      }
    }
    return merged;
  }, [entityClientsQuery.data]);

  const individualClientsQuery = useInfiniteQuery({
    queryKey: [
      "individual-clients",
      watchOwnerType,
      searchParams.individual_clients,
    ],
    queryFn: async ({ pageParam }) => {
      const params: { name?: string; page: number; per_page: number } = {
        page: pageParam,
        per_page: CLIENTS_PER_PAGE,
      };
      if (searchParams.individual_clients) {
        params.name = searchParams.individual_clients;
      }
      const response = await AllProjectsApi.getIndividualClients(params);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const pagination = lastPage.pagination;
      if (pagination && lastPageParam < pagination.last_page) {
        return lastPageParam + 1;
      }
      const itemCount = lastPage.payload?.length ?? 0;
      if (itemCount >= CLIENTS_PER_PAGE) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    enabled: watchOwnerType === "individual",
  });

  const individualClientsData = useMemo(() => {
    const merged: NonNullable<typeof individualClientsQuery.data>["pages"][0]["payload"] = [];
    const seen = new Set<string>();
    for (const page of individualClientsQuery.data?.pages ?? []) {
      for (const item of page.payload ?? []) {
        if (!seen.has(String(item.id))) {
          seen.add(String(item.id));
          merged.push(item);
        }
      }
    }
    return merged;
  }, [individualClientsQuery.data]);

  const { data: contractualEngagementsRaw } = useQuery({
    queryKey: ["contractual-engagements"],
    queryFn: async () => {
      const response = await AllProjectsApi.getContractualEngagements();
      return response.data.payload ?? [];
    },
  });

  const contractTypesData = useMemo(
    () =>
      [...(contractualEngagementsRaw ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => ({
          id: item.id,
          name: locale === "ar" ? item.name_ar : item.name_en,
        })),
    [contractualEngagementsRaw, locale],
  );

  const { data: projectClassificationsData } = useQuery({
    queryKey: ["project-classifications"],
    queryFn: async () => {
      const response = await AllProjectsApi.getProjectClassifications({
        page: 1,
        per_page: 100,
      });
      return response.data.payload ?? [];
    },
  });

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
    contractTypesData,
    projectClassificationsData,
    onSearchChange: handleSearchChange,
    entityClientsPagination: {
      hasNextPage: entityClientsQuery.hasNextPage ?? false,
      fetchNextPage: entityClientsQuery.fetchNextPage,
      isFetchingNextPage: entityClientsQuery.isFetchingNextPage,
    },
    individualClientsPagination: {
      hasNextPage: individualClientsQuery.hasNextPage ?? false,
      fetchNextPage: individualClientsQuery.fetchNextPage,
      isFetchingNextPage: individualClientsQuery.isFetchingNextPage,
    },
  };
}
