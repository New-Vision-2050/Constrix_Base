"use client";

import {
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { CheckIcon, ChevronDown, UserIcon, Mail, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteCookie, getCookie } from "cookies-next";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { AvatarGroup } from "../avatar-group";
import LogoutIcon from "@/public/icons/logout";
import { Link, useRouter } from "@i18n/navigation";
import { useCurrentCompany } from "@/modules/company-profile/components/shared/company-header";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import { CURRENT_BRANCH_CHANGED_EVENT } from "@/constants/branch-events";
import CompanyIcon from "@/public/icons/company";
import { truncateString } from "@/utils/truncate-string";
import useUserProfileData from "@/modules/user-profile/hooks/useUserProfileData";
import { useIsRtl } from "@/hooks/use-is-rtl";

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
  const isRtl = useIsRtl();

  /** Synced from cookies + updated on branch click so the UI reacts without a full reload. */
  const [selectedBranch, setSelectedBranch] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const router = useRouter();
  const { data, isSuccess } = useCurrentCompany();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [branchesAnchorEl, setBranchesAnchorEl] = useState<null | HTMLElement>(
    null,
  );
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
          }),
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
      setBranchesAnchorEl(null);
    },
    [queryClient],
  );

  // main items without branches and logout
  const logoutMenuItem: menuItem = {
    label: t("Logout"),
    icon: <LogoutIcon />,
    func: () => {
      deleteCookie("new-vision-token");
      router?.push("/");
    },
  };

  useEffect(() => {
    if (isSuccess && data?.payload?.branches?.length) {
      const _branches = data?.payload?.branches?.map((branch) => ({
        id: branch.id,
        label: branch?.name,
        icon: <CompanyIcon />,
        func: () =>
          selectBranchFromMenu({
            id: String(branch.id),
            name: branch.name ?? "",
          }),
      }));
      setBranches(_branches);
    }
  }, [isSuccess, data?.payload?.branches, selectBranchFromMenu]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setBranchesAnchorEl(null);
  };

  const handleBranchMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setBranchesAnchorEl(event.currentTarget);
  };

  const handleBranchMenuClose = () => {
    setBranchesAnchorEl(null);
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Button
        onClick={handleMenuOpen}
        endIcon={<ChevronDown size={18} />}
        startIcon={
          user?.name && (
            <Avatar
              sx={{ height: "32px", width: "32px" }}
              alt={user?.name}
              src={userImageUrl}
            />
          )
        }
        sx={{
          px: 2.5,
          backgroundColor: "transparent",
          color: "inherit",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        {user?.name}
        {selectedBranch?.name && (
          <Box
            component="span"
            sx={{
              fontSize: "0.75rem",
              color: "text.secondary",
            }}
          >
            ({truncateString(selectedBranch.name, 12)})
          </Box>
        )}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Profile */}

        <MenuItem
          component={Link}
          href="/user-profile"
          onClick={handleMenuClose}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <UserIcon size={18} />
          </ListItemIcon>
          <ListItemText>{t("profile")}</ListItemText>
        </MenuItem>

        {/* Change Email */}
        <MenuItem
          component={Link}
          href="/user-profile?tab1=edit-mode-tabs-contract&tab2=user-contract-tab-personal-data"
          onClick={handleMenuClose}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Mail size={18} />
          </ListItemIcon>
          <ListItemText>{t("changeMail")}</ListItemText>
        </MenuItem>

        {/* Change Password */}

        <MenuItem
          component={Link}
          href="/user-profile?tab1=edit-mode-tabs-logs&tab2=user-actions-tabs-user-status&verticalSection=user-status-password"
          onClick={handleMenuClose}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Lock size={18} />
          </ListItemIcon>
          <ListItemText>{t("changePassword")}</ListItemText>
        </MenuItem>

        <Divider />

        {/* Branches Submenu */}
        {branches.length > 0 && (
          <MenuItem
            // onMouseEnter={handleBranchMenuOpen}
            onClick={handleBranchMenuOpen}
          >
            <ListItemIcon>
              <CompanyIcon />
            </ListItemIcon>
            <ListItemText>{t("branches")}</ListItemText>
            <ListItemIcon>
              <ChevronDown />
            </ListItemIcon>
          </MenuItem>
        )}

        {/* Logout Item */}
        {logoutMenuItem && [
          <Divider key="div-logout" />,
          <MenuItem onClick={logoutMenuItem.func} key="MenuItem-logout">
            <ListItemIcon>{logoutMenuItem.icon}</ListItemIcon>
            <ListItemText>{logoutMenuItem.label}</ListItemText>
          </MenuItem>,
        ]}
      </Menu>
      <Menu
        anchorEl={branchesAnchorEl}
        open={Boolean(branchesAnchorEl)}
        onClose={handleBranchMenuClose}
        slotProps={{
          paper: {
            onMouseLeave: handleBranchMenuClose,
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {branches.map((branch) => (
          <MenuItem
            key={branch.id}
            onClick={() =>
              selectBranchFromMenu({
                id: String(branch.id),
                name: String(branch.label ?? ""),
              })
            }
            sx={{
              backgroundColor:
                selectedBranch?.id === branch.id
                  ? "rgba(0, 0, 0, 0.04)"
                  : "transparent",
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>{branch.icon}</ListItemIcon>
            <ListItemText>{branch.label}</ListItemText>
            {selectedBranch?.id === branch.id && (
              <CheckIcon
                size={16}
                style={{ marginLeft: "auto", color: "#16a34a" }}
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ProfileDrop;
