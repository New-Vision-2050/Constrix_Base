import MailProviderFormContent from "./components/MailProviderFormContent";
import MailProvidersList from "./components/MailProvidersList";
import MailProviderCxtProvider from "./context/MailProviderCxt";

export default function ChatSettingEmailTab() {
  return (
    <MailProviderCxtProvider>
      <div className="flex gap-16">
        <MailProvidersList />
        <MailProviderFormContent />
      </div>
    </MailProviderCxtProvider>
  );
}
