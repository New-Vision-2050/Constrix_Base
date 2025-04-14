import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { MaritalStatusRelativesFormConfig } from "./marital-status-relatives-form-config";
import { Relative } from "@/modules/user-profile/types/relative";

type PropsT = {
  relative: Relative;
};

export default function MaritalStatusRelativesSectionEditMode({
  relative
}: PropsT) {
  return <FormContent config={MaritalStatusRelativesFormConfig({relative})} />;
}
