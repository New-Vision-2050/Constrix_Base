import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useTranslations } from "next-intl";
import CreateIndividualClientForm from "./individual";
import CreateClientCompanyForm from "./company";

export default function CreateClientSheetContent() {
  const t = useTranslations("ClientsModule.form");
  const createClientTabs = [
    {
      id: "individual-client",
      title: t("individualClient"),
      content: <CreateIndividualClientForm />,
    },
    {
      id: "company-client",
      title: t("companyClient"),
      content: <CreateClientCompanyForm />,
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
