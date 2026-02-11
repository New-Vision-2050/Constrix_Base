import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { ContractualRelationshipFormConfig } from "./ContractualRelationshipFormConfig";
import { Contract } from "@/modules/user-profile/types/Contract";

export default function ContractualRelationshipFormEditMode({
  contract,
}: {
  contract?: Contract;
}) {
  return <FormContent config={ContractualRelationshipFormConfig({ contract })} />;
}
