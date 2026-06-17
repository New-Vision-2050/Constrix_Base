"use client";

import { useMemo } from "react";
import SubTypeTabs from "./components/SubTypeTabs";
import { ProceduresSettingsProvider } from "./context/ProceduresSettingsContext";
import {
  DEFAULT_HR_PROCEDURES_CONFIG,
  DEFAULT_HR_PROCEDURES_OUTER_TABS,
} from "./constants/defaultConfig";
import type { ProceduresSettingsViewProps } from "./types";

export default function ProceduresSettingsView({
  outerTabs = DEFAULT_HR_PROCEDURES_OUTER_TABS,
  translationNamespace = DEFAULT_HR_PROCEDURES_CONFIG.translationNamespace,
}: ProceduresSettingsViewProps = {}) {
  const config = useMemo(
    () => ({
      translationNamespace,
      outerTabs,
    }),
    [translationNamespace, outerTabs],
  );

  return (
    <ProceduresSettingsProvider config={config}>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <SubTypeTabs />
        </div>
      </div>
    </ProceduresSettingsProvider>
  );
}
