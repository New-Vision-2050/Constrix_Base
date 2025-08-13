import MainUserConnectionInfoSection from "./components/main-connection-info";
import UserAddressSection from "./components/address";
import SocialDataSection from "./components/social-data";
import { ConnectionDataCxtProvider } from "./context/ConnectionDataCxt";
import MaritalStatusRelativesSection from "./components/marital-status-relatives";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ConnectionDataSection() {
  return (
    <ConnectionDataCxtProvider>
      <div className="flex flex-col gap-6">
        <Can check={[PERMISSIONS.profile.contactInfo.view]}>
          <MainUserConnectionInfoSection />
        </Can>
        <Can check={[PERMISSIONS.profile.addressInfo.view]}>
          <UserAddressSection />
        </Can>
        <Can check={[PERMISSIONS.profile.maritalStatus.view]}>
          <MaritalStatusRelativesSection />
        </Can>
        <Can check={[PERMISSIONS.profile.socialMedia.view]}>
          <SocialDataSection />
        </Can>
      </div>
    </ConnectionDataCxtProvider>
  );
}
