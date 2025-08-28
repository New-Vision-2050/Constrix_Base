import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useTranslations } from "next-intl";
import ClientsSettings from "../tabs/clients-settings";

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
  ];

  return (
    <div className="pt-4">
      <HorizontalTabs
        list={crmSettingsTabs}
        additionalClassiess="justify-start"
      />
    </div>
  );
}
