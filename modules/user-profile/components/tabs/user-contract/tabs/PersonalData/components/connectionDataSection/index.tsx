import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { ConnectionInformationFormConfig } from "./config/connection-info-form-config";
import { AddressFormConfig } from "./config/address-form-config";
import { MaritalStatusRelativesFormConfig } from "./config/marital-status-relatives-form-config";
import { SocialMediaSitesFormConfig } from "./config/social-form-config";

export default function ConnectionDataSection() {
  return (
    <div className="flex flex-col gap-6">
      <FormContent config={ConnectionInformationFormConfig()} />
      <FormContent config={AddressFormConfig()} />
      <FormContent config={MaritalStatusRelativesFormConfig()} />
      <FormContent config={SocialMediaSitesFormConfig()} />
    </div>
  );
}
