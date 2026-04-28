"use client";

import { Box, Checkbox, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  fetchManagementHierarchyOptions,
  type ManagementHierarchyOption,
} from "@/utils/fetchDropdownOptions";
import { baseURL } from "@/config/axios-config";
import StagesView from "./StagesView";

interface OuterTab {
  id: number;
  name: string;
  type: string;
}

const OUTER_TABS: OuterTab[] = [
  { id: 0, name: "clientRequests", type: "client_request" },
  { id: 1, name: "contracts", type: "contract" },
  { id: 2, name: "priceOffers", type: "price_offer" },
  { id: 3, name: "meetings", type: "meeting" },
];

const WORK_PLAN_TAB = "work_plan";

export default function SubTypeTabs() {
  const t = useTranslations("CRMSettingsModule.proceduresSettings.subTabs");

  const [selectedOuter, setSelectedOuter] = useState<number>(0);
  const [selectedInner, setSelectedInner] = useState<string>(WORK_PLAN_TAB);

  const [branchUsesWorkPlan, setBranchUsesWorkPlan] = useState<
    Record<string, boolean>
  >({});

  const { data: branches = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["branches"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=branch`,
      ),
  });

  useEffect(() => {
    if (branches.length > 0) {
      setBranchUsesWorkPlan(
        Object.fromEntries(branches.map((b) => [b.id, true])),
      );
    }
  }, [branches]);

  const getCurrentTabType = () =>
    OUTER_TABS.find((tab) => tab.id === selectedOuter)?.type ??
    "client_request";

  const handleBranchCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>,
    branchId: string,
  ) => {
    e.stopPropagation();
    setBranchUsesWorkPlan((prev) => ({
      ...prev,
      [branchId]: e.target.checked,
    }));
  };

  // Show StagesView when: on the خطة العمل tab, OR on a branch that has custom procedures (checkbox UNCHECKED)
  const showStagesView =
    selectedInner === WORK_PLAN_TAB ||
    branchUsesWorkPlan[selectedInner] === false;

  return (
    <div className="space-y-4">
      {/* ── Outer tabs (type) ── */}
      <Paper>
        <Tabs
          value={selectedOuter}
          onChange={(_, val: number) => {
            setSelectedOuter(val);
            setSelectedInner(WORK_PLAN_TAB);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {OUTER_TABS.map((tab) => (
            <Tab key={tab.id} value={tab.id} label={t(tab.name)} />
          ))}
        </Tabs>
      </Paper>

      {/* ── Inner tabs (خطة العمل + branches) ── */}
      <Paper>
        <Tabs
          value={selectedInner}
          onChange={(_, val: string) => setSelectedInner(val)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value={WORK_PLAN_TAB} label="خطة العمل" />
          {branches.map((branch) => (
            <Tab
              key={branch.id}
              value={branch.id}
              label={
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  component="span"
                >
                  <Checkbox
                    checked={branchUsesWorkPlan[branch.id] ?? true}
                    onChange={(e) => handleBranchCheckbox(e, branch.id)}
                    onClick={(e) => e.stopPropagation()}
                    size="small"
                    sx={{ p: 0 }}
                  />
                  <span>{branch.name}</span>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* ── Content ── */}
      {showStagesView ? (
        <StagesView currentTabType={getCurrentTabType()} />
      ) : (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Checkbox
            checked={branchUsesWorkPlan[selectedInner] ?? true}
            onChange={(e) => handleBranchCheckbox(e, selectedInner)}
          />

          <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
            {" "}
            سيتم اخذ الاجراءات من خطة العمل
          </Typography>
        </Paper>
      )}
    </div>
  );
}
