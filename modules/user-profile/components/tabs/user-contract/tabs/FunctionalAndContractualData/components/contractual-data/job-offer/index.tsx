import JobOfferFormPreviewMode from "./JobOfferPreviewMode";
import JobOfferEditMode from "./JobOfferEditMode";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useFunctionalContractualCxt } from "../../../context";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

type PropsT = {
  offer: JobOffer | undefined;
};

export default function JobOfferForm({ offer }: PropsT) {
  const { userJobOffersDataLoading } = useFunctionalContractualCxt();
  const canView = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_JOB_OFFER) as boolean;
  const canUpdate = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.PROFILE_JOB_OFFER) as boolean;

  return (
    <CanSeeContent canSee={canView}>
      <TabTemplate
        title={"العرض الوظيفي"}
        loading={userJobOffersDataLoading}
        reviewMode={<JobOfferFormPreviewMode offer={offer} />}
        editMode={<JobOfferEditMode offer={offer} />}
        canEdit={canUpdate}
      />
    </CanSeeContent>
  );
}
