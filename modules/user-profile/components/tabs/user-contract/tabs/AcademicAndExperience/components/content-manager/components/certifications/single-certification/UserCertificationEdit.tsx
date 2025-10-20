import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { UserCertificationFormConfig } from "./UserCertificationFormConfig";
import { Certification } from "@/modules/user-profile/types/Certification";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";

type PropsT = { certification: Certification };
export default function UserCertificationEdit({ certification }: PropsT) {
  return (
    <div className="flex flex-col gap-6">
      <Can check={[PERMISSIONS.profile.certificates.update]}>
        <FormContent config={UserCertificationFormConfig({ certification })} />
      </Can>
    </div>
  );
}
