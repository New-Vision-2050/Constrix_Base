import { useFunctionalContractualCxt } from "../../context";
import ContractDataForm from "./contract-data";
import JobOfferForm from "./job-offer";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function ContractualDataTab() {
  const { userJobOffersData } = useFunctionalContractualCxt();
  const canViewJobOffer = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_JOB_OFFER) as boolean;
  const canViewContract = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_CONTRACT_WORK) as boolean;
  const shouldShowTab = canViewJobOffer || canViewContract;

  return (
    <CanSeeContent canSee={shouldShowTab}>
      <div className="p-4 flex-grow flex flex-col gap-12">
        <p className="text-lg font-bold">البيانات التعاقدية</p>
        {canViewJobOffer && <JobOfferForm offer={userJobOffersData} />}
        {canViewContract && <ContractDataForm />}
      </div>
    </CanSeeContent>
  );
}
