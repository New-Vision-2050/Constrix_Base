"use client";

import { Checkbox, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState, useCallback } from "react";
import { CURRENT_TABS } from "../../constants/current-tabs";
import RootLevelTabs from "./levels/root-level-tabs";
import SecondLevelTabs from "./levels/second-level-tabs";
import SchemaLevelTabs from "./levels/schema-level-tabs";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";

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

function ProjectsSettingsMainView() {
  const [selectedTab, setSelectedTab] = useState<string>(CURRENT_TABS[0].value);
  const [selectedRoot, setSelectedRoot] = useState<PRJ_ProjectType | null>(
    null,
  );
  const [selectedSecondLevel, setSelectedSecondLevel] =
    useState<PRJ_ProjectType | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<PRJ_ProjectType | null>(
    null,
  );

  const handleSelectRoot = useCallback((root: PRJ_ProjectType) => {
    setSelectedRoot(root);
    setSelectedSecondLevel(null);
    setSelectedSchema(null);
  }, []);

  const handleSelectSecondLevel = useCallback((item: PRJ_ProjectType) => {
    setSelectedSecondLevel(item);
    setSelectedSchema(null);
  }, []);

  const handleSelectSchema = useCallback((item: PRJ_ProjectType) => {
    setSelectedSchema(item);
  }, []);

  return (
    <div className="px-8 space-y-4">
      <RootLevelTabs
        selectedRootId={selectedRoot?.id ?? null}
        onSelectRoot={handleSelectRoot}
      >
        <SecondLevelTabs
          parentId={selectedRoot?.id ?? null}
          selectedSecondLevelId={selectedSecondLevel?.id ?? null}
          onSelectSecondLevel={handleSelectSecondLevel}
        >
          <SchemaLevelTabs
            parentId={selectedSecondLevel?.id ?? null}
            selectedSchemaId={selectedSchema?.id ?? null}
            onSelectSchema={handleSelectSchema}
          >
            <Paper sx={{ mb: 2 }}>
              <Tabs value={selectedTab}>
                {CURRENT_TABS.map((tab) => (
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
              {CURRENT_TABS.find((tab) => tab.value === selectedTab)?.component}
            </Paper>
          </SchemaLevelTabs>
        </SecondLevelTabs>
      </RootLevelTabs>
    </div>
  );
}

export default ProjectsSettingsMainView;
