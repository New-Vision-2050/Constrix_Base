import Can from "@/lib/permissions/client/Can";
import { useFunctionalContractualCxt } from "../../context";
import ContractDataForm from "./contract-data";
import JobOfferForm from "./job-offer";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import {useTranslations} from "next-intl";

export default function ContractualDataTab() {
  const { userJobOffersData } = useFunctionalContractualCxt();
  const t = useTranslations("UserProfile");

  return (
    <div className="p-4 flex-grow flex flex-col gap-12">
      <p className="text-lg font-bold">{t("tabs.financialData.contractualData")}</p>
      <Can check={[PERMISSIONS.profile.jobOffer.view]}>
        <JobOfferForm offer={userJobOffersData} />
      </Can>
      <Can check={[PERMISSIONS.profile.contractWork.view]}>
        <ContractDataForm />
      </Can>
    </div>
  );
}
