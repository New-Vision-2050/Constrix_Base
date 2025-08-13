import JobOfferFormPreviewMode from "./JobOfferPreviewMode";
import JobOfferEditMode from "./JobOfferEditMode";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useFunctionalContractualCxt } from "../../../context";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferForm({ offer }: PropsT) {
  const { userJobOffersDataLoading } = useFunctionalContractualCxt();
  return (
    <TabTemplate
      title={"العرض الوظيفي"}
      loading={userJobOffersDataLoading}
      reviewMode={
        <Can check={[PERMISSIONS.profile.jobOffer.view]}>
          <JobOfferFormPreviewMode offer={offer} />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.jobOffer.update]}>
          <JobOfferEditMode offer={offer} />
        </Can>
      }
    />
  );
}
