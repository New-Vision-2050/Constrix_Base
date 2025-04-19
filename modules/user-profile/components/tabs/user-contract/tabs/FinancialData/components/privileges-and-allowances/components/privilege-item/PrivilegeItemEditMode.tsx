import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { PrivilegeItemFormConfig } from "./PrivilegeItemFormConfig";
import { UserPrivilege } from "@/modules/user-profile/types/privilege";

type PropsT = {
  privilegeData: UserPrivilege;
};

export default function PrivilegeItemEditMode({ privilegeData }: PropsT) {
  return <FormContent config={PrivilegeItemFormConfig({ privilegeData })} />;
}
