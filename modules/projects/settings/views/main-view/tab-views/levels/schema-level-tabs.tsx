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
import Can from "@/lib/permissions/client/Can";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useProjectSettingsTabs } from "../../../../constants/current-tabs";
import {
  BULK_TOGGLE_SUPPORTED_TABS,
  STAKEHOLDER_GROUP_TAB_VALUES,
  bulkToggleTabSettings,
  getStakeholderGroupBulkState,
  getTabBulkCheckboxState,
  isStakeholderGroupFullyEnabled,
  isTabFullyEnabled,
} from "./schema-tab-bulk-settings";
import DetailsView from "../details";
import ProjectTermsView from "../project-terms";
import AttachmentsView from "../attachments";
import ContractorsView from "../contractors";
import TeamView from "../team";
import RolesAndPermissionsView from "../roles-and-permissions";
import ProjectSharingView from "../project-sharing";
import DocumentCycleView from "../document-cycle";
import WorkOrdersView from "../work-orders";
import FinancialView from "../financial";
import ContractManagementView from "../contract-management";
import { SettingsTabItemProps } from "../../types";
import type { ProjectSettingsTab } from "../../../../constants/current-tabs";
import { APP_ICONS } from "@/constants/icons";

function isStakeholderSchemaTab(tab: ProjectSettingsTab): boolean {
  return (STAKEHOLDER_GROUP_TAB_VALUES as readonly string[]).includes(
    tab.value,
  );
}

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
    case "roles-and-permissions":
      return <RolesAndPermissionsView {...props} />;
    case "project-sharing":
      return <ProjectSharingView {...props} />;
    case "document-cycle":
      return <DocumentCycleView {...props} />;
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
    <Can check={[PERMISSIONS.projectType.update]}>
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
            <Settings
              sx={{ fontSize: 18 }}
              className="text-gray-500 cursor-pointer"
            />
          </IconButton>
        )}
      />
    </Can>
  );
}

const STAKEHOLDERS_GROUP_ID = "stakeholders-group";

const TabWithCheckbox = ({
  label,
  value,
  checked,
  indeterminate,
  hideCheckbox,
  onClick,
  onCheckboxChange,
  disabled,
}: {
  label: string;
  value: string;
  checked: boolean;
  indeterminate?: boolean;
  hideCheckbox?: boolean;
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
        {!hideCheckbox && (
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            onClick={onCheckboxChange}
            disabled={disabled}
          />
        )}
        <Typography variant="subtitle2">{label}</Typography>
      </div>
    }
  />
);

