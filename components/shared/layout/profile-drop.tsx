"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteCookie } from "cookies-next"; // Ensure you have this package installed
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { AvatarGroup } from "../avatar-group";
import LogoutIcon from "@/public/icons/logout";
import { useRouter } from "next/navigation";
import UserIcon from "@/public/icons/user";
import { useCurrentCompany } from '@/modules/company-profile/components/shared/company-header'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { setCookie } from "cookies-next";
import CompanyIcon from '@/public/icons/company'
// import { useLogout } from '@/modules/auth/store/mutations'

interface menuItem {
  label: string,
  icon?: ReactNode,
  hasTopSeparator?: boolean,
  hasBottomSeparator?: boolean,
  func: () => void,
}

const ProfileDrop = () => {
  const t = useTranslations("Header");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data, isSuccess } = useCurrentCompany();
  const [open, setOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<menuItem[]>([
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
        router?.push('/');
        // logoutMutation(undefined,
        //   {
        //     onSuccess: (res) => {
        //       deleteCookie("new-vision-token");
        //       router?.push('/');
        //     },
        //   }
        // );

      },
    },]);
  // const { mutate: logoutMutation } = useLogout();

  const handleClose = (fallback: () => void)=>{
    setOpen(false)
    if(fallback && typeof fallback === 'function'){
      fallback()
    }
  }
  const switchMenu = ()=>{
    setOpen(!open)
  }

  useEffect(() => {
    if (isSuccess && data?.payload?.branches?.length) {
      const branches = data?.payload?.branches?.map((branch, index) => ({
        label: branch?.name,
        icon: <CompanyIcon />,
        hasTopSeparator: index === 0,
        hasBottomSeparator: data?.payload?.branches?.length ? index === data?.payload?.branches?.length - 1 : undefined,
        func: () => {
          setCookie('current-branch-obj', JSON.stringify({
            id: branch.id ?? '',
            name: branch.name ?? ''
          }));
        },
      }));

      const allMenuItems = menuItems;
      const logout = allMenuItems.splice(-1);
      setMenuItems([...allMenuItems, ...branches, ...logout]);
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
   [isSuccess]);

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
          <Button className="px-5 bg-[transparent] hover:bg-[transparent] text-foreground rotate-svg-child shadow-none" onClick={switchMenu}>
            {user?.name}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {menuItems.map((item, index) => (
            <Fragment key={index}>
            {item.hasTopSeparator ? <DropdownMenuSeparator/> : '' }
            <DropdownMenuItem onClick={()=>handleClose(item.func)}>
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          {item?.hasBottomSeparator && <DropdownMenuSeparator/>}
          </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDrop;
