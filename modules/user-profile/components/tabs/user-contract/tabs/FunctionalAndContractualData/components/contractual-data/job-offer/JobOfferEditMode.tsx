import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { JobOfferFormConfig } from "./JobOfferFormConfig";
import { JobOffer } from "@/modules/user-profile/types/job-offer";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferEditMode({ offer }: PropsT) {
  return <FormContent config={JobOfferFormConfig({ offer })} />;
}
