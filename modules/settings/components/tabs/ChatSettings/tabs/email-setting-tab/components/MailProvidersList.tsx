"use client";
import { Button } from "@/components/ui/button";
import { useMailProviderCxt } from "../context/MailProviderCxt";
import { Driver } from "@/modules/settings/types/Driver";
import Loader from "@/components/shared/loader/Loader";

/**
 * Renders a list of mail provider buttons.
 */
export default function MailProvidersList() {
  const { drivers, loadingDrivers } = useMailProviderCxt();

  // handle loading state
  if (loadingDrivers) return <Loader />;

  
  return (
    <div className="p-4 bg-[#140F35] rounded-md shadow-lg">
      {drivers?.map((provider) => (
        <MailProviderButton key={provider.id} provider={provider} />
      ))}
    </div>
  );
}

/**
 * Renders a single mail provider button with its title and icon.
 */
function MailProviderButton({ provider }: { provider: Driver }) {
  const { handleChangeActiveProvider } = useMailProviderCxt();

  return (
    <Button
      onClick={() => {
        handleChangeActiveProvider(provider);
      }}
      className="text-lg w-full my-2 bg-transparent font-bold flex items-center justify-between"
    >
      <p>{provider.name}</p>
      {/* {provider.iconSrc && (
        <img
          src={provider.iconSrc}
          width={20}
          height={20}
          alt={provider.title}
        />
      )} */}
    </Button>
  );
}
