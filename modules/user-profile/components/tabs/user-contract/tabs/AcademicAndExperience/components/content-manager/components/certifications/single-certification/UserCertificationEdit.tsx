import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { UserCertificationFormConfig } from "./UserCertificationFormConfig";
import { Certification } from "@/modules/user-profile/types/Certification";

type PropsT = { certification: Certification };
export default function UserCertificationEdit({ certification }: PropsT) {
  return (
    <div className="flex flex-col gap-6">
      <FormContent config={UserCertificationFormConfig({ certification })} />
    </div>
  );
}
