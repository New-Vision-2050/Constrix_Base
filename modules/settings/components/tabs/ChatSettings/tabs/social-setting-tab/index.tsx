import SocialProvidersList from "./components/SmsProvidersList";
import SocialProviderFormContent from "./components/SocialProviderFormContent";
import SocialProviderCxtProvider from "./context/SocialProviderCxt";

export default function ChatSettingSocialTab() {
  return (
    <SocialProviderCxtProvider>
      <div className="flex gap-16">
        <SocialProvidersList />
        <SocialProviderFormContent />
      </div>
    </SocialProviderCxtProvider>
  );
}
