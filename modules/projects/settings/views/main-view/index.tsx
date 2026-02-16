"use client";

import { Checkbox, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import DetailsView from "./tab-views/details";
import ProjectTermsView from "./tab-views/project-terms";
import AttachmentsView from "./tab-views/attachments";
import ContractorsView from "./tab-views/contractors";
import TeamView from "./tab-views/team";
import WorkOrdersView from "./tab-views/work-orders";
import FinancialView from "./tab-views/financial";
import ContractManagementView from "./tab-views/contract-management";

const TabWithCheckbox = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  checked?: boolean;
  onClick: () => void;
}) => {
  return (
    <Tab
      value={value}
      sx={{ py: 0, opacity: 1 }}
      onClick={onClick}
      label={
        <div className="flex items-center">
          <Checkbox onClick={(e) => e.stopPropagation()} />
          <Typography variant="subtitle2">{label}</Typography>
        </div>
      }
    />
  );
};

const CurrentTabs: {
  name: string;
  value: string;
  component?: React.ReactNode;
}[] = [
  {
    name: "بيانات المشروع",
    value: "project-details",
    component: <DetailsView />,
  },
  {
    name: "بنود المشروع",
    value: "project-terms",
    component: <ProjectTermsView />,
  },
  {
    name: "المرفقات",
    value: "attachments",
    component: <AttachmentsView />,
  },
  {
    name: "المقاولين",
    value: "contractors",
    component: <ContractorsView />,
  },
  {
    name: "الكادر",
    value: "team",
    component: <TeamView />,
  },
  {
    name: "اوامر العمل",
    value: "work-orders",
    component: <WorkOrdersView />,
  },
  {
    name: "المالية",
    value: "financial",
    component: <FinancialView />,
  },
  {
    name: "ادارة العقد",
    value: "contract-management",
    component: <ContractManagementView />,
  },
];

function ProjectsSettingsMainView() {
  const [selectedTab, setSelectedTab] = useState<string>(CurrentTabs[0].value);
  return (
    <div className="px-8 space-y-4">
      <Paper>
        <Tabs value={selectedTab}>
          {CurrentTabs.map((tab) => (
            <TabWithCheckbox
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              label={tab.name}
              value={tab.value}
            />
          ))}
        </Tabs>
      </Paper>
      <Paper className="p-4">
        {CurrentTabs.find((tab) => tab.value === selectedTab)?.component}
      </Paper>
    </div>
  );
}

export default ProjectsSettingsMainView;
