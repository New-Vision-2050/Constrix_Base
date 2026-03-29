"use client";

import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useTranslations } from "next-intl";
import ClientsSettings from "../tabs/clients-settings";
import { CRMSettingDataCxtProvider } from "../context/CRMSettingData";
import ServicesSettings from "../tabs/services-settings";
import TermsSettings from "../tabs/terms-settings";
import ProceduresSettings from "../tabs/procedures-settings";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useMemo } from "react";

export default function CRMSettingsEntryPoint() {
  const t = useTranslations("CRMSettingsModule.tabs");
  const { can } = usePermissions();

  const allTabs = useMemo(
    () => [
      {
        id: "clientsSettings",
        title: t("clientsSettings"),
        content: <ClientsSettings />,
        permission: PERMISSIONS.crm.settings.update,
      },
      {
        id: "clientsPermissions",
        title: t("clientsPermissions"),
        content: <>clientsPermissions</>,
        permission: PERMISSIONS.crm.clients.update,
      },
      {
        id: "terms",
        title: t("terms"),
        content: <TermsSettings />,
        permission: PERMISSIONS.crm.termSettings.view,
      },
      {
        id: "servicesSettings",
        title: t("servicesSettings"),
        content: <ServicesSettings />,
        permission: PERMISSIONS.crm.serviceSettings.view,
      },
      {
        id: "proceduresSettings",
        title: t("proceduresSettings"),
        content: <ProceduresSettings />,
      },
    ],
    [t],
  );

  const crmSettingsTabs = useMemo(
    () =>
      allTabs.filter((tab) => (tab.permission ? can(tab.permission) : true)),
    [allTabs, can],
  );

  if (crmSettingsTabs.length === 0) {
    return null;
  }

  return (
    <div className="pt-4">
      <CRMSettingDataCxtProvider>
        <HorizontalTabs
          list={crmSettingsTabs}
          // list={allTabs}
          bgStyleApproach={true}
          additionalClassiess="justify-start"
        />
      </CRMSettingDataCxtProvider>
    </div>
  );
}
