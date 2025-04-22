import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import React from "react";
import { AvatarGroup } from "../avatar-group";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";

const SidebarHeaderContent = ({
  name,
  mainLogo,
}: {
  name?: string;
  mainLogo?: string;
}) => {
  const user = useAuthStore((state) => state.user);
  const { open } = useSidebar();
  const t = useTranslations();

  return (
    <>
      <div className="flex items-center justify-center flex-col gap-1">
        {mainLogo ? (
          <Image
            src={mainLogo}
            alt={name || "Company Logo"}
            width={open ? 60 : 30}
            height={47}
            className="transition-[width] ease-linear duration-200"
          />
        ) : (
          <Image
            src={LogoPlaceholder}
            alt={"logo placeholder"}
            width={open ? 80 : 40}
            height={47}
            className="transition-[width] ease-linear duration-200"
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
