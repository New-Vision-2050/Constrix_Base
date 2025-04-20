import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { ContractDataFormConfig } from "./ContractDataFormConfig";
import { Contract } from "@/modules/user-profile/types/Contract";

export default function ContractDataFormEditMode({
  contract,
}: {
  contract?: Contract;
}) {
  return <FormContent config={ContractDataFormConfig({ contract })} />;
}
