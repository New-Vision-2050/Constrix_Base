"use client";

import {
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import { Settings } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddSubProjectTypeDialog from "../../../../components/dialogs/add-sub-project-type";
import EditSubProjectTypeDialog from "../../../../components/dialogs/edit-sub-project-type";
import {
  TAB_SCHEMA_ID_MAP,
  useProjectSettingsTabs,
} from "../../../../constants/current-tabs";
import DetailsView from "../details";
import ProjectTermsView from "../project-terms";
import AttachmentsView from "../attachments";
import ContractorsView from "../contractors";
import TeamView from "../team";
import WorkOrdersView from "../work-orders";
import FinancialView from "../financial";
import ContractManagementView from "../contract-management";
import { SettingsTabItemProps } from "../../types";

function renderTabContent(tab: string, props: SettingsTabItemProps) {
  switch (tab) {
    case "project-details":
      return <DetailsView {...props} />;
    case "project-terms":
      return <ProjectTermsView {...props} />;
    case "attachments":
      return <AttachmentsView {...props} />;
    case "contractors":
      return <ContractorsView {...props} />;
    case "team":
      return <TeamView {...props} />;
    case "work-orders":
      return <WorkOrdersView />;
    case "financial":
      return <FinancialView {...props} />;
    case "contract-management":
      return <ContractManagementView {...props} />;
    default:
      return null;
  }
}

interface SchemaLevelTabsProps {
  firstLevelId: number;
  parentId: number;
  parentProjectType: PRJ_ProjectType;
  onParentUpdate?: () => void;
}

function EditSubProjectTypeDialogTrigger({
  item,
  parentId,
  onSuccess,
}: {
  item: PRJ_ProjectType;
  parentId: number;
  onSuccess: () => void;
}) {
  return (
    <DialogTrigger
      component={EditSubProjectTypeDialog}
      dialogProps={{
        parentId,
        projectType: item,
        onSuccess,
      }}
      render={({ onOpen }) => (
        <IconButton
          component="div"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          color="primary"
          size="small"
          sx={{ cursor: "pointer" }}
        >
          <Settings sx={{ fontSize: 18 }} className="text-gray-500 cursor-pointer" />
        </IconButton>
      )}
    />
  );
}

const TabWithCheckbox = ({
  label,
  value,
  checked,
  onClick,
  onCheckboxChange,
  disabled,
}: {
  label: string;
  value: string;
  checked: boolean;
  onClick: () => void;
  onCheckboxChange: (e: React.MouseEvent) => void;
  disabled?: boolean;
}) => (
  <Tab
    value={value}
    sx={{ py: 0, opacity: 1 }}
    onClick={onClick}
    label={
      <div className="flex items-center">
        <Checkbox
          checked={checked}
          onClick={onCheckboxChange}
          disabled={disabled}
        />
        <Typography variant="subtitle2">{label}</Typography>
      </div>
    }
  />
);

export default function SchemaLevelTabs({
  firstLevelId,
  parentId,
  parentProjectType,
  onParentUpdate,
}: SchemaLevelTabsProps) {
  const t = useTranslations("Projects.Settings.projectTypes");
  const allTabs = useProjectSettingsTabs();
  const queryClient = useQueryClient();

  const [selectedSchema, setSelectedSchema] =
    useState<PRJ_ProjectType | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [schemaUpdating, setSchemaUpdating] = useState(false);

  const thirdLevelQuery = useQuery({
    queryKey: ["third-level-project-types", parentId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getDirectChildren(parentId);
      return response.data.payload ?? [];
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["project-types", "schemas", parentId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getProjectTypeSchemasV2(parentId);
      return response.data.payload ?? [];
    },
  });

  const schemas = useMemo(() => data ?? [], [data]);
  const referenceId = parentProjectType.reference_project_type_id;

  const { data: referenceSchemasData } = useQuery({
    queryKey: ["project-types", "schemas", referenceId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getProjectTypeSchemas(
        referenceId!,
      );
      return response.data.payload ?? [];
    },
    enabled: !!referenceId,
  });

  const referenceSchemas = useMemo(
    () => referenceSchemasData ?? [],
    [referenceSchemasData],
  );

  const availableTabs = useMemo(
    () =>
      referenceSchemas.length > 0
        ? allTabs.filter((tab) =>
            referenceSchemas.some((schema) => schema.id === tab.schema_id),
          )
        : allTabs,
    [referenceSchemas, allTabs],
  );

  const filteredTabs = useMemo(
    () =>
      allTabs.filter((tab) =>
        schemas.some((schema) => schema.id === tab.schema_id),
      ),
    [schemas, allTabs],
  );

  const selectedSchemaIds = useMemo(
    () => new Set(schemas.map((s) => s.id)),
    [schemas],
  );

  const handleSchemaToggle = async (tabValue: string) => {
    const schemaId = TAB_SCHEMA_ID_MAP[tabValue];
    if (schemaId == null) return;
    const isCurrentlySelected = selectedSchemaIds.has(schemaId);
    const newSchemaIds = isCurrentlySelected
      ? schemas.filter((s) => s.id !== schemaId).map((s) => s.id)
      : [...schemas.map((s) => s.id), schemaId]
          .filter((id, i, arr) => arr.indexOf(id) === i)
          .sort((a, b) => a - b);

    setSchemaUpdating(true);
    try {
      await ProjectTypesApi.updateSecondLevelProjectType(parentId, {
        name: parentProjectType.name,
        icon: parentProjectType.icon,
        reference_project_type_id:
          parentProjectType.reference_project_type_id ?? null,
        schema_ids: newSchemaIds,
        is_active: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["project-types", "schemas", parentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-types", "children", firstLevelId],
      });
      onParentUpdate?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message ?? "Failed to update project schemas",
      );
    } finally {
      setSchemaUpdating(false);
    }
  };

  useEffect(() => {
    const items = thirdLevelQuery.data ?? [];
    if (items.length === 0) return;
    const isValid =
      selectedSchema && items.some((item) => item.id === selectedSchema.id);
    if (!isValid) {
      setSelectedSchema(items[0]);
    } else if (selectedSchema) {
      const updated = items.find((item) => item.id === selectedSchema.id);
      if (updated && updated !== selectedSchema) {
        setSelectedSchema(updated);
      }
    }
  }, [thirdLevelQuery.data, selectedSchema]);

  useEffect(() => {
    if (isLoading || filteredTabs.length === 0) return;
    const isValid = filteredTabs.some((tab) => tab.value === selectedTab);
    if (!isValid) {
      setSelectedTab(filteredTabs[0]?.value ?? null);
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
            <Paper sx={{ maxHeight: "70vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <MenuList sx={{ overflowY: "auto", flex: 1, minHeight: 0 }}>
                {thirdLevelQuery.data?.map((item) => (
                  <MenuItem
                    selected={selectedSchema?.id === item.id}
                    onClick={() => setSelectedSchema(item)}
                    key={item.id}
                    value={item.id}
                    sx={{ px: 2, py: 1, borderRadius: 1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={500}>
                        {item.name}
                      </Typography>
                      <EditSubProjectTypeDialogTrigger
                        item={item}
                        parentId={parentId}
                        onSuccess={() => {}}
                      />
                    </Box>
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
            parentId={parentId}
          />
        </Grid>
        <Grid size={9}>
          {selectedSchema && !isLoading && selectedTab && data && (
            <div className="space-y-4">
              <Paper>
                <Tabs value={selectedTab}>
                  {availableTabs.map((tab) => (
                    <TabWithCheckbox
                      key={tab.value}
                      onClick={() => setSelectedTab(tab.value)}
                      label={tab.name}
                      value={tab.value}
                      checked={
                        tab.schema_id != null &&
                        selectedSchemaIds.has(tab.schema_id)
                      }
                      onCheckboxChange={(e) => {
                        e.stopPropagation();
                        handleSchemaToggle(tab.value);
                      }}
                      disabled={schemaUpdating}
                    />
                  ))}
                </Tabs>
              </Paper>
              <Paper className="p-4">
                {renderTabContent(selectedTab, {
                  firstLevelId,
                  secondLevelId: parentId,
                  thirdLevelId: selectedSchema.id,
                })}
              </Paper>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