export default function SchemaLevelTabs({
  firstLevelId,
  parentId,
}: SchemaLevelTabsProps) {
  const t = useTranslations("Projects.Settings.projectTypes");
  const allTabs = useProjectSettingsTabs();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canUpdateProjectType = can([PERMISSIONS.projectType.update]);

  const [selectedSchema, setSelectedSchema] = useState<PRJ_ProjectType | null>(
    null,
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [bulkTogglesUpdating, setBulkTogglesUpdating] = useState(false);

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

  const thirdLevelId = selectedSchema?.id ?? null;

  const dataSettingsQuery = useQuery({
    queryKey: ["project-type-data-settings", thirdLevelId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getDataSettings(thirdLevelId!);
      return response.data.payload;
    },
    enabled:
      thirdLevelId != null &&
      filteredTabs.some((t) => t.value === "project-details"),
  });

  const archiveLibrarySettingsQuery = useQuery({
    queryKey: ["archive-library-settings", thirdLevelId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getArchiveLibrarySettings(
        thirdLevelId!,
      );
      return response.data.payload;
    },
    enabled:
      thirdLevelId != null &&
      filteredTabs.some((t) => t.value === "attachments"),
  });

  const contractorSettingsQuery = useQuery({
    queryKey: ["contractor-contract-settings", thirdLevelId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getContractorContractSettings(
        thirdLevelId!,
      );
      return response.data.payload;
    },
    enabled:
      thirdLevelId != null &&
      filteredTabs.some((t) => t.value === "contractors"),
  });

  const employeeSettingsQuery = useQuery({
    queryKey: ["employee-contract-settings", thirdLevelId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getEmployeeContractSettings(
        thirdLevelId!,
      );
      return response.data.payload;
    },
    enabled:
      thirdLevelId != null && filteredTabs.some((t) => t.value === "team"),
  });

  const attachmentCycleSettingsQuery = useQuery({
    queryKey: ["attachment-cycle-settings", thirdLevelId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getAttachmentCycleSettings(
        thirdLevelId!,
      );
      return response.data.payload;
    },
    enabled:
      thirdLevelId != null &&
      filteredTabs.some((t) => t.value === "document-cycle"),
  });

  const rolesAndPermissionsSettingsQuery = useQuery({
    queryKey: ["roles-and-permissions-settings", thirdLevelId],
    queryFn: async () => {
      try {
        const response = await ProjectTypesApi.getRolesAndPermissionsSettings(
          thirdLevelId!,
        );
        return response.data.payload;
      } catch (error) {
        console.error("Failed to fetch roles-and-permissions settings:", error);
        return null;
      }
    },
    enabled:
      thirdLevelId != null &&
      filteredTabs.some((t) => t.value === "roles-and-permissions"),
    retry: false,
  });

  const projectSharingSettingsQuery = useQuery({
    queryKey: ["project-sharing-settings", thirdLevelId],
    queryFn: async () => {
      try {
        const response = await ProjectTypesApi.getProjectSharingSettings(
          thirdLevelId!,
        );
        return response.data.payload;
      } catch (error) {
        console.error("Failed to fetch project-sharing settings:", error);
        return null;
      }
    },
    enabled:
      thirdLevelId != null &&
      filteredTabs.some((t) => t.value === "project-sharing"),
    retry: false,
  });

  const bulkSettingsData = useMemo(
    () => ({
      dataSettings: dataSettingsQuery.data,
      archiveLibrary: archiveLibrarySettingsQuery.data,
      contractor: contractorSettingsQuery.data,
      employee: employeeSettingsQuery.data,
      attachmentCycle: attachmentCycleSettingsQuery.data,
      rolesAndPermissions: rolesAndPermissionsSettingsQuery.data,
      projectSharing: projectSharingSettingsQuery.data,
    }),
    [
      dataSettingsQuery.data,
      archiveLibrarySettingsQuery.data,
      contractorSettingsQuery.data,
      employeeSettingsQuery.data,
      attachmentCycleSettingsQuery.data,
      rolesAndPermissionsSettingsQuery.data,
      projectSharingSettingsQuery.data,
    ],
  );

  const isBulkTabDataLoading = (tabValue: string) => {
    switch (tabValue) {
      case "project-details":
        return dataSettingsQuery.isLoading;
      case "attachments":
        return archiveLibrarySettingsQuery.isLoading;
      case "contractors":
        return contractorSettingsQuery.isLoading;
      case "team":
        return employeeSettingsQuery.isLoading;
      case "document-cycle":
        return attachmentCycleSettingsQuery.isLoading;
      case "roles-and-permissions":
        return rolesAndPermissionsSettingsQuery.isLoading;
      case "project-sharing":
        return projectSharingSettingsQuery.isLoading;
      default:
        return false;
    }
  };

  const handleTabBulkCheckbox = async (
    e: React.MouseEvent,
    tabValue: string,
  ) => {
    e.stopPropagation();
    if (!canUpdateProjectType) return;
    if (thirdLevelId == null || !BULK_TOGGLE_SUPPORTED_TABS.has(tabValue)) {
      return;
    }
    if (isBulkTabDataLoading(tabValue)) return;

    const enableAll = !isTabFullyEnabled(tabValue, bulkSettingsData);

    setBulkTogglesUpdating(true);
    try {
      await bulkToggleTabSettings(thirdLevelId, tabValue, enableAll);
      await queryClient.invalidateQueries({
        queryKey: ["project-type-data-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["archive-library-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["contractor-contract-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["employee-contract-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["attachment-cycle-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["roles-and-permissions-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["project-sharing-settings", thirdLevelId],
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message ?? "Failed to update tab settings",
      );
    } finally {
      setBulkTogglesUpdating(false);
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

  const effectiveTabValue = useMemo(() => {
    if (filteredTabs.length === 0) return false;
    return filteredTabs.some((t) => t.value === selectedTab)
      ? selectedTab
      : (filteredTabs[0]?.value ?? false);
  }, [selectedTab, filteredTabs]);

  const stakeholderTabsInSchema = useMemo(
    () => filteredTabs.filter(isStakeholderSchemaTab),
    [filteredTabs],
  );

  const hasStakeholderGroup = stakeholderTabsInSchema.length > 0;

  type MainRowItem =
    | { kind: "group" }
    | { kind: "leaf"; tab: ProjectSettingsTab };

  const mainRowItems = useMemo((): MainRowItem[] => {
    const items: MainRowItem[] = [];
    let groupInserted = false;
    for (const tab of filteredTabs) {
      if (isStakeholderSchemaTab(tab)) {
        if (!groupInserted) {
          items.push({ kind: "group" });
          groupInserted = true;
        }
      } else {
        items.push({ kind: "leaf", tab });
      }
    }
    return items;
  }, [filteredTabs]);

  const mainTabsValue = useMemo(() => {
    if (
      effectiveTabValue &&
      typeof effectiveTabValue === "string" &&
      (STAKEHOLDER_GROUP_TAB_VALUES as readonly string[]).includes(
        effectiveTabValue,
      )
    ) {
      return STAKEHOLDERS_GROUP_ID;
    }
    return effectiveTabValue;
  }, [effectiveTabValue]);

  const showStakeholderSubRow =
    hasStakeholderGroup &&
    typeof effectiveTabValue === "string" &&
    (STAKEHOLDER_GROUP_TAB_VALUES as readonly string[]).includes(
      effectiveTabValue,
    );

  const stakeholderGroupBulkState = getStakeholderGroupBulkState(
    bulkSettingsData,
  );
  const stakeholderGroupLoading = stakeholderTabsInSchema.some((tab) =>
    isBulkTabDataLoading(tab.value),
  );
  const stakeholderGroupCheckboxDisabled =
    !canUpdateProjectType ||
    bulkTogglesUpdating ||
    stakeholderGroupLoading ||
    stakeholderGroupBulkState === null;

  const handleStakeholderGroupBulkCheckbox = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canUpdateProjectType) return;
    if (thirdLevelId == null || stakeholderTabsInSchema.length === 0) return;
    if (stakeholderGroupLoading) return;
    if (getStakeholderGroupBulkState(bulkSettingsData) === null) return;

    const enableAll = !isStakeholderGroupFullyEnabled(bulkSettingsData);

    setBulkTogglesUpdating(true);
    try {
      for (const tab of stakeholderTabsInSchema) {
        if (!BULK_TOGGLE_SUPPORTED_TABS.has(tab.value)) continue;
        await bulkToggleTabSettings(thirdLevelId, tab.value, enableAll);
      }
      await queryClient.invalidateQueries({
        queryKey: ["project-type-data-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["archive-library-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["contractor-contract-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["employee-contract-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["attachment-cycle-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["roles-and-permissions-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["project-sharing-settings", thirdLevelId],
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message ?? "Failed to update tab settings",
      );
    } finally {
      setBulkTogglesUpdating(false);
    }
  };

  return (
    <Can check={[PERMISSIONS.projectType.list]}>
      <div className="space-y-4">
        <Grid container spacing={2}>
          <Grid size={3}>
            {thirdLevelQuery.isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            )}
            {!thirdLevelQuery.isLoading && (
              <Paper
                sx={{
                  maxHeight: "70vh",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MenuList sx={{ overflowY: "auto", flex: 1, minHeight: 0 }}>
                  {thirdLevelQuery.data?.map((item) => {
                    const appIcon = APP_ICONS.find((i) => i.id === item.icon);
                    const IconComponent = appIcon?.component;
                    return (
                      <MenuItem
                        selected={selectedSchema?.id === item.id}
                        onClick={() => setSelectedSchema(item)}
                        key={item.id}
                        value={item.id}
                        sx={{ px: 2, py: 1, borderRadius: 1 }}
                      >
                        {IconComponent && <IconComponent size={16} />}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            marginX: "10px",
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={500}>
                            {item.name}
                          </Typography>
                          <Can check={[PERMISSIONS.projectType.update]}>
                            <EditSubProjectTypeDialogTrigger
                              item={item}
                              parentId={parentId}
                              onSuccess={() => {}}
                            />
                          </Can>
                        </Box>
                      </MenuItem>
                    );
                  })}
                  <Can check={[PERMISSIONS.projectType.create]}>
                    <MenuItem
                      onClick={() => setAddDialogOpen(true)}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        color: "primary.main",
                      }}
                    >
                      <AddIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={500}>
                        {t("add")}
                      </Typography>
                    </MenuItem>
                  </Can>
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
            {selectedSchema && !isLoading && effectiveTabValue && data && (
              <div className="space-y-4">
                <Paper>
                  <Tabs value={mainTabsValue}>
                    {mainRowItems.map((item) => {
                      if (item.kind === "group") {
                        return (
                          <TabWithCheckbox
                            key={STAKEHOLDERS_GROUP_ID}
                            onClick={() => {
                              const first = stakeholderTabsInSchema[0];
                              if (first) setSelectedTab(first.value);
                            }}
                            label={t("tabs.stakeholdersGroup")}
                            value={STAKEHOLDERS_GROUP_ID}
                            hideCheckbox={false}
                            checked={stakeholderGroupBulkState?.checked ?? false}
                            indeterminate={
                              stakeholderGroupBulkState?.indeterminate ?? false
                            }
                            onCheckboxChange={handleStakeholderGroupBulkCheckbox}
                            disabled={stakeholderGroupCheckboxDisabled}
                          />
                        );
                      }
                      const tab = item.tab;
                      const supportsBulk = BULK_TOGGLE_SUPPORTED_TABS.has(
                        tab.value,
                      );
                      const bulkState = getTabBulkCheckboxState(
                        tab.value,
                        bulkSettingsData,
                      );
                      const loading = isBulkTabDataLoading(tab.value);
                      const bulkCheckboxDisabled =
                        !canUpdateProjectType ||
                        bulkTogglesUpdating ||
                        loading ||
                        bulkState === null;

                      return (
                        <TabWithCheckbox
                          key={tab.value}
                          onClick={() => setSelectedTab(tab.value)}
                          label={tab.name}
                          value={tab.value}
                          hideCheckbox={!supportsBulk}
                          checked={bulkState?.checked ?? false}
                          indeterminate={bulkState?.indeterminate ?? false}
                          onCheckboxChange={(e) => {
                            handleTabBulkCheckbox(e, tab.value);
                          }}
                          disabled={supportsBulk ? bulkCheckboxDisabled : false}
                        />
                      );
                    })}
                  </Tabs>
                </Paper>
                {showStakeholderSubRow ? (
                  <Paper
                    elevation={0}
                    sx={{
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Tabs value={effectiveTabValue}>
                      {stakeholderTabsInSchema.map((tab) => {
                        const supportsBulk = BULK_TOGGLE_SUPPORTED_TABS.has(
                          tab.value,
                        );
                        const bulkState = getTabBulkCheckboxState(
                          tab.value,
                          bulkSettingsData,
                        );
                        const loading = isBulkTabDataLoading(tab.value);
                        const bulkCheckboxDisabled =
                          !canUpdateProjectType ||
                          bulkTogglesUpdating ||
                          loading ||
                          bulkState === null;

                        return (
                          <TabWithCheckbox
                            key={tab.value}
                            onClick={() => setSelectedTab(tab.value)}
                            label={tab.name}
                            value={tab.value}
                            hideCheckbox={!supportsBulk}
                            checked={bulkState?.checked ?? false}
                            indeterminate={bulkState?.indeterminate ?? false}
                            onCheckboxChange={(e) => {
                              handleTabBulkCheckbox(e, tab.value);
                            }}
                            disabled={supportsBulk ? bulkCheckboxDisabled : false}
                          />
                        );
                      })}
                    </Tabs>
                  </Paper>
                ) : null}
                <Paper className="p-4">
                  {renderTabContent(effectiveTabValue, {
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
    </Can>
  );
}
