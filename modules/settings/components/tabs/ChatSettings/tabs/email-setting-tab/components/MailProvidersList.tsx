"use client";
import { Button } from "@/components/ui/button";
import { useMailProviderCxt } from "../context/MailProviderCxt";
import { Driver } from "@/modules/settings/types/Driver";
import Loader from "@/components/shared/loader/Loader";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

/**
 * Renders a list of mail provider buttons.
 */
export default function MailProvidersList() {
  const { drivers, loadingDrivers,activeMailProvider } = useMailProviderCxt();

  // handle loading state
  if (loadingDrivers) return <Loader />;

  return (
    <div className="p-4 bg-[#140F35] rounded-md shadow-lg">
      {drivers?.map((provider) => (
        <MailProviderButton key={provider.id} isActive={activeMailProvider?.id == provider.id} provider={provider} />
      ))}
    </div>
  );
}

/**
 * Renders a single mail provider button with its title and icon.
 */
function MailProviderButton({
  provider,
  isActive,
}: {
  provider: Driver;
  isActive: boolean;
}) {
      const canView = can(
      PERMISSION_ACTIONS.VIEW,
      PERMISSION_SUBJECTS.DRIVER
    ) as boolean;
  
  const { handleChangeActiveProvider } = useMailProviderCxt();

  return (
    <>
      {canView && (
        <Button
          onClick={() => {
            handleChangeActiveProvider(provider);
          }}
          className={`text-lg w-full my-2 bg-transparent font-bold flex items-center justify-between ${
            isActive ? "bg-primary/90" : ""
          }`}
        >
          <p>{provider.name}</p>
        </Button>
      )}
    </>
  );
}
