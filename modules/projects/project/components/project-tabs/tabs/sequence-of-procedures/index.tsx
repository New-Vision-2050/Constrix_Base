"use client";

import SubTypeTabs from "@/modules/hr-settings/tabs/procedures-settings/components/SubTypeTabs";
import { ProceduresSettingsProvider } from "@/modules/hr-settings/tabs/procedures-settings";
import type { ProceduresSettingsOuterTab } from "@/modules/hr-settings/tabs/procedures-settings";
import { Box } from "@mui/material";

const DOCUMENT_SEQUENCE_OUTER_TABS: ProceduresSettingsOuterTab[] = [
  { id: 0, name: "correspondence", type: "correspondence" },
  { id: 1, name: "technicalSubmittal", type: "technical_submittal" },
  { id: 2, name: "ncr", type: "ncr" },
  { id: 3, name: "vo", type: "vo" },
];

export default function SequenceOfProceduresTab() {
  return (
    <ProceduresSettingsProvider
      config={{
        translationNamespace: "CRMSettingsModule.proceduresSettings",
        outerTabs: DOCUMENT_SEQUENCE_OUTER_TABS,
        hideWorkPlanTabs: true,
        addProcedureVariant: "document-classification",
      }}
    >
      <Box sx={{ p: 3 }}>
        <SubTypeTabs />
      </Box>
    </ProceduresSettingsProvider>
  );
}
