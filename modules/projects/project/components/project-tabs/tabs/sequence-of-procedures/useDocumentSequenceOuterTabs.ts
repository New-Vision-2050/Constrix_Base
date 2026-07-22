"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import { mapProcedureSettingTypesToOuterTabs } from "./mapProcedureSettingTypes";

export const DOCUMENT_PROCEDURE_TYPES_QUERY_KEY =
  "procedure-settings-types" as const;

export function useDocumentSequenceOuterTabs() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: [DOCUMENT_PROCEDURE_TYPES_QUERY_KEY, locale],
    queryFn: () => ProcedureSettingsApi.getTypes(),
    staleTime: 5 * 60 * 1000,
  });

  const outerTabs = useMemo(
    () => mapProcedureSettingTypesToOuterTabs(query.data ?? [], locale),
    [query.data, locale],
  );

  return {
    outerTabs,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
