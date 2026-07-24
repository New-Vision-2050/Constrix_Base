"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import {
  DOCUMENT_SEQUENCE_PROCEDURE_TYPE,
  mapInternalProceduresToOuterTabs,
} from "./mapProcedureSettingTypes";

export const DOCUMENT_PROCEDURE_TYPES_QUERY_KEY =
  "document-sequence-internal-procedures" as const;

export function useDocumentSequenceOuterTabs(projectId?: string) {
  const query = useQuery({
    queryKey: [
      DOCUMENT_PROCEDURE_TYPES_QUERY_KEY,
      DOCUMENT_SEQUENCE_PROCEDURE_TYPE,
      projectId,
    ],
    queryFn: async () => {
      try {
        return await InternalProcedureSettingsApi.getInternalProcedures(
          DOCUMENT_SEQUENCE_PROCEDURE_TYPE,
          projectId ? { projectId } : undefined,
        );
      } catch {
        return [];
      }
    },
    enabled: !!projectId,
    retry: false,
  });

  const outerTabs = useMemo(
    () => mapInternalProceduresToOuterTabs(query.data ?? []),
    [query.data],
  );

  return {
    outerTabs,
    procedures: query.data ?? [],
    isLoading: !!projectId && query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
