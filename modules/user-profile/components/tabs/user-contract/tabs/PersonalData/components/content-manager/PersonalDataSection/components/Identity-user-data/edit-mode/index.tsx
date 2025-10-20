import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { IdentityDataFormConfig } from "./config/Identity-data-form";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";


export default function UserProfileConnectionDataEditForm() {
  return <Can check={[PERMISSIONS.userProfile.identity.update]}>
    <FormContent config={IdentityDataFormConfig()} />
  </Can>;
}
