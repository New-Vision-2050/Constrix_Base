"use client";

import { Drawer, IconButton, Box } from "@mui/material";
import { X } from "lucide-react";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { useLocale } from "next-intl";
import { SidebarContentWrapper } from "./sidebar-content";
import { SidebarProvider } from "@/components/ui/sidebar";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  name?: string;
  mainLogo?: string;
  userTypes: UserRoleType[];
}

export function MobileDrawer({
  open,
  onClose,
  name,
  mainLogo,
  userTypes,
}: MobileDrawerProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <Drawer
      anchor={isRtl ? "right" : "left"}
      open={open}
      onClose={onClose}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          border: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: isRtl ? "auto" : 8,
            left: isRtl ? 8 : "auto",
            zIndex: 1300,
            color: "inherit",
          }}
        >
          <X size={20} />
        </IconButton>
        <SidebarProvider defaultOpen={true}>
          <SidebarContentWrapper
            name={name}
            mainLogo={mainLogo}
            userTypes={userTypes}
            showHeader={true}
            showFooter={true}
          />
        </SidebarProvider>
      </Box>
    </Drawer>
  );
}
