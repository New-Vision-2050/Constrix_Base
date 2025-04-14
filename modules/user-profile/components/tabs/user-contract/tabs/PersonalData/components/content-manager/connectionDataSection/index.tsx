import MainUserConnectionInfoSection from "./components/main-connection-info";
import UserAddressSection from "./components/address";
import SocialDataSection from "./components/social-data";
import { ConnectionDataCxtProvider } from "./context/ConnectionDataCxt";
import MaritalStatusRelativesSection from "./components/marital-status-relatives";

export default function ConnectionDataSection() {
  return (
    <ConnectionDataCxtProvider>
      <div className="flex flex-col gap-6">
        <MainUserConnectionInfoSection />
        <UserAddressSection />
        <MaritalStatusRelativesSection />
        <SocialDataSection />
      </div>
    </ConnectionDataCxtProvider>
  );
}
