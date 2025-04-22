import { useFunctionalContractualCxt } from "../../context";
import ContractDataForm from "./contract-data";
import JobOfferForm from "./job-offer";
import { useTranslations } from "next-intl";

export default function ContractualDataTab() {
  const { userJobOffersData } = useFunctionalContractualCxt();
  const t = useTranslations("UserContractTabs");

  return (
    <div className="p-4 flex-grow flex flex-col gap-12">
      <p className="text-lg font-bold">{t("ContractualData")}</p>
      <JobOfferForm offer={userJobOffersData} />
      <ContractDataForm />
    </div>
  );
}
