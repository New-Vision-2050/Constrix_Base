"use client";

import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Delete, Edit, Settings } from "@mui/icons-material";
import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/modules/table/hooks/use-toast";
import AddStageDialog from "./dialogs/AddStageDialog";
import EditStageDialog from "./dialogs/EditStageDialog";
import StepCard from "./StepCard";
import { APP_ICONS } from "@/constants/icons";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import {
  Stage,
  GetStagesResponse,
  ProcedureStep,
  GetStepsResponse,
} from "@/services/api/crm-settings/procedure-settings/types/response";

interface StagesViewProps {
  currentTabType?: string;
  branchId?: number;
}

export default function StagesView({
  currentTabType = "client_request",
  branchId,
}: StagesViewProps) {
  const t = useTranslations("CRMSettingsModule.proceduresSettings");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stagesResponse, refetch } = useQuery<GetStagesResponse>({
    queryKey: ["procedure-settings", "stages", currentTabType, branchId],
    queryFn: async () => {
      const response = await ProcedureSettingsApi.getStages(
        currentTabType,
        branchId,
      );
      return response.data;
    },
  });

  // Extract work_flow_id and stages from the new response structure
  const workFlowId = stagesResponse?.payload?.id ?? "";
  const procedures = useMemo(() => {
    const payload = stagesResponse?.payload;
    const stages = payload?.["procedure-settings"];
    return Array.isArray(stages) ? stages : [];
  }, [stagesResponse]);

  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(
    null,
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [procedureToEdit, setProcedureToEdit] = useState<Stage | null>(null);
  const [draftStepKeys, setDraftStepKeys] = useState<Record<string, string[]>>(
    {},
  );
  const [pendingDraftKeys, setPendingDraftKeys] = useState<string[]>([]);

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

  // --- Procedure CRUD ---

  const handleCreateProcedure = async (payload: {
    name: string;
    type: string;
    execute_type: string;
    icon: string;
    percentage: number;
    deadline_days: number;
    deadline_hours: number;
    escalation_user_id: string;
  }) => {
    if (!workFlowId) {
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

  // const handleDeleteProcedure = async (
  //   e: React.MouseEvent,
  //   procedureId: string,
  // ) => {
  //   e.stopPropagation();
  //   try {
  //     await ProcedureSettingsApi.deleteStage(procedureId);
  //     setDraftStepKeys((prev) => {
  //       const next = { ...prev };
  //       delete next[procedureId];
  //       return next;
  //     });
  //     queryClient.removeQueries({
  //       queryKey: ["procedure-steps", procedureId],
  //     });
  //     await refetch();
  //     toast({
  //       title: t("actions.delete"),
  //       description: t("messages.procedureDeleted"),
  //       variant: "default",
  //     });
  //   } catch (error) {
  //     console.error("Error deleting procedure:", error);
  //     toast({
  //       title: t("actions.delete"),
  //       description: t("messages.error"),
  //       variant: "destructive",
  //     });
  //   }
  // };

  // --- Step management ---

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

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {currentTabType === "contract" && "اعداد إجراءات العقود"}
          {currentTabType === "meeting" && "اعداد إجراءات الاجتماعات"}
          {currentTabType === "price" && "اعداد إجراءات الأسعار"}
          {currentTabType === "employees" && "اعداد إجراءات الموظفين"}
          {currentTabType === "client_request" && "اعداد إجراءات طلبات العملاء"}
          {![
            "contract",
            "meeting",
            "price",
            "employees",
            "client_request",
          ].includes(currentTabType) && "اعداد إجراءات الطلبات"}
        </Typography>
        <Button
          variant="contained"
          onClick={handleAddStep}
          disabled={!selectedProcedureId}
        >
          اضافة مرحلة
        </Button>
      </Box>
      <Grid container spacing={2}>
        {/* Right sidebar - Procedures list */}
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
                  <IconButton
                    size="small"
                    sx={{ ml: "auto" }}
                    aria-label={t("stages.editStage")}
                    onClick={(e) => {
                      e.stopPropagation();
                      setProcedureToEdit(procedure);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Settings sx={{ fontSize: 24 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}

            <Button
              variant="text"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => setAddDialogOpen(true)}
              sx={{ justifyContent: "flex-start", mt: 2 }}
            >
              {t("procedures.addProcedureName")}
            </Button>
          </Box>
        </Grid>

        {/* Left content - Steps */}
        <Grid size={9}>
          <Box className="space-y-4">
            {/* Pending draft steps (added before any procedure was selected) */}
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
            {/* Saved steps from server */}
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

            {/* Draft (unsaved) steps */}
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
      {/* Add Procedure Dialog */}
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
    </Box>
  );
}
