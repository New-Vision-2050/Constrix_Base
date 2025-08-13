import Can from "@/lib/permissions/client/Can";
import { useFunctionalContractualCxt } from "../../context";
import ContractDataForm from "./contract-data";
import JobOfferForm from "./job-offer";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ContractualDataTab() {
  const { userJobOffersData } = useFunctionalContractualCxt();

  return (
    <div className="p-4 flex-grow flex flex-col gap-12">
      <p className="text-lg font-bold">البيانات التعاقدية</p>
      <Can check={[PERMISSIONS.profile.jobOffer.view]}>
        <JobOfferForm offer={userJobOffersData} />
      </Can>
      <Can check={[PERMISSIONS.profile.contractWork.view]}>
        <ContractDataForm />
      </Can>
    </div>
  );
}
