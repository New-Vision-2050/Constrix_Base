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
  bulkToggleTabSettings,
  getTabBulkCheckboxState,
  isTabFullyEnabled,
} from "./schema-tab-bulk-settings";
import DetailsView from "../details";
import ProjectTermsView from "../project-terms";
import AttachmentsView from "../attachments";
import ContractorsView from "../contractors";
import TeamView from "../team";
import DocumentCycleView from "../document-cycle";
import WorkOrdersView from "../work-orders";
import FinancialView from "../financial";
import ContractManagementView from "../contract-management";
import { SettingsTabItemProps } from "../../types";
import { APP_ICONS } from "@/constants/icons";

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

  const attachmentContractQuery = useQuery({
    queryKey: ["attachment-contract-settings", thirdLevelId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getAttachmentContractSettings(
        thirdLevelId!,
      );
      return response.data.payload;
    },
    enabled:
      thirdLevelId != null &&
      filteredTabs.some((t) => t.value === "attachments"),
  });

  const attachmentTermsQuery = useQuery({
    queryKey: ["attachment-terms-contract-settings", thirdLevelId],
    queryFn: async () => {
      const response =
        await ProjectTypesApi.getAttachmentTermsContractSettings(thirdLevelId!);
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
    enabled: thirdLevelId != null && filteredTabs.some((t) => t.value === "team"),
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

  const bulkSettingsData = useMemo(
    () => ({
      dataSettings: dataSettingsQuery.data,
      attachment: attachmentContractQuery.data,
      attachmentTerms: attachmentTermsQuery.data,
      contractor: contractorSettingsQuery.data,
      employee: employeeSettingsQuery.data,
      attachmentCycle: attachmentCycleSettingsQuery.data,
    }),
    [
      dataSettingsQuery.data,
      attachmentContractQuery.data,
      attachmentTermsQuery.data,
      contractorSettingsQuery.data,
      employeeSettingsQuery.data,
      attachmentCycleSettingsQuery.data,
    ],
  );

  const isBulkTabDataLoading = (tabValue: string) => {
    switch (tabValue) {
      case "project-details":
        return dataSettingsQuery.isLoading;
      case "attachments":
        return (
          attachmentContractQuery.isLoading || attachmentTermsQuery.isLoading
        );
      case "contractors":
        return contractorSettingsQuery.isLoading;
      case "team":
        return employeeSettingsQuery.isLoading;
      case "document-cycle":
        return attachmentCycleSettingsQuery.isLoading;
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
        queryKey: ["attachment-contract-settings", thirdLevelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["attachment-terms-contract-settings", thirdLevelId],
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
                  <Tabs value={effectiveTabValue}>
                    {filteredTabs.map((tab) => {
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
                        disabled={
                          supportsBulk ? bulkCheckboxDisabled : false
                        }
                        />
                      );
                    })}
                  </Tabs>
                </Paper>
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
