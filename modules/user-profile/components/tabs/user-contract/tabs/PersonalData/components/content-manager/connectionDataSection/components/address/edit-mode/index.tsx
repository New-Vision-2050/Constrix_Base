import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { AddressFormConfig } from "./address-form-config";

export default function UserAddressSectionEditMode() {
  return <FormContent config={AddressFormConfig()} />;
}
