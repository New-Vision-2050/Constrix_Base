import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import React from "react";
import { AvatarGroup } from "../avatar-group";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";
import useCurrentAuthCompany from "@/hooks/use-auth-company";

const SidebarHeaderContent = ({
  name,
  serialNumber,
  mainLogo,
}: {
  name?: string;
  serialNumber?: string;
  mainLogo?: string;
}) => {
  const user = useAuthStore((state) => state.user);
  const { open } = useSidebar();
  const t = useTranslations();
  const { data: companyRes } = useCurrentAuthCompany();
  const company = companyRes?.payload;
  
  const displaySerialNumber = serialNumber || company?.serial_no;

  return (
    <>
      <div className="flex items-center justify-center flex-col gap-1">
        {mainLogo ? (
            <Image
                src={mainLogo || LogoPlaceholder}
                alt={name || "Company Logo"}
                width={120}
                height={120}
                priority
                className="w-[120px] h-[120px] rounded-full object-cover overflow-hidden"
            />
        ) : (
            <Image
                src={mainLogo || LogoPlaceholder}
                alt={name || "Company Logo"}
                width={120}
                height={120}
                priority
                className="w-[120px] h-[120px] rounded-full object-cover overflow-hidden"
            />
        )}

        <p
          className={cn(
            "transition truncate font-bold",
            open ? "opacity-100" : "opacity-0"
          )}
        >
          {name || t("Sidebar.CompanyName")}
        </p>
        {displaySerialNumber && (
          <p
            className={cn(
              "transition text-xs opacity-70 truncate font-semibold mt-1",
              open ? "opacity-100" : "opacity-0"
            )}
          >
            {displaySerialNumber}
          </p>
        )}
      </div>
      <div
        className={cn(
          "transition-[padding] flex gap-5 my-5 ",
          open ? "pr-5" : "pr-1 "
        )}
      >
        <AvatarGroup
          fullName={user?.name ?? ""}
          alt={user?.name ?? ""}
          src="https://github.com/shad\cn.png"
        />
        <p
          className={cn(
            "transition truncate",
            open ? "opacity-100" : "opacity-0"
          )}
        >
          {t("Sidebar.Welcome")} {user?.name}
        </p>
      </div>
    </>
  );
};

export default SidebarHeaderContent;
