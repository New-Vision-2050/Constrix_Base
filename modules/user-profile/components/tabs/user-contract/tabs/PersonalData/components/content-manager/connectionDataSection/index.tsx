import MainUserConnectionInfoSection from "./components/main-connection-info";
import UserAddressSection from "./components/address";
import MaritalStatusRelativesSection from "./components/marital-status-relatives";
import SocialDataSection from "./components/social-data";

export default function ConnectionDataSection() {
  return (
    <div className="flex flex-col gap-6">
      <MainUserConnectionInfoSection />
      <UserAddressSection />
      <MaritalStatusRelativesSection />
      <SocialDataSection />
    </div>
  );
}
