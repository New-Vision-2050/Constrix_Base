import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useTranslations } from "next-intl";
import ClientsSettings from "../tabs/clients-settings";
import TermsTab from "../tabs/terms-tab";
import { CRMSettingDataCxtProvider } from "../context/CRMSettingData";

export default function CRMSettingsEntryPoint() {
  const t = useTranslations("CRMSettingsModule.tabs");
  const crmSettingsTabs = [
    {
      id: "clientsSettings",
      title: t("clientsSettings"),
      content: <ClientsSettings />,
    },
    {
      id: "clientsPermissions",
      title: t("clientsPermissions"),
      content: <>clientsPermissions</>,
    },
    {
      id: "terms",
      title: t("terms"),
      content: <TermsTab />,
    },
  ];

  return (
    <div className="pt-4">
      <CRMSettingDataCxtProvider>
        <HorizontalTabs
          list={crmSettingsTabs}
          bgStyleApproach={true}
          additionalClassiess="justify-start"
        />
      </CRMSettingDataCxtProvider>
    </div>
  );
}
