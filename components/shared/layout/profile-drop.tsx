"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDown, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteCookie, getCookie } from "cookies-next"; // Ensure you have this package installed
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { AvatarGroup } from "../avatar-group";
import LogoutIcon from "@/public/icons/logout";
import { useRouter } from "@i18n/navigation";
import { useCurrentCompany } from "@/modules/company-profile/components/shared/company-header";
import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { setCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import { CURRENT_BRANCH_CHANGED_EVENT } from "@/constants/branch-events";
import CompanyIcon from "@/public/icons/company";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import { truncateString } from "@/utils/truncate-string";
import useUserProfileData from "@/modules/user-profile/hooks/useUserProfileData";
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
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { data: profileData } = useUserProfileData(user?.id);
  const userImageUrl = profileData?.image_url || user?.image_url;

  /** Synced from cookies + updated on branch click so the UI reacts without a full reload. */
  const [selectedBranch, setSelectedBranch] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const router = useRouter();
  const { data, isSuccess } = useCurrentCompany();
  const [open, setOpen] = useState<boolean>(false);
  const [branches, setBranches] = useState<menuItem[]>([]);

  useEffect(() => {
    const id = getCookie("current-branch-id");
    const raw = getCookie("current-branch-obj");
    if (!id) {
      setSelectedBranch(null);
      return;
    }
    if (raw) {
      try {
        const o = JSON.parse(raw as string) as { id?: string; name?: string };
        setSelectedBranch({
          id: String(o.id ?? id),
          name: String(o.name ?? ""),
        });
        return;
      } catch {
        /* fall through */
      }
    }
    setSelectedBranch({ id: String(id), name: "" });
  }, []);

  const selectBranchFromMenu = useCallback(
    (branch: { id: string; name: string }) => {
      const currentId = getCookie("current-branch-id");
      if (currentId != null && String(currentId) === String(branch.id)) {
        deleteCookie("current-branch-id");
        deleteCookie("current-branch-obj");
        setSelectedBranch(null);
      } else {
        setCookie("current-branch-id", String(branch.id));
        setCookie(
          "current-branch-obj",
          JSON.stringify({
            id: branch.id ?? "",
            name: branch.name ?? "",
          })
        );
        setSelectedBranch({
          id: String(branch.id),
          name: String(branch.name ?? ""),
        });
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(CURRENT_BRANCH_CHANGED_EVENT));
      }
      void queryClient.invalidateQueries({ queryKey: ["widgets-data"] });
      void queryClient.invalidateQueries({ queryKey: ["company-employees"] });
      void queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          typeof q.queryKey[0] === "string" &&
          q.queryKey[0].startsWith("widgets-"),
      });
    },
    [queryClient]
  );

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

  useEffect(() => {
    if (isSuccess && data?.payload?.branches?.length) {
      const _branches = data?.payload?.branches?.map((branch, index) => ({
        id: branch.id,
        label: branch?.name,
        icon: <CompanyIcon />,
        hasTopSeparator: index === 0,
        hasBottomSeparator: data?.payload?.branches?.length
          ? index === data?.payload?.branches?.length - 1
          : undefined,
        func: () =>
          selectBranchFromMenu({
            id: String(branch.id),
            name: branch.name ?? "",
          }),
      }));
      setBranches(_branches);
    }
  }, [isSuccess, data?.payload?.branches, selectBranchFromMenu]);

  return (
    <div className="flex justify-center items-center">
      {user?.name && (
        <AvatarGroup
          fullName={user?.name}
          alt={user?.name}
          src={userImageUrl}
        />
      )}
      <DropdownMenu dir="rtl" open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="px-5 bg-[transparent] hover:bg-[transparent] text-foreground rotate-svg-child shadow-none">
            {user?.name}
            {selectedBranch?.name && (
              <span className="text-xs text-gray-500">
                ({truncateString(selectedBranch.name, 12)})
              </span>
            )}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {mainMenuItems.map((item, index) => (
            <Fragment key={index}>
              {item.hasTopSeparator ? <DropdownMenuSeparator /> : ""}
              <DropdownMenuItem
                onClick={() => handleClose(item.func)}
                className={`${selectedBranch?.id === item.id && "bg-sidebar"}`}
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
                <DropdownMenuSubTrigger className="bg-sidebar flex items-center justify-between px-5 gap-2">
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
                      className={`${
                        selectedBranch?.id === branch.id && "bg-sidebar"
                      }`}
                    >
                      {branch.icon}
                      {branch.label}
                      {selectedBranch?.id == branch.id && (
                        <CheckIcon className="bg-green-600" />
                      )}
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
                className="bg-sidebar"
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
