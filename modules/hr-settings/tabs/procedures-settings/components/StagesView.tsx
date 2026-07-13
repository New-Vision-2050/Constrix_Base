"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Delete, Edit, Settings } from "@mui/icons-material";
import {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  useCallback,
} from "react";
import { useTranslations } from "next-intl";
import { useProceduresSettingsTranslations } from "../hooks/useProceduresSettingsTranslations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/modules/table/hooks/use-toast";
import CustomMenu from "@/components/headless/custom-menu";
import AddStageDialog from "./dialogs/AddStageDialog";
import EditStageDialog from "./dialogs/EditStageDialog";
import DocumentClassificationAddProcedureDialog from "./dialogs/DocumentClassificationAddProcedureDialog";
import DocumentStageCard from "./DocumentStageCard";
import StepCard from "./StepCard";
import { APP_ICONS } from "@/constants/icons";
import { getProcedureSettingsTabTitle } from "../utils/getProcedureTabTitle";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import {
  Stage,
  GetStagesResponse,
  ProcedureStep,
  GetStepsResponse,
} from "@/services/api/crm-settings/procedure-settings/types/response";
import { useProceduresSettings } from "../context/ProceduresSettingsContext";

interface StagesViewProps {
  parentId?: string;
  currentTabType?: string;
  branchId?: number;
  workFlowId?: string;
}

export interface StagesViewRef {
  openAddProcedureDialog: () => void;
  addStage: () => void;
}

