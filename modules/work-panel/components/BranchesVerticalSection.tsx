"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { MapPin, CircleCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  translationKey: string;
}

const branchesConfig: Branch[] = [
  { id: "all-branches", translationKey: "allBranches" },
  { id: "jeddah-branch", translationKey: "jeddahBranch" },
  { id: "riyadh-branch", translationKey: "riyadhBranch" },
  { id: "qassim-branch", translationKey: "qassimBranch" },
];

export default function BranchesVerticalSection() {
  const [selectedBranch, setSelectedBranch] = useState<string>("all-branches");
  const t = useTranslations("WorkPanel");

  const handleBranchClick = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  return (
    <Box className="w-[200px] p-4 m-2 flex flex-col gap-6 bg-sidebar rounded-md shadow-md">
      {branchesConfig.map((branch) => {
        const isActive = selectedBranch === branch.id;

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
                {t(branch.translationKey)}
              </Typography>
            </Box>
            {isActive && <CircleCheckIcon color="green" />}
          </Box>
        );
      })}
    </Box>
  );
}

