"use client";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Delete, Edit, Settings } from "@mui/icons-material";
import { PlusIcon } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomMenu from "@/components/headless/custom-menu";
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
import {
  mapTaskActionToCreateInternalProcedure,
  mapTaskActionToUpdateInternalProcedure,
  resolveProcedureSettingId,
  isPrimaryInternalProcedure,
} from "../utils/mapTaskActionToInternalProcedure";
import StagesView from "./StagesView";
import AddTaskActionDialog, {
  type TaskActionFormValues,
} from "@/modules/hr-settings/tabs/procedures-settings/components/dialogs/AddTaskActionDialog";
import EditTaskActionDialog from "@/modules/hr-settings/tabs/procedures-settings/components/dialogs/EditTaskActionDialog";

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
  const t = useTranslations("CRMSettingsModule.proceduresSettings");
  const ts = useTranslations("CRMSettingsModule.proceduresSettings.subTabs");
  const tConfirm = useTranslations("common.deleteConfirmation");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedOuter, setSelectedOuter] = useState<number>(0);
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(
    null,
  );
  const [selectedInner, setSelectedInner] = useState<string>(WORK_PLAN_TAB);
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskActionDialogOpen, setTaskActionDialogOpen] = useState(false);
  const [editTaskActionDialogOpen, setEditTaskActionDialogOpen] =
    useState(false);
  const [editingProcedure, setEditingProcedure] =
    useState<InternalProcedure | null>(null);
  const [procedureToDelete, setProcedureToDelete] =
    useState<InternalProcedure | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeletingProcedure, setIsDeletingProcedure] = useState(false);

  const getCurrentTabType = () =>
    OUTER_TABS.find((tab) => tab.id === selectedOuter)?.type ??
    "client_request";

  const currentTabType = getCurrentTabType();

  const {
    data: internalProcedures = [],
    isLoading: isLoadingInternalProcedures,
    refetch: refetchInternalProcedures,
  } = useQuery({
    queryKey: ["internal-procedures", currentTabType],
    queryFn: () =>
      InternalProcedureSettingsApi.getInternalProcedures(currentTabType),
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

  const defaultProcedureId = childProcedures[0]?.id ?? null;
  const activeProcedureId = selectedProcedureId ?? defaultProcedureId;
  const stagesParentId = activeProcedureId ?? rootProcedure?.id ?? undefined;

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
          type: currentTabType,
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

  const workFlowId = useMemo(() => {
    const payload = workflowResponse?.payload;
    if (payload?.id) return payload.id;

    const stages = payload?.["procedure-settings"];
    const procedureWithWorkflow = Array.isArray(stages)
      ? stages.find(
          (procedure) => procedure.work_flow_id || procedure.work_flow?.id,
        )
      : undefined;

    return (
      procedureWithWorkflow?.work_flow_id ??
      procedureWithWorkflow?.work_flow?.id ??
      ""
    );
  }, [workflowResponse]);

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
    setTaskActionDialogOpen(true);
  }, []);

  const openEditProcedureDialog = useCallback(
    (procedure: InternalProcedure | null) => {
      if (!procedure) return;
      setSelectedProcedureId(procedure.id);
      setEditingProcedure(procedure);
      setEditTaskActionDialogOpen(true);
    },
    [],
  );

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
    setProcedureToDelete(null);
  }, []);

  const handleDeleteProcedure = useCallback(
    async (procedure: InternalProcedure) => {
      if (isPrimaryInternalProcedure(procedure, internalProcedures)) {
        return;
      }

      setIsDeletingProcedure(true);
      try {
        await InternalProcedureSettingsApi.deleteInternalProcedure(
          procedure.id,
          procedure.id,
        );

        await refetchInternalProcedures();
        await queryClient.invalidateQueries({
          queryKey: ["procedure-settings", "stages", procedure.id],
        });

        if (selectedProcedureId === procedure.id) {
          setSelectedProcedureId(null);
        }

        closeDeleteConfirm();

        toast({
          title: t("actions.delete"),
          description: t("messages.procedureDeleted"),
          variant: "default",
        });
      } catch (error) {
        console.error("Error deleting internal procedure:", error);
        toast({
          title: t("actions.delete"),
          description: t("messages.error"),
          variant: "destructive",
        });
      } finally {
        setIsDeletingProcedure(false);
      }
    },
    [
      refetchInternalProcedures,
      queryClient,
      selectedProcedureId,
      internalProcedures,
      closeDeleteConfirm,
      t,
      toast,
    ],
  );

  const confirmDeleteProcedure = useCallback(() => {
    if (procedureToDelete) {
      void handleDeleteProcedure(procedureToDelete);
    }
  }, [procedureToDelete, handleDeleteProcedure]);

  const handleEditTaskAction = useCallback(
    async (values: TaskActionFormValues) => {
      if (!editingProcedure) return;

      try {
        const procedureSettingId = resolveProcedureSettingId(editingProcedure);
        await InternalProcedureSettingsApi.updateInternalProcedure(
          procedureSettingId,
          editingProcedure.id,
          mapTaskActionToUpdateInternalProcedure(values, {
            procedureType: currentTabType,
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
    },
    [
      editingProcedure,
      currentTabType,
      refetchInternalProcedures,
      queryClient,
      t,
      toast,
    ],
  );

  const handleAddTaskAction = useCallback(
    async (values: TaskActionFormValues) => {
      try {
        const sortOrder = childProcedures.length + 1;
        const created =
          await InternalProcedureSettingsApi.createInternalProcedure(
            mapTaskActionToCreateInternalProcedure(values, {
              procedureType: currentTabType,
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
      childProcedures.length,
      currentTabType,
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
    activeProcedureId === procedureId;

  const renderProcedureChip = (
    procedure: InternalProcedure,
    onSelect: () => void,
  ) => {
    const isProtected = isPrimaryInternalProcedure(
      procedure,
      internalProcedures,
    );

    return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        cursor: "pointer",
        px: 1,
        py: 0.5,
        borderRadius: 1,
        bgcolor: isProcedureSelected(procedure.id)
          ? "action.selected"
          : "transparent",
      }}
      onClick={onSelect}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {procedure.name}
      </Typography>
      <CustomMenu
        renderAnchor={({ onClick }) => (
          <IconButton
            size="small"
            aria-label={t("stages.editStage")}
            onClick={(e) => {
              e.stopPropagation();
              onClick(e);
            }}
          >
            <Settings sx={{ fontSize: 22 }} />
          </IconButton>
        )}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            openEditProcedureDialog(procedure);
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          {t("actions.edit")}
        </MenuItem>
        {!isProtected ? (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setProcedureToDelete(procedure);
              setDeleteConfirmOpen(true);
            }}
            sx={{ color: "error.main" }}
          >
            <Delete fontSize="small" sx={{ mr: 1 }} />
            {t("actions.delete")}
          </MenuItem>
        ) : null}
      </CustomMenu>
    </Box>
    );
  };

  return (
    <div className="space-y-4">
      <Paper>
        <Tabs
          value={selectedOuter}
          onChange={(_, val: number) => {
            setSelectedOuter(val);
            setSelectedProcedureId(null);
            setSelectedInner(WORK_PLAN_TAB);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {OUTER_TABS.map((tab) => (
            <Tab key={tab.id} value={tab.id} label={ts(tab.name)} />
          ))}
        </Tabs>
      </Paper>

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
            childProcedures.map((procedure) =>
              renderProcedureChip(procedure, () =>
                setSelectedProcedureId(procedure.id),
              ),
            )
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
          parentId={stagesParentId}
          workFlowId={selectedInner === WORK_PLAN_TAB ? workFlowId : undefined}
          currentTabType={currentTabType}
          branchId={
            selectedInner !== WORK_PLAN_TAB ? Number(selectedInner) : undefined
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "start" }}>
          {t("actions.delete")}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {tConfirm("defaultMessage")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
          <Button
            onClick={closeDeleteConfirm}
            variant="outlined"
            disabled={isDeletingProcedure}
            sx={{ flex: 1 }}
          >
            {t("actions.cancel")}
          </Button>
          <Button
            onClick={confirmDeleteProcedure}
            variant="contained"
            color="error"
            disabled={isDeletingProcedure}
            sx={{ flex: 1 }}
          >
            {t("actions.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <AddTaskActionDialog
        open={taskActionDialogOpen}
        onClose={() => setTaskActionDialogOpen(false)}
        procedureType={currentTabType}
        existingActions={existingActions}
        onSave={handleAddTaskAction}
      />

      <EditTaskActionDialog
        open={editTaskActionDialogOpen}
        onClose={() => {
          setEditTaskActionDialogOpen(false);
          setEditingProcedure(null);
        }}
        procedureType={currentTabType}
        procedure={editingProcedure}
        lockFormModel={
          editingProcedure
            ? isPrimaryInternalProcedure(
                editingProcedure,
                internalProcedures,
              )
            : false
        }
        existingActions={existingActions.filter(
          (action) => action.id !== editingProcedure?.id,
        )}
        onSave={handleEditTaskAction}
      />
    </div>
  );
}
