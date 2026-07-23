"use client";

import SubTypeTabs from "@/modules/hr-settings/tabs/procedures-settings/components/SubTypeTabs";
import { ProceduresSettingsProvider } from "@/modules/hr-settings/tabs/procedures-settings";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useOptionalProject } from "@/modules/all-project/context/ProjectContext";
import { useDocumentSequenceOuterTabs } from "./useDocumentSequenceOuterTabs";

/**
 * Document Management → Sequence of procedures.
 * Outer tabs come from GET procedure-settings/types (dynamic).
 * Same procedure APIs as CRM إعداد إجراءات الطلبات; document-classification add dialog.
 */
export default function SequenceOfProceduresTab() {
  const tc = useTranslations("CRMSettingsModule.proceduresSettings.common");
  const { outerTabs, isLoading, isError } = useDocumentSequenceOuterTabs();
  const routeParams = useParams();
  const projectIdFromRoute =
    typeof routeParams?.id === "string" ? routeParams.id : undefined;
  const projectId =
    useOptionalProject()?.projectId ?? projectIdFromRoute;

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError || outerTabs.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">{tc("loadError")}</Typography>
      </Box>
    );
  }

  return (
    <ProceduresSettingsProvider
      config={{
        translationNamespace: "CRMSettingsModule.proceduresSettings",
        outerTabs,
        hideWorkPlanTabs: true,
        addProcedureVariant: "document-classification",
        projectId,
      }}
    >
      <Box sx={{ p: 3 }}>
        <SubTypeTabs />
      </Box>
    </ProceduresSettingsProvider>
  );
}