const StagesView = forwardRef<StagesViewRef, StagesViewProps>(function StagesView(
  { parentId, currentTabType, branchId, workFlowId: workFlowIdProp },
  ref,
) {
  const { t, ts } = useProceduresSettingsTranslations();
  const { addProcedureVariant } = useProceduresSettings();
  const useDocumentAddDialog = addProcedureVariant === "document-classification";
  const tConfirm = useTranslations("common.deleteConfirmation");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stagesResponse, refetch } = useQuery<GetStagesResponse>({
    queryKey: ["procedure-settings", "stages", parentId, branchId],
    queryFn: async () => {
      const response = await ProcedureSettingsApi.getStages({
        parentId: parentId!,
        type: currentTabType,
        branchId,
      });
      return response.data;
    },
    enabled: !!parentId,
  });

  const procedures = useMemo(() => {
    const payload = stagesResponse?.payload;
    const stages = payload?.["procedure-settings"];
    return Array.isArray(stages) ? stages : [];
  }, [stagesResponse]);

  const workFlowId = useMemo(() => {
    const payloadId = stagesResponse?.payload?.id;
    if (payloadId) return payloadId;

    const procedureWithWorkflow = procedures.find(
      (procedure) => procedure.work_flow_id || procedure.work_flow?.id,
    );
    const procedureWorkFlowId =
      procedureWithWorkflow?.work_flow_id ??
      procedureWithWorkflow?.work_flow?.id;

    if (procedureWorkFlowId) return procedureWorkFlowId;

    // Work plan tab only — branch workflows come from the branch-specific fetch above
    if (!branchId && workFlowIdProp) return workFlowIdProp;

    return "";
  }, [branchId, workFlowIdProp, stagesResponse, procedures]);

  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(
    null,
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [procedureToEdit, setProcedureToEdit] = useState<Stage | null>(null);
  const [procedureToDelete, setProcedureToDelete] = useState<Stage | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeletingProcedure, setIsDeletingProcedure] = useState(false);
  const [draftStepKeys, setDraftStepKeys] = useState<Record<string, string[]>>(
    {},
  );
  const [pendingDraftKeys, setPendingDraftKeys] = useState<string[]>([]);

  const handleAddStep = () => {
    const key = crypto.randomUUID();
    if (selectedProcedureId) {
      setDraftStepKeys((prev) => ({
        ...prev,
        [selectedProcedureId]: [...(prev[selectedProcedureId] ?? []), key],
      }));
    } else {
      setPendingDraftKeys((prev) => [...prev, key]);
    }
  };

  useImperativeHandle(ref, () => ({
    openAddProcedureDialog: () => setAddDialogOpen(true),
    addStage: handleAddStep,
  }));

  useEffect(() => {
    if (!procedures.length) {
      setSelectedProcedureId(null);
      return;
    }
    const exists = procedures.some((p) => p.id === selectedProcedureId);
    if (!selectedProcedureId || !exists) {
      setSelectedProcedureId(procedures[0].id);
    }
  }, [procedures, selectedProcedureId]);

  const { data: stepsResponse } = useQuery<GetStepsResponse>({
    queryKey: ["procedure-steps", selectedProcedureId],
    queryFn: async () => {
      const response = await ProcedureSettingsApi.getSteps(
        selectedProcedureId!,
      );
      return response.data;
    },
    enabled: !!selectedProcedureId,
  });

  const serverSteps: ProcedureStep[] = Array.isArray(stepsResponse?.payload)
    ? stepsResponse.payload
    : [];

  const handleCreateProcedure = async (payload: {
    name: string;
    type: string;
    execute_type: string;
    icon: string;
    percentage: number;
    deadline_days: number;
    deadline_hours: number;
    escalation_management_hierarchy_id: string;
  }) => {
    if (!parentId || !workFlowId) {
      toast({
        title: t("actions.add"),
        description: t("messages.error"),
        variant: "destructive",
      });
      return;
    }
    try {
      await ProcedureSettingsApi.createStage({
        ...payload,
        parent_id: parentId,
        work_flow_id: workFlowId,
      });
      await refetch();
      toast({
        title: t("actions.add"),
        description: t("messages.procedureAdded"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating procedure:", error);
      toast({
        title: t("actions.add"),
        description: t("messages.error"),
        variant: "destructive",
      });
    }
  };

  const removeDraftStep = (procedureId: string, draftKey: string) => {
    setDraftStepKeys((prev) => ({
      ...prev,
      [procedureId]: (prev[procedureId] ?? []).filter((k) => k !== draftKey),
    }));
  };

  const handleStepSaved = async (procedureId: string, draftKey?: string) => {
    if (draftKey) removeDraftStep(procedureId, draftKey);
    await queryClient.invalidateQueries({
      queryKey: ["procedure-steps", procedureId],
    });
  };

  const handleDeleteServerStep = async (
    procedureId: string,
    stepId: number,
  ) => {
    try {
      await ProcedureSettingsApi.deleteStep(procedureId, stepId);
      await queryClient.invalidateQueries({
        queryKey: ["procedure-steps", procedureId],
      });
      toast({
        title: t("actions.delete"),
        description: t("messages.stageDeleted"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting step:", error);
      toast({
        title: t("actions.delete"),
        description: t("messages.error"),
        variant: "destructive",
      });
    }
  };

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
    setProcedureToDelete(null);
  }, []);

  const handleDeleteProcedure = useCallback(
    async (procedure: Stage) => {
      setIsDeletingProcedure(true);
      try {
        await ProcedureSettingsApi.deleteStage(procedure.id);
        setDraftStepKeys((prev) => {
          const next = { ...prev };
          delete next[procedure.id];
          return next;
        });
        queryClient.removeQueries({
          queryKey: ["procedure-steps", procedure.id],
        });
        if (selectedProcedureId === procedure.id) {
          setSelectedProcedureId(null);
        }
        closeDeleteConfirm();
        await refetch();
        toast({
          title: t("actions.delete"),
          description: t("messages.procedureDeleted"),
          variant: "default",
        });
      } catch (error) {
        console.error("Error deleting procedure:", error);
        toast({
          title: t("actions.delete"),
          description: t("messages.error"),
          variant: "destructive",
        });
      } finally {
        setIsDeletingProcedure(false);
      }
    },
    [closeDeleteConfirm, queryClient, refetch, selectedProcedureId, t, toast],
  );

  const confirmDeleteProcedure = useCallback(() => {
    if (procedureToDelete) {
      void handleDeleteProcedure(procedureToDelete);
    }
  }, [procedureToDelete, handleDeleteProcedure]);

  const getIconComponent = (iconName: string) => {
    const matchedIcon = APP_ICONS.find((icon) => icon.id === iconName);
    if (matchedIcon) {
      const IconComponent = matchedIcon.component;
      return <IconComponent size={18} />;
    }
    switch (iconName) {
      case "delete":
        return <Delete sx={{ fontSize: 18 }} />;
      case "link":
        return <Edit sx={{ fontSize: 18 }} />;
      default:
        return <Settings sx={{ fontSize: 18 }} />;
    }
  };

  const currentDraftKeys = selectedProcedureId
    ? (draftStepKeys[selectedProcedureId] ?? [])
    : [];

  const hasAnySteps =
    pendingDraftKeys.length > 0 ||
    serverSteps.length > 0 ||
    currentDraftKeys.length > 0;

  const modelTabName = useMemo(() => {
    if (!currentTabType) return "";
    try {
      if (currentTabType === "correspondence") return ts("correspondence");
      if (currentTabType === "technical_submittal") return ts("technicalSubmittal");
      if (currentTabType === "ncr") return ts("ncr");
      if (currentTabType === "vo") return ts("vo");
    } catch {
      /* fallback below */
    }
    return currentTabType;
  }, [currentTabType, ts]);

  const documentStagesContent = (
    <>
      {pendingDraftKeys.map((draftKey, index) => (
        <DocumentStageCard
          key={`pending-${draftKey}`}
          procedureSettingId={selectedProcedureId ?? ""}
          serverStep={null}
          stepIndex={index + 1}
          onSaved={() => {
            setPendingDraftKeys((prev) =>
              prev.filter((k) => k !== draftKey),
            );
            if (selectedProcedureId)
              queryClient.invalidateQueries({
                queryKey: ["procedure-steps", selectedProcedureId],
              });
          }}
          onDelete={() =>
            setPendingDraftKeys((prev) =>
              prev.filter((k) => k !== draftKey),
            )
          }
          onCopy={handleAddStep}
        />
      ))}
      {serverSteps.map((step, index) => (
        <DocumentStageCard
          key={`server-${step.id}`}
          procedureSettingId={selectedProcedureId!}
          serverStep={step}
          stepIndex={pendingDraftKeys.length + index + 1}
          onSaved={() => handleStepSaved(selectedProcedureId!)}
          onDelete={() =>
            handleDeleteServerStep(selectedProcedureId!, step.id)
          }
          onCopy={handleAddStep}
        />
      ))}
      {currentDraftKeys.map((draftKey, index) => (
        <DocumentStageCard
          key={`draft-${draftKey}`}
          procedureSettingId={selectedProcedureId!}
          serverStep={null}
          stepIndex={
            pendingDraftKeys.length + serverSteps.length + index + 1
          }
          onSaved={() => handleStepSaved(selectedProcedureId!, draftKey)}
          onDelete={() => removeDraftStep(selectedProcedureId!, draftKey)}
          onCopy={handleAddStep}
        />
      ))}
    </>
  );

  if (useDocumentAddDialog) {
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                minHeight: 320,
              }}
            >
              {procedures.map((procedure: Stage) => (
                <Box
                  key={procedure.id}
                  onClick={() => setSelectedProcedureId(procedure.id)}
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    mb: 1,
                    cursor: "pointer",
                    borderRadius: 1.5,
                    bgcolor:
                      selectedProcedureId === procedure.id
                        ? "action.selected"
                        : "action.hover",
                    border: "1px solid",
                    borderColor:
                      selectedProcedureId === procedure.id
                        ? "primary.main"
                        : "transparent",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ flex: 1 }}
                    >
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
                          <Settings sx={{ fontSize: 18 }} />
                        </IconButton>
                      )}
                    >
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setProcedureToEdit(procedure);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit fontSize="small" sx={{ mr: 1 }} />
                        {t("actions.edit")}
                      </MenuItem>
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
                    </CustomMenu>
                  </Box>
                </Box>
              ))}

              <Button
                variant="text"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => setAddDialogOpen(true)}
                sx={{
                  justifyContent: "flex-start",
                  mt: 1,
                  fontWeight: 600,
                  px: 1,
                }}
              >
                {t("procedures.addProcedure")}
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                minHeight: 320,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.75 }}>
                  {t("steps.modelStagesTitle", { name: modelTabName })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("steps.modelStagesDescription")}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {hasAnySteps ? (
                  <Box className="space-y-4">{documentStagesContent}</Box>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 6,
                    }}
                  >
                    <Typography color="text.secondary" fontWeight={500}>
                      {t("steps.noStagesAdded")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <DocumentClassificationAddProcedureDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          procedureType={currentTabType ?? ""}
          onSave={async (values) => {
            await handleCreateProcedure({
              name: values.name,
              type: currentTabType ?? "",
              execute_type: "sequence",
              icon: "settings",
              percentage: 0,
              deadline_days: 1,
              deadline_hours: 0,
              escalation_management_hierarchy_id: "",
            });
          }}
        />
        <EditStageDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setProcedureToEdit(null);
          }}
          procedure={procedureToEdit}
          onDeleted={(procedureId) => {
            setDraftStepKeys((prev) => {
              const next = { ...prev };
              delete next[procedureId];
              return next;
            });
            queryClient.removeQueries({
              queryKey: ["procedure-steps", procedureId],
            });
          }}
          onSuccess={async () => {
            await refetch();
            if (procedureToEdit) {
              await queryClient.invalidateQueries({
                queryKey: ["procedure-steps", procedureToEdit.id],
              });
            }
          }}
        />
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
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleAddStep}
          disabled={!selectedProcedureId}
        >
          {t("steps.addStage")}
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid size={3}>
          <Box>
            {procedures.map((procedure: Stage) => (
              <Box
                key={procedure.id}
                onClick={() => setSelectedProcedureId(procedure.id)}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  borderRadius: 1,
                  backgroundColor:
                    selectedProcedureId === procedure.id
                      ? "action.selected"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center", 
                    gap: 1,
                  }}
                >
                  {getIconComponent(procedure.icon)}
                  <Typography variant="subtitle2" fontWeight={500}>
                    {procedure.name}
                  </Typography>
                  <CustomMenu
                    renderAnchor={({ onClick }) => (
                      <IconButton
                        size="small"
                        sx={{ ml: "auto" }}
                        aria-label={t("stages.editStage")}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClick(e);
                        }}
                      >
                        <Settings sx={{ fontSize: 24 }} />
                      </IconButton>
                    )}
                  >
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setProcedureToEdit(procedure);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit fontSize="small" sx={{ mr: 1 }} />
                      {t("actions.edit")}
                    </MenuItem>
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
                  </CustomMenu>
                </Box>
              </Box>
            ))}

            <Button
              variant="text"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => setAddDialogOpen(true)}
              disabled={!parentId || !workFlowId}
              sx={{ justifyContent: "flex-start", mt: 2 }}
            >
              {t("procedures.addProcedureName")}
            </Button>
          </Box>
        </Grid>

        <Grid size={9}>
          <Box className="space-y-4">
            {pendingDraftKeys.map((draftKey, index) => (
              <StepCard
                key={`pending-${draftKey}`}
                procedureSettingId={selectedProcedureId ?? ""}
                serverStep={null}
                stepIndex={index + 1}
                onSaved={() => {
                  setPendingDraftKeys((prev) =>
                    prev.filter((k) => k !== draftKey),
                  );
                  if (selectedProcedureId)
                    queryClient.invalidateQueries({
                      queryKey: ["procedure-steps", selectedProcedureId],
                    });
                }}
                onDelete={() =>
                  setPendingDraftKeys((prev) =>
                    prev.filter((k) => k !== draftKey),
                  )
                }
              />
            ))}
            {serverSteps.map((step, index) => (
              <StepCard
                key={`server-${step.id}`}
                procedureSettingId={selectedProcedureId!}
                serverStep={step}
                stepIndex={pendingDraftKeys.length + index + 1}
                onSaved={() => handleStepSaved(selectedProcedureId!)}
                onDelete={() =>
                  handleDeleteServerStep(selectedProcedureId!, step.id)
                }
              />
            ))}
            {currentDraftKeys.map((draftKey, index) => (
              <StepCard
                key={`draft-${draftKey}`}
                procedureSettingId={selectedProcedureId!}
                serverStep={null}
                stepIndex={
                  pendingDraftKeys.length + serverSteps.length + index + 1
                }
                onSaved={() => handleStepSaved(selectedProcedureId!, draftKey)}
                onDelete={() => removeDraftStep(selectedProcedureId!, draftKey)}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      <AddStageDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        currentTabType={currentTabType}
        onSuccess={(newStage) => {
          handleCreateProcedure(newStage);
          setAddDialogOpen(false);
        }}
      />
      <EditStageDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setProcedureToEdit(null);
        }}
        procedure={procedureToEdit}
        onDeleted={(procedureId) => {
          setDraftStepKeys((prev) => {
            const next = { ...prev };
            delete next[procedureId];
            return next;
          });
          queryClient.removeQueries({
            queryKey: ["procedure-steps", procedureId],
          });
        }}
        onSuccess={async () => {
          await refetch();
          if (procedureToEdit) {
            await queryClient.invalidateQueries({
              queryKey: ["procedure-steps", procedureToEdit.id],
            });
          }
        }}
      />

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
    </Box>
  );
});

export default StagesView;
