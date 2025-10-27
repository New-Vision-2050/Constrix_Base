import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useTranslations } from "next-intl";
import CreateIndividualBrokerForm from "./individual";
import CreateBrokerCompanyForm from "./company";

export default function CreateBrokerSheetContent({
  sub_entity_id,
}: {
  sub_entity_id?: string;
}) {
  const t = useTranslations("BrokersModule.form");
  const createBrokerTabs = [
    {
      id: "individual-broker",
      title: t("individualBroker"),
      content: <CreateIndividualBrokerForm sub_entity_id={sub_entity_id} />,
    },
    {
      id: "company-broker",
      title: t("companyBroker"),
      content: <CreateBrokerCompanyForm sub_entity_id={sub_entity_id} />,
    },
  ];

  return (
    <div className="pt-4">
      <HorizontalTabs
        list={createBrokerTabs}
        additionalClassiess="justify-start"
      />
    </div>
  );
}
