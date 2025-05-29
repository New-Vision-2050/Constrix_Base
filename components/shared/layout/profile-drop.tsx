"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteCookie, getCookie } from "cookies-next"; // Ensure you have this package installed
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { AvatarGroup } from "../avatar-group";
import LogoutIcon from "@/public/icons/logout";
import { useRouter } from "next/navigation";
import { useCurrentCompany } from "@/modules/company-profile/components/shared/company-header";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import CompanyIcon from "@/public/icons/company";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
// import { useLogout } from '@/modules/auth/store/mutations'

interface menuItem {
  label: string;
  id?: string;
  icon?: ReactNode;
  hasTopSeparator?: boolean;
  hasBottomSeparator?: boolean;
  func: () => void;
}

const ProfileDrop = () => {
  const t = useTranslations("Header");
  const cookieValue = getCookie("current-branch-obj");
  const branchObj = cookieValue ? JSON.parse(cookieValue as string) : null;
  const branchId = branchObj?.id;

  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data, isSuccess } = useCurrentCompany();
  const [open, setOpen] = useState<boolean>(false);
  const [branches, setBranches] = useState<menuItem[]>([]);

  // main items without branches and logout
  const mainMenuItems: menuItem[] = [
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
  ];
  // logout element
  const logoutMenuItem: menuItem = {
    label: t("Logout"),
    icon: <LogoutIcon />,
    func: () => {
      deleteCookie("new-vision-token");
      router?.push("/");
    },
  };
  // const { mutate: logoutMutation } = useLogout();

  const handleClose = (fallback: () => void) => {
    setOpen(false);
    if (fallback && typeof fallback === "function") {
      fallback();
    }
  };
  const switchMenu = () => {
    setOpen(!open);
  };

  useEffect(
    () => {
      if (isSuccess && data?.payload?.branches?.length) {
        const _branches = data?.payload?.branches?.map((branch, index) => ({
          id: branch.id,
          label: branch?.name,
          icon: <CompanyIcon />,
          hasTopSeparator: index === 0,
          hasBottomSeparator: data?.payload?.branches?.length
            ? index === data?.payload?.branches?.length - 1
            : undefined,
          func: () => {
            setCookie(
              "current-branch-obj",
              JSON.stringify({
                id: branch.id ?? "",
                name: branch.name ?? "",
              })
            );
          },
        }));
        setBranches(_branches);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSuccess]
  );

  return (
    <div className="flex justify-center items-center">
      {user?.name && (
        <AvatarGroup
          fullName={user?.name}
          alt={user?.name}
          src="https://github.com/shad\cn.png"
        />
      )}
      <DropdownMenu dir="rtl" open={open}>
        <DropdownMenuTrigger asChild>
          <Button
            className="px-5 bg-[transparent] hover:bg-[transparent] text-foreground rotate-svg-child shadow-none"
            onClick={switchMenu}
          >
            {user?.name}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {mainMenuItems.map((item, index) => (
            <Fragment key={index}>
              {item.hasTopSeparator ? <DropdownMenuSeparator /> : ""}
              <DropdownMenuItem
                onClick={() => handleClose(item.func)}
                className={`${branchId === item.id && "bg-sidebar"}`}
              >
                {item.icon}
                {item.label}
              </DropdownMenuItem>
              {item?.hasBottomSeparator && <DropdownMenuSeparator />}
            </Fragment>
          ))}

          {/* branches */}
          {branches.length > 0 && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center justify-between px-5 gap-2">
                  <div className="flex gap-1">
                    <CompanyIcon />
                    {t("branches")}
                  </div>
                  <ChevronDown size={14} />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-sidebar">
                  {branches.map((branch) => (
                    <DropdownMenuItem
                      key={branch.id}
                      onClick={() => handleClose(branch.func)}
                      className={`${branchId === branch.id && "bg-sidebar"}`}
                    >
                      {branch.icon}
                      {branch.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </>
          )}

          {/* logout element */}
          {logoutMenuItem && (
            <>
              <DropdownMenuItem
                onClick={() => handleClose(logoutMenuItem.func)}
              >
                {logoutMenuItem.icon}
                {logoutMenuItem.label}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDrop;
