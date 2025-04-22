import JobOfferFormPreviewMode from "./JobOfferPreviewMode";
import JobOfferEditMode from "./JobOfferEditMode";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { useTranslations } from "next-intl";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferForm({ offer }: PropsT) {
  const t = useTranslations("JobOffer");
  return (
    <TabTemplate
      title={t("JobOffer")}
      reviewMode={<JobOfferFormPreviewMode offer={offer} />}
      editMode={<JobOfferEditMode offer={offer} />}
    />
  );
}
