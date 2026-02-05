import JobOfferFormPreviewMode from "./JobOfferPreviewMode";
import JobOfferEditMode from "./JobOfferEditMode";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useFunctionalContractualCxt } from "../../../context";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferForm({ offer }: PropsT) {
  const { userJobOffersDataLoading } = useFunctionalContractualCxt();
  const t = useTranslations("UserProfile.tabs.financialData.jobOffer");
  return (
    <TabTemplate
      title={t("title")}
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
