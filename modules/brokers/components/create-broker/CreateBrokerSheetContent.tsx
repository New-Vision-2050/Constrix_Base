import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useTranslations } from "next-intl";
import CreateIndividualBrokerForm from "./individual";
import CreateBrokerCompanyForm from "./company";

export default function CreateBrokerSheetContent() {
  const t = useTranslations("BrokersModule.form");
  const createBrokerTabs = [
    {
      id: "individual-broker",
      title: t("individualBroker"),
      content: <CreateIndividualBrokerForm />,
    },
    {
      id: "company-broker",
      title: t("companyBroker"),
      content: <CreateBrokerCompanyForm />,
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
