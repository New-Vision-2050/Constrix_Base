"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { MapPin, CircleCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkPanelContext } from "../context/WorkPanelContext";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { Branch } from "@/modules/company-profile/types/company";

export default function BranchesVerticalSection() {
  const { verticalSection, setVerticalSection } = useWorkPanelContext();
  const t = useTranslations("WorkPanel");

  const { data, isPending } = useQuery({
    queryKey: ["company-branches"],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<Branch[]>>(
        "/companies/company-profile/company-branches"
      );
      return response.data;
    },
  });

  const branches = data?.payload ?? [];

  const handleBranchClick = (branchId: string) => {
    setVerticalSection(branchId);
  };

  return (
    <Box className="w-[200px] p-4 m-2 flex flex-col gap-6 bg-sidebar rounded-md shadow-md">
      {/* All Branches option */}
      <Box
        onClick={() => handleBranchClick("all-branches")}
        className={cn(
          "w-full flex items-center justify-between cursor-pointer",
          verticalSection === "all-branches" ? "" : "text-gray-400"
        )}
      >
        <Box className="flex gap-2">
          <MapPin className="w-5 h-5" />
          <Typography className="text-md font-semibold">
            {t("allBranches")}
          </Typography>
        </Box>
        {verticalSection === "all-branches" && (
          <CircleCheckIcon color="green" />
        )}
      </Box>

      {/* Dynamic branches from API */}
      {isPending ? (
        <Typography className="text-sm text-gray-400">
          {t("loading")}
        </Typography>
      ) : (
        branches.map((branch) => {
          const isActive = verticalSection === branch.id;

          return (
            <Box
              key={branch.id}
              onClick={() => handleBranchClick(branch.id)}
              className={cn(
                "w-full flex items-center justify-between cursor-pointer",
                isActive ? "" : "text-gray-400"
              )}
            >
              <Box className="flex gap-2">
                <MapPin className="w-5 h-5" />
                <Typography className="text-md font-semibold">
                  {branch.name}
                </Typography>
              </Box>
              {isActive && <CircleCheckIcon color="green" />}
            </Box>
          );
        })
      )}
    </Box>
  );
}
