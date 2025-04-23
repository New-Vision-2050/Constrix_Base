"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteCookie } from "cookies-next"; // Ensure you have this package installed
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { AvatarGroup } from "../avatar-group";
import LogoutIcon from "@/public/icons/logout";
import { useRouter } from "next/navigation";
import UserIcon from "@/public/icons/user";

const ProfileDrop = () => {
  const t = useTranslations("Header");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    {
      label: t("profile"),
      icon: <UserIcon />,
      func: () => {
        router?.push(`/user-profile`);
      },
    },
    {
      label: t("changeMail"),
      icon: <UserIcon />,
      func: () => {
        router?.push(
          `/user-profile?tab1=edit-mode-tabs-contract&tab2=user-contract-tab-personal-data`
        );
      },
    },
    {
      label: t("changePassword"),
      icon: <UserIcon />,
      func: () => {
        router?.push(
          `/user-profile?tab1=edit-mode-tabs-logs&tab2=user-actions-tabs-user-status&verticalSection=user-status-password`
        );
      },
    },
    {
      label: t("Logout"),
      icon: <LogoutIcon />,
      func: () => {
        deleteCookie("new-vision-token");
        window.location.reload();
      },
    },
  ];
  return (
    <div className="flex justify-center items-center">
      {user?.name && (
        <AvatarGroup
          fullName={user?.name}
          alt={user?.name}
          src="https://github.com/shad\cn.png"
        />
      )}
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button className="px-5 bg-[transparent] hover:bg-[transparent] text-foreground rotate-svg-child shadow-none">
            {user?.name}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {menuItems.map((item, index) => (
            <DropdownMenuItem key={index} onClick={item.func}>
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDrop;
