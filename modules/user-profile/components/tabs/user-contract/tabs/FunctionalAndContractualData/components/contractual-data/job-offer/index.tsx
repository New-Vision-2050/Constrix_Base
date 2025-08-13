import JobOfferFormPreviewMode from "./JobOfferPreviewMode";
import JobOfferEditMode from "./JobOfferEditMode";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useFunctionalContractualCxt } from "../../../context";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferForm({ offer }: PropsT) {
  const { userJobOffersDataLoading } = useFunctionalContractualCxt();
  return (
    <TabTemplate
      title={"العرض الوظيفي"}
      loading={userJobOffersDataLoading}
      reviewMode={<JobOfferFormPreviewMode offer={offer} />}
      editMode={<JobOfferEditMode offer={offer} />}
    />
  );
}
