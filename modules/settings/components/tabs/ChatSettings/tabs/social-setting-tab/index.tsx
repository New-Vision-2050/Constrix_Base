import SocialProvidersList from "./components/SmsProvidersList";
import SocialProviderFormContent from "./components/SocialProviderFormContent";
import SocialProviderCxtProvider from "./context/SocialProviderCxt";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ChatSettingSocialTab() {
  return (
    <SocialProviderCxtProvider>
      <div className="flex gap-16">
        <SocialProvidersList />
        <Can check={[PERMISSIONS.driver.update]}>
          <SocialProviderFormContent />
        </Can>
      </div>
    </SocialProviderCxtProvider>
  );
}
