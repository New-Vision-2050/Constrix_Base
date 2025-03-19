'use client'
import { Button } from "@/components/ui/button";
import { MailProvider } from "@/modules/settings/types/MailProvider";
import { MailProviders } from "../../../constants/MailProviders";
import { useMailProviderCxt } from "../context/MailProviderCxt";

/**
 * Renders a list of mail provider buttons.
 */
export default function MailProvidersList() {
  return (
    <div className="p-4 bg-[#140F35] rounded-md shadow-lg">
      {MailProviders?.map((provider) => (
        <MailProviderButton key={provider.id} provider={provider} />
      ))}
    </div>
  );
}

/**
 * Renders a single mail provider button with its title and icon.
 */
function MailProviderButton({ provider }: { provider: MailProvider }) {
  const { handleChangeActiveProvider } = useMailProviderCxt();
  return (
    <Button
      onClick={() => {
        handleChangeActiveProvider(provider);
      }}
      className="text-lg w-full my-2 bg-transparent font-bold flex items-center justify-between"
    >
      <p>{provider.title}</p>
      {provider.iconSrc && (
        <img
          src={provider.iconSrc}
          width={20}
          height={20}
          alt={provider.title}
        />
      )}
    </Button>
  );
}
