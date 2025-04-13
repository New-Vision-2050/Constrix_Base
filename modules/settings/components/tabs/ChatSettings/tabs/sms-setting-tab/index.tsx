import SmsProviderFormContent from "./components/SmsProviderFormContent";
import SmsProvidersList from "./components/SmsProvidersList";
import SmsProviderCxtProvider from "./context/SmsProviderCxt";

export default function ChatSettingSmsTab() {
  return (
    <SmsProviderCxtProvider>
      <div className="flex gap-16">
        <SmsProvidersList />
        <SmsProviderFormContent />
      </div>
    </SmsProviderCxtProvider>
  );
}
