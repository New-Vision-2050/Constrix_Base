"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import useCurrentAuthCompany from "@/hooks/use-auth-company";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { AvatarGroup } from "../avatar-group";
import { SidebarProgramsListV2 } from "./sidebar-programs-v2";
import SidebarFooterContent from "./sidebar-footer-content";
import { useFinalSidebarProjects } from "@/hooks/use-sidebar-projects/use-all-sidebar-projects";
import useUserProfileData from "@/modules/user-profile/hooks/useUserProfileData";
import { Copy, Check } from "lucide-react";

interface SidebarContentWrapperProps {
  name?: string;
  serialNumber?: string;
  mainLogo?: string;
  userTypes: UserRoleType[];
  showHeader?: boolean;
  showFooter?: boolean;
}

export function SidebarContentWrapper({
  name,
  serialNumber,
  mainLogo,
  userTypes,
  showHeader = true,
  showFooter = true,
}: SidebarContentWrapperProps) {
  const t = useTranslations();
  const user = useAuthStore((state) => state.user);
  const { data: companyRes } = useCurrentAuthCompany();
  const company = companyRes?.payload;
  const displaySerialNumber = serialNumber || company?.serial_no;
  const { data: profileData } = useUserProfileData(user?.id);
  const userImageUrl = profileData?.image_url || user?.image_url;
  const displayName = name || company?.name || t("Sidebar.CompanyName");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${displayName}\n${displaySerialNumber}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const { projects, isLoading, hasData } = useFinalSidebarProjects(userTypes);

  return (
    <div className="flex h-full w-full flex-col bg-sidebar">
      {showHeader && (
        <div className="pt-10 px-4">
          <div className="flex items-center justify-center flex-col gap-1">
            {mainLogo ? (
              <Image
                src={mainLogo}
                alt={name || "Company Logo"}
                width={60}
                height={47}
                priority={true}
              />
            ) : (
              <Image
                src={LogoPlaceholder}
                alt={"logo placeholder"}
                width={80}
                height={47}
              />
            )}
            <p className="font-bold truncate">
              {name || t("Sidebar.CompanyName")}
            </p>
            {displaySerialNumber && (
              <div className="flex items-center gap-1 mt-1 flex-row-reverse">
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
          <div className="flex gap-5 my-5 pr-5">
            <AvatarGroup
              fullName={user?.name ?? ""}
              alt={user?.name ?? ""}
              src={userImageUrl}
            />
            <p className="truncate">
              {t("Sidebar.Welcome")} {user?.name}
            </p>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {(isLoading || !hasData) && (
          <div className="p-4 flex justify-center">Loading...</div>
        )}
        {projects && projects.length > 0 && !isLoading && (
          <SidebarProgramsListV2 projects={projects} />
        )}
      </div>
      {showFooter && (
        <div className="p-4">
          <SidebarFooterContent />
        </div>
      )}
    </div>
  );
}
