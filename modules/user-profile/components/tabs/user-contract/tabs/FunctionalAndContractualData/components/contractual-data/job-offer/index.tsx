import JobOfferFormPreviewMode from "./JobOfferPreviewMode";
import JobOfferEditMode from "./JobOfferEditMode";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferForm({ offer }: PropsT) {
  return (
    <TabTemplate
      title={"العرض الوظيفي"}
      reviewMode={<JobOfferFormPreviewMode offer={offer} />}
      editMode={<JobOfferEditMode offer={offer} />}
    />
  );
}
