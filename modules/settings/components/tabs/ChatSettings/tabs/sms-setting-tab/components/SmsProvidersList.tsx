"use client";
import { Button } from "@/components/ui/button";
import { useSmsProviderCxt } from "../context/SmsProviderCxt";
import Loader from "@/components/shared/loader/Loader";
import { Driver } from "@/modules/settings/types/Driver";

/**
 * Renders a list of Sms provider buttons.
 */
export default function SmsProvidersList() {
  const { drivers, loadingDrivers, activeSmsProvider } = useSmsProviderCxt();

  // handle loading state
  if (loadingDrivers) return <Loader />;

  return (
    <div className="p-4 bg-[#140F35] rounded-md shadow-lg">
      {drivers?.map((provider) => (
        <SmsProviderButton
          key={provider.id}
          isActive={activeSmsProvider?.id === provider.id}
          provider={provider}
        />
      ))}
    </div>
  );
}

/**
 * Renders a single Sms provider button with its title and icon.
 */
function SmsProviderButton({
  provider,
  isActive,
}: {
  isActive: boolean;
  provider: Driver;
}) {
  const { handleChangeActiveProvider } = useSmsProviderCxt();
  return (
    <Button
      onClick={() => {
        handleChangeActiveProvider(provider);
      }}
      className={`text-lg w-full my-2 bg-transparent font-bold flex items-center justify-between ${
        isActive ? "bg-primary/90" : ""
      }`}
    >
      {provider.name}
    </Button>
  );
}
