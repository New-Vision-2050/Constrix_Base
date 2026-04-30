"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type { ReportWizardPayload } from "./types";
import { createInitialReportWizardPayload } from "./initial-payload";
import WizardStepTemplatePick, {
  WIZARD_TEMPLATE_SCRATCH_VALUE,
} from "./steps/WizardStepTemplatePick";
import WizardStep1 from "./steps/WizardStep1";
import WizardStep2 from "./steps/WizardStep2";
import WizardStep3 from "./steps/WizardStep3";
import WizardStep4 from "./steps/WizardStep4";
import WizardStep5 from "./steps/WizardStep5";
import WizardStepReview from "./steps/WizardStepReview";

const TOTAL_STEPS = 7;

export type ReportCreationWizardDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Called on final step with the full collected payload. */
  onSubmit?: (payload: ReportWizardPayload) => void | Promise<void>;
  /** Optional: persist wizard payload as a reusable template (same snapshot as submit). */
  onSaveTemplate?: (payload: ReportWizardPayload) => void | Promise<void>;
};

export default function ReportCreationWizardDialog({
  open,
  onClose,
  onSubmit,
  onSaveTemplate,
}: ReportCreationWizardDialogProps) {
  const t = useTranslations("HRReports.attendanceReport.wizard");

  const [activeStep, setActiveStep] = useState(0);
  const [payload, setPayload] = useState<ReportWizardPayload>(
    createInitialReportWizardPayload(),
  );
  const [creatingReport, setCreatingReport] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templatePickerKey, setTemplatePickerKey] = useState(0);
  const [templateSelection, setTemplateSelection] = useState<string>(
    WIZARD_TEMPLATE_SCRATCH_VALUE,
  );

  const busy = creatingReport || savingTemplate;

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setPayload(createInitialReportWizardPayload());
      setCreatingReport(false);
      setSavingTemplate(false);
      setTemplateSelection(WIZARD_TEMPLATE_SCRATCH_VALUE);
      setTemplatePickerKey((k) => k + 1);
    }
  }, [open]);

  const patchStep1 = useCallback(
    (patch: Partial<ReportWizardPayload["step1"]>) => {
      setPayload((p) => ({
        ...p,
        step1: { ...p.step1, ...patch },
      }));
    },
    [],
  );

  const patchStep2 = useCallback(
    (patch: Partial<ReportWizardPayload["step2"]>) => {
      setPayload((p) => ({
        ...p,
        step2: { ...p.step2, ...patch },
      }));
    },
    [],
  );

  const patchStep3 = useCallback(
    (patch: Partial<ReportWizardPayload["step3"]>) => {
      setPayload((p) => ({
        ...p,
        step3: { ...p.step3, ...patch },
      }));
    },
    [],
  );

  const patchStep4 = useCallback(
    (patch: Partial<ReportWizardPayload["step4"]>) => {
      setPayload((p) => ({
        ...p,
        step4: { ...p.step4, ...patch },
      }));
    },
    [],
  );

  const patchStep5 = useCallback(
    (patch: Partial<ReportWizardPayload["step5"]>) => {
      setPayload((p) => ({
        ...p,
        step5: { ...p.step5, ...patch },
      }));
    },
    [],
  );

  const handleFinish = async () => {
    setCreatingReport(true);
    try {
      await onSubmit?.(payload);
      onClose();
    } finally {
      setCreatingReport(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!onSaveTemplate) return;
    setSavingTemplate(true);
    try {
      await onSaveTemplate(payload);
    } finally {
      setSavingTemplate(false);
    }
  };

  const stepLabels = useMemo(
    () =>
      [
        t("stepLabelTemplate"),
        t("stepLabel1"),
        t("stepLabel2"),
        t("stepLabel3"),
        t("stepLabel4"),
        t("stepLabel5"),
        t("stepLabel6"),
      ] as const,
    [t],
  );

  let body: React.ReactNode;
  switch (activeStep) {
    case 0:
      body = (
        <WizardStepTemplatePick
          key={templatePickerKey}
          dialogOpen={open}
          selectionValue={templateSelection}
          onSelectScratch={() => {
            setTemplateSelection(WIZARD_TEMPLATE_SCRATCH_VALUE);
            setPayload(createInitialReportWizardPayload());
          }}
          onSelectTemplateRow={(row) => {
            setTemplateSelection(row.id);
            setPayload(row.payload);
          }}
        />
      );
      break;
    case 1:
      body = <WizardStep1 value={payload.step1} onChange={patchStep1} />;
      break;
    case 2:
      body = (
        <WizardStep2 value={payload.step2} onChange={patchStep2} />
      );
      break;
    case 3:
      body = (
        <WizardStep3 value={payload.step3} onChange={patchStep3} />
      );
      break;
    case 4:
      body = (
        <WizardStep4 value={payload.step4} onChange={patchStep4} />
      );
      break;
    case 5:
      body = (
        <WizardStep5 value={payload.step5} onChange={patchStep5} />
      );
      break;
    default:
      body = (
        <WizardStepReview
          payload={payload}
          creatingReport={creatingReport}
          savingTemplate={savingTemplate}
          onCreateReport={handleFinish}
          onSaveTemplate={
            onSaveTemplate ? () => handleSaveTemplate() : undefined
          }
        />
      );
  }

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          minHeight: "72vh",
          bgcolor: "background.paper",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="span" fontWeight={700}>
          {t("title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t("subtitle")}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          {t("stepIndicator", { current: activeStep + 1, total: TOTAL_STEPS })}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Box sx={{ overflowX: "auto", width: "100%", mb: 3 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ minWidth: { xs: 640, sm: 760 } }}
          >
            {stepLabels.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ minHeight: 280 }}>{body}</Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          color="inherit"
          disabled={activeStep === 0 || busy}
          onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
        >
          {t("back")}
        </Button>

        {activeStep < TOTAL_STEPS - 1 ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {activeStep === 0 ? (
              <Button
                variant="outlined"
                color="inherit"
                disabled={
                  busy ||
                  templateSelection === WIZARD_TEMPLATE_SCRATCH_VALUE
                }
                onClick={() => setActiveStep(TOTAL_STEPS - 1)}
              >
                {t("skipToReview")}
              </Button>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              disabled={busy}
              onClick={() =>
                setActiveStep((s) => Math.min(TOTAL_STEPS - 1, s + 1))
              }
            >
              {t("next")}
            </Button>
          </Box>
        ) : (
          <Box sx={{ width: 120 }} />
        )}
      </DialogActions>
    </Dialog>
  );
}
