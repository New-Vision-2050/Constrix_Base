"use client";

import {
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  MenuItem,
  MenuList,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectTypeSchema } from "@/types/api/projects/project-type-schema";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import AddSubProjectTypeDialog from "../../../components/dialogs/add-sub-project-type";
import { useProjectSettingsTabs } from "../../../constants/current-tabs";
import DetailsView from "../tab-views/details";
import ProjectTermsView from "../tab-views/project-terms";
import AttachmentsView from "../tab-views/attachments";
import ContractorsView from "../tab-views/contractors";
import TeamView from "../tab-views/team";
import WorkOrdersView from "../tab-views/work-orders";
import FinancialView from "../tab-views/financial";
import ContractManagementView from "../tab-views/contract-management";

function renderTabContent(tab: string) {
  switch (tab) {
    case "project-details":
      return <DetailsView />;
    case "project-terms":
      return <ProjectTermsView />;
    case "attachments":
      return <AttachmentsView />;
    case "contractors":
      return <ContractorsView />;
    case "team":
      return <TeamView />;
    case "work-orders":
      return <WorkOrdersView />;
    case "financial":
      return <FinancialView />;
    case "contract-management":
      return <ContractManagementView />;
    default:
      return null;
  }
}

interface SchemaLevelTabsProps {
  parentId: number;
}

const TabWithCheckbox = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) => (
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

export default function SchemaLevelTabs({ parentId }: SchemaLevelTabsProps) {
  const t = useTranslations("Projects.Settings.projectTypes");
  const allTabs = useProjectSettingsTabs();

  const [selectedSchema, setSelectedSchema] =
    useState<PRJ_ProjectTypeSchema | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const thirdLevelQuery = useQuery({
    queryKey: ["third-level-project-types", parentId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getDirectChildren(parentId);
      return response.data.payload ?? [];
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["project-types", "schemas", parentId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getProjectTypeSchemas(parentId);
      return response.data.payload ?? [];
    },
  });

  const schemas = useMemo(() => data ?? [], [data]);
  const filteredTabs = useMemo(
    () =>
      allTabs.filter((tab) =>
        schemas.some((schema) => schema.id === tab.schema_id),
      ),
    [schemas, allTabs],
  );

  useEffect(() => {
    if (schemas.length > 0 && !selectedSchema) {
      setSelectedSchema(schemas[0]);
    }
  }, [schemas, selectedSchema]);

  useEffect(() => {
    if (isLoading || filteredTabs.length === 0) return;
    const isValid = filteredTabs.some((tab) => tab.value === selectedTab);
    if (!isValid) {
      setSelectedTab(filteredTabs[0].value);
    }
  }, [data, isLoading, filteredTabs, selectedTab]);

  return (
    <div className="space-y-4">
      <Grid container spacing={2}>
        <Grid size={3}>
          {thirdLevelQuery.isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          )}
          {!thirdLevelQuery.isLoading && (
            <Paper>
              <MenuList>
                {thirdLevelQuery.data?.map((schema) => (
                  <MenuItem
                    selected={selectedSchema?.id === schema.id}
                    onClick={() => setSelectedSchema(schema)}
                    key={schema.id}
                    value={schema.id}
                    sx={{ px: 2, py: 1, borderRadius: 1 }}
                  >
                    <Typography variant="subtitle1" fontWeight={500}>
                      {schema.name}
                    </Typography>
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={() => setAddDialogOpen(true)}
                  sx={{ px: 2, py: 1, borderRadius: 1, color: "primary.main" }}
                >
                  <AddIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={500}>
                    {t("add")}
                  </Typography>
                </MenuItem>
              </MenuList>
            </Paper>
          )}
          <AddSubProjectTypeDialog
            open={addDialogOpen}
            onClose={() => setAddDialogOpen(false)}
            onSuccess={() => refetch()}
            parentId={parentId}
          />
        </Grid>
        <Grid size={9}>
          {selectedSchema && !isLoading && selectedTab && data && (
            <div className="space-y-4">
              <Paper>
                <Tabs value={selectedTab}>
                  {filteredTabs.map((tab) => (
                    <TabWithCheckbox
                      key={tab.value}
                      onClick={() => setSelectedTab(tab.value)}
                      label={tab.name}
                      value={tab.value}
                    />
                  ))}
                </Tabs>
              </Paper>
              <Paper className="p-4">{renderTabContent(selectedTab)}</Paper>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
