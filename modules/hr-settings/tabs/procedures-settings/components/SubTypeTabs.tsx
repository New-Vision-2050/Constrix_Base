"use client";

import {
  Box,
  Checkbox,
  CircularProgress,
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
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import { GetStagesResponse } from "@/services/api/crm-settings/procedure-settings/types/response";
import { useToast } from "@/modules/table/hooks/use-toast";
import { mapTaskActionToCreateInternalProcedure, mapTaskActionToUpdateInternalProcedure, resolveProcedureSettingId } from "../utils/mapTaskActionToInternalProcedure";
import { mapInternalProcedureToFormValues } from "../utils/mapInternalProcedureToFormValues";
import StagesView, { type StagesViewRef } from "./StagesView";
import AddTaskActionDialog, {
  INTERNAL_PROCEDURE_TYPE,
  INTERNAL_PROCEDURES_QUERY_TYPE,
  type TaskActionFormValues,
} from "./dialogs/AddTaskActionDialog";

interface OuterTab {
  id: number;
  name: string;
  type: string;
}

const DEFAULT_OUTER_TABS: OuterTab[] = [
  {
    id: 0,
    name: "workMissionStart",
    type: INTERNAL_PROCEDURE_TYPE,
  },
];

const WORK_PLAN_TAB = "work_plan";

export default function SubTypeTabs() {
  const t = useTranslations("hr-settings.proceduresSettings");
  const ts = useTranslations("hr-settings.proceduresSettings.subTabs");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const stagesViewRef = useRef<StagesViewRef>(null);

  const [outerTabs] = useState<OuterTab[]>(DEFAULT_OUTER_TABS);
  const [selectedOuter] = useState<number>(0);
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(
    null,
  );
  const [selectedInner, setSelectedInner] = useState<string>(WORK_PLAN_TAB);
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskActionDialogOpen, setTaskActionDialogOpen] = useState(false);
  const [taskActionDialogMode, setTaskActionDialogMode] = useState<
    "add" | "edit"
  >("add");
  const [dialogInitialValues, setDialogInitialValues] = useState<
    Partial<TaskActionFormValues> | undefined
  >(undefined);
  const [editingProcedure, setEditingProcedure] =
    useState<InternalProcedure | null>(null);

  const activeOuterTab = outerTabs.find((tab) => tab.id === selectedOuter);

  const resolveTabLabel = useCallback(
    (tab: OuterTab) =>
      tab.name === "workMissionStart" ? ts("workMissionStart") : tab.name,
    [ts],
  );

  const {
    data: internalProcedures = [],
    isLoading: isLoadingInternalProcedures,
    refetch: refetchInternalProcedures,
  } = useQuery({
    queryKey: ["internal-procedures", INTERNAL_PROCEDURES_QUERY_TYPE],
    queryFn: () =>
      InternalProcedureSettingsApi.getInternalProcedures(
        INTERNAL_PROCEDURES_QUERY_TYPE,
      ),
  });

  const rootProcedure = useMemo(
    () => internalProcedures.find((procedure) => !procedure.parent_id) ?? null,
    [internalProcedures],
  );

  const childProcedures = useMemo(() => {
    if (!rootProcedure) {
      return internalProcedures.filter((procedure) => !!procedure.parent_id);
    }
    return internalProcedures.filter(
      (procedure) => procedure.parent_id === rootProcedure.id,
    );
  }, [internalProcedures, rootProcedure]);

  const stagesParentId =
    selectedProcedureId ?? rootProcedure?.id ?? undefined;

  const existingActions = useMemo(
    () =>
      internalProcedures.map((procedure) => ({
        id: procedure.id,
        name: procedure.name,
      })),
    [internalProcedures],
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
      queryKey: ["procedure-settings", "stages", stagesParentId, undefined],
      queryFn: async () => {
        const response = await ProcedureSettingsApi.getStages({
          parentId: stagesParentId!,
        });
        return response.data;
      },
      enabled: !!stagesParentId,
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
        INTERNAL_PROCEDURE_TYPE,
      );
      await refetchWorkflow();
      await queryClient.invalidateQueries({
        queryKey: [
          "procedure-settings",
          "stages",
          stagesParentId,
          Number(branchId),
        ],
      });
    } catch (error) {
      console.error("Error updating workflow:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openAddTaskDialog = useCallback(() => {
    setTaskActionDialogMode("add");
    setDialogInitialValues(undefined);
    setEditingProcedure(null);
    setTaskActionDialogOpen(true);
  }, []);

  const openEditProcedureDialog = useCallback(
    (procedure: InternalProcedure | null) => {
      if (!procedure) return;
      setSelectedProcedureId(procedure.id);
      setTaskActionDialogMode("edit");
      setEditingProcedure(procedure);
      setDialogInitialValues(mapInternalProcedureToFormValues(procedure));
      setTaskActionDialogOpen(true);
    },
    [],
  );

  const handleSaveTaskAction = useCallback(
    async (values: TaskActionFormValues) => {
      if (taskActionDialogMode === "edit") {
        if (!editingProcedure) return;

        try {
          const procedureSettingId = resolveProcedureSettingId(editingProcedure);
          await InternalProcedureSettingsApi.updateInternalProcedure(
            procedureSettingId,
            editingProcedure.id,
            mapTaskActionToUpdateInternalProcedure(values, {
              sortOrder: editingProcedure.sort_order ?? 1,
              parentId: editingProcedure.parent_id ?? null,
              isActive: editingProcedure.is_active ?? true,
            }),
          );

          await refetchInternalProcedures();
          await queryClient.invalidateQueries({
            queryKey: ["procedure-settings", "stages", editingProcedure.id],
          });

          toast({
            title: t("actions.edit"),
            description: t("messages.procedureUpdated"),
            variant: "default",
          });
        } catch (error) {
          console.error("Error updating internal procedure:", error);
          toast({
            title: t("actions.edit"),
            description: t("messages.error"),
            variant: "destructive",
          });
          throw error;
        }
        return;
      }

      try {
        const sortOrder = childProcedures.length + 1;
        const created = await InternalProcedureSettingsApi.createInternalProcedure(
          mapTaskActionToCreateInternalProcedure(values, {
            sortOrder,
            parentId: rootProcedure?.id ?? null,
          }),
        );

        await refetchInternalProcedures();
        setSelectedProcedureId(created.id);
        setSelectedInner(WORK_PLAN_TAB);

        await queryClient.invalidateQueries({
          queryKey: ["procedure-settings", "stages", created.id],
        });

        toast({
          title: t("actions.add"),
          description: t("messages.procedureAdded"),
          variant: "default",
        });
      } catch (error) {
        console.error("Error creating internal procedure:", error);
        toast({
          title: t("actions.add"),
          description: t("messages.error"),
          variant: "destructive",
        });
        throw error;
      }
    },
    [
      taskActionDialogMode,
      editingProcedure,
      childProcedures.length,
      rootProcedure?.id,
      refetchInternalProcedures,
      queryClient,
      t,
      toast,
    ],
  );

  const showStagesView =
    selectedInner === WORK_PLAN_TAB ||
    branchUsesWorkPlan[selectedInner] === false;

  const isProcedureSelected = (procedureId?: string | null) =>
    stagesParentId === procedureId;

  const renderProcedureChip = (
    procedure: InternalProcedure | null,
    fallbackLabel: string,
    onSelect: () => void,
  ) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        cursor: procedure ? "pointer" : "default",
        px: 1,
        py: 0.5,
        borderRadius: 1,
        bgcolor:
          procedure && isProcedureSelected(procedure.id)
            ? "action.selected"
            : "transparent",
      }}
      onClick={() => {
        if (procedure) onSelect();
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {procedure?.name ?? fallbackLabel}
      </Typography>
      {procedure && (
        <IconButton
          size="small"
          aria-label={t("stages.editStage")}
          onClick={(e) => {
            e.stopPropagation();
            openEditProcedureDialog(procedure);
          }}
        >
          <Settings sx={{ fontSize: 22 }} />
        </IconButton>
      )}
    </Box>
  );

  return (
    <div className="space-y-4">
      <Paper>
        <Tabs
          value={selectedOuter}
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
              gap: 2,
              flexDirection: "row-reverse",
            }}
          >
            <PlusIcon
              className="h-5 w-5 shrink-0 cursor-pointer text-primary rounded-full"
              onClick={openAddTaskDialog}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
                justifyContent: "flex-start",
                flex: 1,
                minWidth: 0,
              }}
            >
              {isLoadingInternalProcedures ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  {renderProcedureChip(
                    rootProcedure,
                    resolveTabLabel(activeOuterTab),
                    () => setSelectedProcedureId(null),
                  )}

                  {childProcedures.map((child) =>
                    renderProcedureChip(child, child.name, () =>
                      setSelectedProcedureId(child.id),
                    ),
                  )}
                </>
              )}
            </Box>
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
              parentId={stagesParentId}
              currentTabType={INTERNAL_PROCEDURE_TYPE}
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
            action.id !== editingProcedure?.id,
        )}
        initialValues={dialogInitialValues}
        onSave={handleSaveTaskAction}
      />
    </div>
  );
}
