"use client";

import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Delete, Edit, Settings } from "@mui/icons-material";
import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/modules/table/hooks/use-toast";
import AddStageDialog from "./dialogs/AddStageDialog";
import StepCard from "./StepCard";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import {
  Stage,
  GetStagesResponse,
  ProcedureStep,
  GetStepsResponse,
} from "@/services/api/crm-settings/procedure-settings/types/response";

interface StagesViewProps {
  currentTabType?: string;
}

export default function StagesView({
  currentTabType = "client_request",
}: StagesViewProps) {
  const t = useTranslations("CRMSettingsModule.proceduresSettings");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stagesResponse, refetch } = useQuery<GetStagesResponse>({
    queryKey: ["procedure-settings", "stages"],
    queryFn: async () => {
      const response = await ProcedureSettingsApi.getStages();
      return response.data;
    },
  });

  const procedures = useMemo(
    () =>
      (stagesResponse?.payload || []).filter(
        (s: Stage) => s.type === currentTabType,
      ),
    [stagesResponse, currentTabType],
  );

  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(
    null,
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [draftStepKeys, setDraftStepKeys] = useState<Record<string, string[]>>(
    {},
  );

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

  const serverSteps: ProcedureStep[] = stepsResponse?.payload ?? [];

  // --- Procedure CRUD ---

  const handleCreateProcedure = async (payload: {
    name: string;
    type: string;
    execute_type: string;
    icon: string;
    percentage: number;
  }) => {
    try {
      await ProcedureSettingsApi.createStage(payload);
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
    if (!selectedProcedureId) return;
    const key = crypto.randomUUID();
    setDraftStepKeys((prev) => ({
      ...prev,
      [selectedProcedureId]: [...(prev[selectedProcedureId] ?? []), key],
    }));
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
    switch (iconName) {
      case "settings":
        return <Settings sx={{ fontSize: 18 }} />;
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Typography variant="h6" fontWeight={600}>
          {t("title")}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddStep}>
          {t("stages.addStage")}
        </Button>
      </div>
      <Grid container spacing={2}>
        {/* Right sidebar - Procedures list */}
        <Grid size={3}>
          <div className="space-y-2 bg-sidebar">
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
                  <IconButton size="small" sx={{ ml: "auto" }}>
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
          </div>
        </Grid>

        {/* Left content - Steps */}
        <Grid size={9}>
          <div className="space-y-4">
            {/* Saved steps from server */}
            {serverSteps.map((step) => (
              <StepCard
                key={`server-${step.id}`}
                procedureSettingId={selectedProcedureId!}
                serverStep={step}
                onSaved={() => handleStepSaved(selectedProcedureId!)}
                onDelete={() =>
                  handleDeleteServerStep(selectedProcedureId!, step.id)
                }
              />
            ))}

            {/* Draft (unsaved) steps */}
            {currentDraftKeys.map((draftKey) => (
              <StepCard
                key={`draft-${draftKey}`}
                procedureSettingId={selectedProcedureId!}
                serverStep={null}
                onSaved={() => handleStepSaved(selectedProcedureId!, draftKey)}
                onDelete={() => removeDraftStep(selectedProcedureId!, draftKey)}
              />
            ))}
          </div>
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
    </div>
  );
}
