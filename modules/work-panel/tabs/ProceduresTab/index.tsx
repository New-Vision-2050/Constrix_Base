"use client";

import React from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useWorkPanelContext } from "../../context/WorkPanelContext";
import { GetProceduresSubTabs } from "./constants/ProceduresSubTabs";
import BranchesVerticalSection from "../../components/BranchesVerticalSection";

export default function ProceduresTab() {
  const { tab2, setTab2 } = useWorkPanelContext();
  const t = useTranslations("WorkPanel");

  return (
    <Box className="flex gap-6 mt-6">
      {/* Vertical Section - Branches */}
      <BranchesVerticalSection />

      {/* Main Content with Sub Tabs */}
      <Box className="flex-1">
        <HorizontalTabs
          bgStyleApproach
          onTabClick={(tab) => {
            setTab2(tab.id);
          }}
          list={GetProceduresSubTabs(t)}
          value={tab2 || undefined}
          defaultValue={tab2 !== null ? tab2 : undefined}
        />
      </Box>
    </Box>
  );
}

