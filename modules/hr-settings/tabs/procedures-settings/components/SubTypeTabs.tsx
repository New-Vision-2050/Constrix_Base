"use client";

import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import { PlusIcon } from "lucide-react";
import { useState, useMemo, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchManagementHierarchyOptions,
  type ManagementHierarchyOption,
} from "@/utils/fetchDropdownOptions";
import { baseURL } from "@/config/axios-config";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import { GetStagesResponse } from "@/services/api/crm-settings/procedure-settings/types/response";
import StagesView, { type StagesViewRef } from "./StagesView";
import AddTaskActionDialog, {
  type TaskActionFormValues,
} from "./dialogs/AddTaskActionDialog";

interface OuterTab {
  id: number;
  name: string;
  type: string;
  config?: TaskActionFormValues;
}

const DEFAULT_OUTER_TABS: OuterTab[] = [
  { id: 0, name: "workMissionStart", type: "employee_task_request" },
];

const WORK_PLAN_TAB = "work_plan";

export default function SubTypeTabs() {
  const t = useTranslations("hr-settings.proceduresSettings");
  const ts = useTranslations("hr-settings.proceduresSettings.subTabs");
  const queryClient = useQueryClient();
  const stagesViewRef = useRef<StagesViewRef>(null);

  const [outerTabs, setOuterTabs] = useState<OuterTab[]>(DEFAULT_OUTER_TABS);
  const [selectedOuter, setSelectedOuter] = useState<number>(0);
  const [selectedInner, setSelectedInner] = useState<string>(WORK_PLAN_TAB);
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskActionDialogOpen, setTaskActionDialogOpen] = useState(false);
  const [taskActionDialogMode, setTaskActionDialogMode] = useState<
    "add" | "edit"
  >("add");
  const [dialogInitialValues, setDialogInitialValues] = useState<
    Partial<TaskActionFormValues> | undefined
  >(undefined);

  const getCurrentTabType = () =>
    outerTabs.find((tab) => tab.id === selectedOuter)?.type ??
    "employee_task_request";

  const currentTabType = getCurrentTabType();
  const activeOuterTab = outerTabs.find((tab) => tab.id === selectedOuter);

  const resolveTabLabel = useCallback(
    (tab: OuterTab) =>
      tab.name === "workMissionStart" ? ts("workMissionStart") : tab.name,
    [ts],
  );

  const existingActions = useMemo(
    () =>
      outerTabs.map((tab) => ({
        id: String(tab.id),
        name: resolveTabLabel(tab),
      })),
    [outerTabs, resolveTabLabel],
  );

  const { data: branches = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["branches"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=branch`,
      ),
  });

  const { data: workflowResponse, refetch: refetchWorkflow } =
    useQuery<GetStagesResponse>({
      queryKey: ["procedure-settings", "stages", currentTabType, undefined],
      queryFn: async () => {
        const response = await ProcedureSettingsApi.getStages(currentTabType);
        return response.data;
      },
    });

  const branchUsesWorkPlan = useMemo(() => {
    const workflowBranches = workflowResponse?.payload?.branches ?? [];
    const checkedBranchIds = new Set(workflowBranches.map((b) => String(b.id)));
    return Object.fromEntries(
      branches.map((b) => [b.id, checkedBranchIds.has(String(b.id))]),
    );
  }, [workflowResponse, branches]);

  const handleBranchCheckbox = async (
    e: React.ChangeEvent<HTMLInputElement>,
    branchId: string,
  ) => {
    e.stopPropagation();
    const checked = e.target.checked;

    setIsUpdating(true);
    try {
      await ProcedureSettingsApi.updateWorkFlow(
        Number(branchId),
        checked,
        currentTabType,
      );
      await refetchWorkflow();
      await queryClient.invalidateQueries({
        queryKey: [
          "procedure-settings",
          "stages",
          currentTabType,
          Number(branchId),
        ],
      });
    } catch (error) {
      console.error("Error updating workflow:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getTaskActionInitialValues = useCallback(
    (tab: OuterTab): Partial<TaskActionFormValues> => {
      if (tab.config) return tab.config;
      return {
        name: resolveTabLabel(tab),
        formConditions: ["employee_on_duty"],
      };
    },
    [resolveTabLabel],
  );

  const openAddTaskDialog = useCallback(() => {
    setTaskActionDialogMode("add");
    setDialogInitialValues(undefined);
    setTaskActionDialogOpen(true);
  }, []);

  const openEditTaskDialog = useCallback(() => {
    if (!activeOuterTab) return;
    setTaskActionDialogMode("edit");
    setDialogInitialValues(getTaskActionInitialValues(activeOuterTab));
    setTaskActionDialogOpen(true);
  }, [activeOuterTab, getTaskActionInitialValues]);

  const handleSaveTaskAction = useCallback(
    (values: TaskActionFormValues) => {
      if (taskActionDialogMode === "edit") {
        setOuterTabs((prev) =>
          prev.map((tab) =>
            tab.id === selectedOuter
              ? {
                  ...tab,
                  name: values.name.trim(),
                  config: values,
                }
              : tab,
          ),
        );
        return;
      }

      let newTabId = 0;
      setOuterTabs((prev) => {
        newTabId = prev.reduce((max, tab) => Math.max(max, tab.id), 0) + 1;
        const slug = values.name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^\w\u0600-\u06FF_]/g, "");

        return [
          ...prev,
          {
            id: newTabId,
            name: values.name.trim(),
            type: `employee_task_${slug || newTabId}`,
            config: values,
          },
        ];
      });
      setSelectedOuter(newTabId);
      setSelectedInner(WORK_PLAN_TAB);
    },
    [taskActionDialogMode, selectedOuter],
  );

  const showStagesView =
    selectedInner === WORK_PLAN_TAB ||
    branchUsesWorkPlan[selectedInner] === false;

  return (
    <div className="space-y-4">
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
          {outerTabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={resolveTabLabel(tab)}
            />
          ))}
        </Tabs>
      </Paper>

      {activeOuterTab && (
        <>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {resolveTabLabel(activeOuterTab)}
              </Typography>
              <IconButton
                size="small"
                aria-label={t("stages.editStage")}
                onClick={openEditTaskDialog}
              >
                <Settings sx={{ fontSize: 22 }} />
              </IconButton>
            </Box>
            <PlusIcon
              className="h-5 w-5 cursor-pointer text-primary rounded-full"
              onClick={openAddTaskDialog}
            />
          </Paper>

          <Paper>
            <Tabs
              value={selectedInner}
              onChange={(_, val: string) => setSelectedInner(val)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value={WORK_PLAN_TAB} label={ts("workPlan")} />
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
                        checked={branchUsesWorkPlan[branch.id] ?? false}
                        onChange={(e) => handleBranchCheckbox(e, branch.id)}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                        disabled={isUpdating}
                        sx={{ p: 0 }}
                      />
                      <span>{branch.name}</span>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Paper>

          {showStagesView ? (
            <StagesView
              ref={stagesViewRef}
              currentTabType={currentTabType}
              branchId={
                selectedInner !== WORK_PLAN_TAB
                  ? Number(selectedInner)
                  : undefined
              }
            />
          ) : (
            <Paper
              sx={{
                p: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Checkbox
                checked={branchUsesWorkPlan[selectedInner] ?? false}
                onChange={(e) => handleBranchCheckbox(e, selectedInner)}
                disabled={isUpdating}
              />
              <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                {ts("useWorkPlanProcedures")}
              </Typography>
            </Paper>
          )}
        </>
      )}

      <AddTaskActionDialog
        open={taskActionDialogOpen}
        mode={taskActionDialogMode}
        onClose={() => setTaskActionDialogOpen(false)}
        existingActions={existingActions.filter(
          (action) =>
            taskActionDialogMode === "add" ||
            action.id !== String(selectedOuter),
        )}
        initialValues={dialogInitialValues}
        onSave={handleSaveTaskAction}
      />
    </div>
  );
}
