import MainUserConnectionInfoSection from "./components/main-connection-info";
import UserAddressSection from "./components/address";
import SocialDataSection from "./components/social-data";
import { ConnectionDataCxtProvider } from "./context/ConnectionDataCxt";
import MaritalStatusRelativesSection from "./components/marital-status-relatives";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function ConnectionDataSection() {

  const permissions = can(PERMISSION_ACTIONS.VIEW, [PERMISSION_SUBJECTS.PROFILE_ADDRESS_INFO , PERMISSION_SUBJECTS.PROFILE_MARITAL_STATUS, PERMISSION_SUBJECTS.PROFILE_SOCIAL_MEDIA]) as {
    PROFILE_ADDRESS_INFO: boolean;
    PROFILE_MARITAL_STATUS: boolean;
    PROFILE_SOCIAL_MEDIA: boolean;
  };

  return (
    <ConnectionDataCxtProvider>
      <div className="flex flex-col gap-6">
        <MainUserConnectionInfoSection />
        {permissions.PROFILE_ADDRESS_INFO && <UserAddressSection />}
        {permissions.PROFILE_MARITAL_STATUS && <MaritalStatusRelativesSection />}
        {permissions.PROFILE_SOCIAL_MEDIA && <SocialDataSection />}
      </div>
    </ConnectionDataCxtProvider>
  );
}
