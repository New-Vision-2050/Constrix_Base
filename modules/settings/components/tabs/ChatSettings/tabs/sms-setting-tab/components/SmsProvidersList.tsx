"use client";
import { Button } from "@/components/ui/button";
import { SmsProvider } from "@/modules/settings/types/SmsProvider";
import { useSmsProviderCxt } from "../context/SmsProviderCxt";
import { SmsProviders } from "../../../constants/SmsProviders";

/**
 * Renders a list of Sms provider buttons.
 */
export default function SmsProvidersList() {
  return (
    <div className="p-4 bg-[#140F35] rounded-md shadow-lg">
      {SmsProviders?.map((provider) => (
        <SmsProviderButton key={provider.id} provider={provider} />
      ))}
    </div>
  );
}

/**
 * Renders a single Sms provider button with its title and icon.
 */
function SmsProviderButton({ provider }: { provider: SmsProvider }) {
  const { handleChangeActiveProvider } = useSmsProviderCxt();
  return (
    <Button
      onClick={() => {
        handleChangeActiveProvider(provider);
      }}
      className="text-lg w-full my-2 bg-transparent font-bold flex items-center justify-between"
    >
      {provider.title}
    </Button>
  );
}
