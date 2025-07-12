"use client";

import { AbilityProvider } from "@/contexts/AbilityProvider";
import { usePermissions } from "@/hooks/usePermissions";
import { getCookie } from "cookies-next/client";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

export function AbilityProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logo, setLogo] = useState<string | StaticImageData | undefined>();
  const companyData = getCookie("company-data");

  useEffect(() => {
    if (companyData) {
      try {
        const parsed =
          typeof companyData === "string"
            ? JSON.parse(companyData)
            : companyData;
        setLogo(parsed?.logo);
      } catch {
        setLogo(LogoPlaceholder);
      }
    }
  }, [companyData]);

  const permissions = usePermissions();
  if (!permissions)
    return logo ? (
      <div className="flex items-center justify-center w-full h-svh">
        <Image
        src={logo}
        alt={"Company Logo"}
        width={120}
        height={120}
        priority={true}
      />
      </div>
    ) : null;
  return (
    <AbilityProvider permissions={permissions}>{children}</AbilityProvider>
  );
}
