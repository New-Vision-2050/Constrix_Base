import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useTranslations } from "next-intl";
import CreateIndividualClientForm from "./individual";
import CreateClientCompanyForm from "./company";

export default function CreateClientSheetContent({
  sub_entity_id,
  handleRefreshWidgetsData,
}: {
  handleRefreshWidgetsData?: () => void;
  sub_entity_id?: string;
}) {
  const t = useTranslations("ClientsModule.form");
  const createClientTabs = [
    {
      id: "individual-client",
      title: t("individualClient"),
      content: <CreateIndividualClientForm sub_entity_id={sub_entity_id} handleRefreshWidgetsData={handleRefreshWidgetsData} />,
    },
    {
      id: "company-client",
      title: t("companyClient"),
      content: <CreateClientCompanyForm sub_entity_id={sub_entity_id} handleRefreshWidgetsData={handleRefreshWidgetsData} />,
    },
  ];

  return (
    <div className="pt-4">
      <HorizontalTabs
        list={createClientTabs}
        additionalClassiess="justify-start"
      />
    </div>
  );
}
