import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { AvatarGroup } from "../avatar-group";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";
import useCurrentAuthCompany from "@/hooks/use-auth-company";
import useUserProfileData from "@/modules/user-profile/hooks/useUserProfileData";
import { Copy, Check } from "lucide-react";

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
  const { data: profileData } = useUserProfileData(user?.id);
  
  const displaySerialNumber = serialNumber || company?.serial_no;
  const userImageUrl = profileData?.image_url || user?.image_url;
  const displayName = name || company?.name || t("Sidebar.CompanyName");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displaySerialNumber || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col gap-1">
        {mainLogo ? (
            <Image
                src={mainLogo || LogoPlaceholder}
                alt={name || "Company Logo"}
                width={40}
                height={40}
                priority
                className="w-[40px] h-[40px] rounded-full object-cover overflow-hidden"
            />
        ) : (
            <Image
                src={mainLogo || LogoPlaceholder}
                alt={name || "Company Logo"}
                width={40}
                height={40}
                priority
                className="w-[40px] h-[40px] rounded-full object-cover overflow-hidden"
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
          <div
            className={cn(
              "transition flex items-center gap-1 mt-1 flex-row-reverse",
              open ? "opacity-100" : "opacity-0"
            )}
          >
            <p className="text-xs opacity-70 truncate font-semibold">
              {displaySerialNumber}
            </p>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title={t("Sidebar.CopyCompanyInfo")}
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 opacity-70 hover:opacity-100" />
              )}
            </button>
          </div>
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
          src={userImageUrl}
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
