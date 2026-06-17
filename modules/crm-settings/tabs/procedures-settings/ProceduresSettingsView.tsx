"use client";

import SubTypeTabs from "./components/SubTypeTabs";
import { ProceduresSettingsProvider } from "@/modules/hr-settings/tabs/procedures-settings";
import type { ProceduresSettingsOuterTab } from "@/modules/hr-settings/tabs/procedures-settings";

const CRM_PROCEDURES_OUTER_TABS: ProceduresSettingsOuterTab[] = [
  { id: 0, name: "clientRequests", type: "client_request" },
  { id: 1, name: "contracts", type: "contract" },
  { id: 2, name: "priceOffers", type: "price_offer" },
  { id: 3, name: "meetings", type: "meeting" },
];

export default function ProceduresSettingsView() {
  return (
    <ProceduresSettingsProvider
      config={{
        translationNamespace: "CRMSettingsModule.proceduresSettings",
        outerTabs: CRM_PROCEDURES_OUTER_TABS,
      }}
    >
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <SubTypeTabs />
        </div>
      </div>
    </ProceduresSettingsProvider>
  );
}
