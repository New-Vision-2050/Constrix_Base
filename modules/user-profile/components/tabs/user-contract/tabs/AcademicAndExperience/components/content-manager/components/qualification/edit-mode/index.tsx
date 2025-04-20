import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { QualificationFormConfig } from "./qualification-config";
import { Qualification } from "@/modules/user-profile/types/qualification";

type PropsT = { qualification: Qualification };

export default function SingleQualificationDataEditMode({
  qualification,
}: PropsT) {
  return <FormContent config={QualificationFormConfig({ qualification })} />;
}
