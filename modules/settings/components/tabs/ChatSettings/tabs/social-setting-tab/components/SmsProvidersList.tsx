"use client";
import { Button } from "@/components/ui/button";
import { SocialProviders } from "../../../constants/SocialProviders";
import { SocialProvider } from "@/modules/settings/types/SocialProvider";
import { useSocialProviderCxt } from "../context/SocialProviderCxt";

/**
 * Renders a list of Social provider buttons.
 */
export default function SocialProvidersList() {
  return (
    <div className="p-4 bg-[#140F35] rounded-md shadow-lg">
      {SocialProviders?.map((provider) => (
        <SocialProviderButton key={provider.id} provider={provider} />
      ))}
    </div>
  );
}

/**
 * Renders a single Social provider button with its title and icon.
 */
function SocialProviderButton({ provider }: { provider: SocialProvider }) {
  const { handleChangeActiveProvider } = useSocialProviderCxt();
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
