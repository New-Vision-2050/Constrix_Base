"use client";

import React from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { useWorkPanelContext } from "@/modules/work-panel/context/WorkPanelContext";
import { useQuery } from "@tanstack/react-query";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { apiClient } from "@/config/axios-config";

interface Branch {
  id: string;
  name: string;
  address?: string;
}

export default function BranchesVerticalSection() {
  const t = useTranslations("WorkPanel");
  const { selectedBranchId, setSelectedBranchId } = useWorkPanelContext();

  console.log("BranchesVerticalSection rendered!");
  console.log("Current selectedBranchId:", selectedBranchId);

  const {
    data,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ["branches-list"],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<Branch[]>>(
        "/companies/company-profile/company-branches"
      );
      return response.data;
    },
  });

  const branches = data?.payload ?? [];

  const handleBranchClick = (branchId: string) => {
    console.log("Branch clicked:", branchId);
    setSelectedBranchId(branchId);
  };

  return (
    <Box className="w-64 bg-sidebar rounded-lg p-4">
      <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2">
        <MapPin size={20} />
        {t("branches")}
      </Typography>
      
      {isPending ? (
        <Typography variant="body2" className="text-muted-foreground">
          {t("loading")}
        </Typography>
      ) : isSuccess && branches.length > 0 ? (
        <List className="space-y-1">
          {branches.map((branch) => (
            <ListItem key={branch.id} disablePadding>
              <ListItemButton
                className={`rounded-md hover:bg-sidebar-accent ${
                  selectedBranchId === branch.id ? "bg-sidebar-accent" : ""
                }`}
                sx={{ borderRadius: 1 }}
                onClick={() => handleBranchClick(branch.id)}
              >
                <ListItemText
                  primary={branch.name}
                  secondary={branch.address}
                  primaryTypographyProps={{
                    variant: "body2",
                    className: "font-medium",
                  }}
                  secondaryTypographyProps={{
                    variant: "caption",
                    className: "text-muted-foreground",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" className="text-muted-foreground">
          {t("noBranches")}
        </Typography>
      )}
    </Box>
  );
}
