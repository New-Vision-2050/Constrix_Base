import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { UserCertificationFormConfig } from "./UserCertificationFormConfig";

export default function UserCertificationEdit() {
  return (
    <div className="flex flex-col gap-6">
      <FormContent config={UserCertificationFormConfig()} />
    </div>
  );
}
