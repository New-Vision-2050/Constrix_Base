"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import {
  DOCUMENT_SEQUENCE_PROCEDURE_TYPE,
  getEmptyDocumentSequenceOuterTab,
  mapInternalProceduresToOuterTabs,
} from "./mapProcedureSettingTypes";

export const DOCUMENT_PROCEDURE_TYPES_QUERY_KEY =
  "document-sequence-internal-procedures" as const;

export function useDocumentSequenceOuterTabs(projectId?: string) {
  const t = useTranslations("CRMSettingsModule.proceduresSettings.subTabs");

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

  const outerTabs = useMemo(() => {
    const mapped = mapInternalProceduresToOuterTabs(query.data ?? []);
    if (mapped.length > 0) return mapped;

    let fallbackLabel = "Project procedures";
    try {
      fallbackLabel = t("projectProcedure");
    } catch {
      /* keep fallback */
    }
    return [getEmptyDocumentSequenceOuterTab(fallbackLabel)];
  }, [query.data, t]);

  return {
    outerTabs,
    procedures: query.data ?? [],
    isLoading: !!projectId && query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
