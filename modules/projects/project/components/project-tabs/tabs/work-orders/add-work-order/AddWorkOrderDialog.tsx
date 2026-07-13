"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Add as AddIcon, DeleteOutline } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectContractors } from "@/modules/projects/project/query/useProjectContractors";
import {
  getOrderPermitDepartmentLabel,
  getOrderPermitLabel,
  useOrderPermitDepartments,
  useOrderPermits,
} from "@/modules/projects/project/query/useOrderPermitOptions";

const STEP_KEYS = ["workOrderData", "review"] as const;

export interface WorkOrderEntry {
  id: string;
  workOrderId: string;
  workOrderType: string;
  assignmentDate: string;
  contractor: string;
  management: string;
  location: string;
  length: string;
  width: string;
  price: string;
}

function generateWorkOrderId(): string {
  const year = new Date().getFullYear();
  const suffix = Math.floor(Math.random() * 100_000)
    .toString()
    .padStart(5, "0");
  return `VD-${year}-${suffix}`;
}

function createWorkOrderEntry(): WorkOrderEntry {
  return {
    id: crypto.randomUUID(),
    workOrderId: generateWorkOrderId(),
    workOrderType: "",
    assignmentDate: "",
    contractor: "",
    management: "",
    location: "",
    length: "",
    width: "",
    price: "",
  };
}

function formatPrice(value: string): string {
  const num = Number(value.replace(/,/g, ""));
  if (Number.isNaN(num)) return value;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function displayValue(value: string, emptyDash: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : emptyDash;
}

export interface AddWorkOrderDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddWorkOrderDialog({
  open,
  onClose,
}: AddWorkOrderDialogProps) {
  const { projectId, projectData } = useProject();
  const projectTypeId = projectData?.project_type_id;
  const t = useTranslations("project.workOrdersTab.dialog");
  const tFields = useTranslations("project.workOrdersTab.dialog.fields");
  const tReview = useTranslations("project.workOrdersTab.dialog.review");
  const tValidation = useTranslations("project.workOrdersTab.dialog.validation");

  const [activeStep, setActiveStep] = useState(0);
  const [entries, setEntries] = useState<WorkOrderEntry[]>([
    createWorkOrderEntry(),
  ]);
  const [confirmedReview, setConfirmedReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const contractorsQuery = useProjectContractors(open ? projectId : undefined);
  const orderPermitsQuery = useOrderPermits(open ? projectTypeId : undefined);
  const orderPermitDepartmentsQuery = useOrderPermitDepartments(
    open ? projectTypeId : undefined,
  );

  const contractorOptions = useMemo(
    () =>
      (contractorsQuery.data ?? [])
        .map((c) => c.name.trim())
        .filter(Boolean),
    [contractorsQuery.data],
  );

  const orderPermitLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of orderPermitsQuery.data ?? []) {
      map.set(String(item.id), getOrderPermitLabel(item));
    }
    return map;
  }, [orderPermitsQuery.data]);

  const orderPermitDepartmentLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of orderPermitDepartmentsQuery.data ?? []) {
      map.set(String(item.id), getOrderPermitDepartmentLabel(item));
    }
    return map;
  }, [orderPermitDepartmentsQuery.data]);

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setEntries([createWorkOrderEntry()]);
      setConfirmedReview(false);
      setSubmitting(false);
    }
  }, [open]);

  const stepLabels = useMemo(
    () => STEP_KEYS.map((key) => t(`steps.${key}`)),
    [t],
  );

  const emptyDash = t("emptyDash");

  const updateEntry = (
    id: string,
    patch: Partial<Omit<WorkOrderEntry, "id">>,
  ) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, createWorkOrderEntry()]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((entry) => entry.id !== id);
    });
  };

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      if (entries.length === 0) {
        toast.error(tValidation("rowsRequired"));
        return false;
      }

      for (const entry of entries) {
        const hasAny =
          entry.workOrderId.trim() ||
          entry.workOrderType ||
          entry.assignmentDate ||
          entry.contractor ||
          entry.management ||
          entry.price.trim();

        if (!hasAny) continue;

        if (!entry.workOrderId.trim()) {
          toast.error(tValidation("workOrderIdRequired"));
          return false;
        }
        if (!entry.workOrderType) {
          toast.error(tValidation("workOrderTypeRequired"));
          return false;
        }
        if (!entry.assignmentDate) {
          toast.error(tValidation("assignmentDateRequired"));
          return false;
        }
        if (!entry.contractor) {
          toast.error(tValidation("contractorRequired"));
          return false;
        }
        if (!entry.management) {
          toast.error(tValidation("managementRequired"));
          return false;
        }
        if (!entry.price.trim()) {
          toast.error(tValidation("priceRequired"));
          return false;
        }
      }

      const validEntries = entries.filter(
        (entry) =>
          entry.workOrderId.trim() &&
          entry.workOrderType &&
          entry.assignmentDate &&
          entry.contractor &&
          entry.management &&
          entry.price.trim(),
      );

      if (validEntries.length === 0) {
        toast.error(tValidation("rowsRequired"));
        return false;
      }

      return true;
    }

    if (step === 1) {
      if (!confirmedReview) {
        toast.error(tValidation("confirmRequired"));
        return false;
      }
      return true;
    }

    return true;
  };

  const validEntries = useMemo(
    () =>
      entries.filter(
        (entry) =>
          entry.workOrderId.trim() &&
          entry.workOrderType &&
          entry.assignmentDate &&
          entry.contractor &&
          entry.management &&
          entry.price.trim(),
      ),
    [entries],
  );

  const handleNext = async () => {
    if (!validateStep(activeStep)) return;

    if (activeStep === STEP_KEYS.length - 1) {
      setSubmitting(true);
      try {
        // TODO: wire to API when available
        await new Promise((resolve) => setTimeout(resolve, 400));
        toast.success(t("submitSuccess"));
        onClose();
      } catch {
        toast.error(t("submitError"));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setActiveStep((step) => step + 1);
  };

  const handleBack = () => {
    setActiveStep((step) => Math.max(step - 1, 0));
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const renderEntriesTable = (readOnly: boolean) => (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 1400 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 130, whiteSpace: "nowrap" }}>
                {tFields("workOrderId")} *
              </TableCell>
              <TableCell sx={{ minWidth: 150, whiteSpace: "nowrap" }}>
                {tFields("workOrderType")} *
              </TableCell>
              <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>
                {tFields("assignmentDate")} *
              </TableCell>
              <TableCell sx={{ minWidth: 160, whiteSpace: "nowrap" }}>
                {tFields("contractor")} *
              </TableCell>
              <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>
                {tFields("management")} *
              </TableCell>
              <TableCell sx={{ minWidth: 160, whiteSpace: "nowrap" }}>
                {tFields("location")}
              </TableCell>
              <TableCell sx={{ minWidth: 90, whiteSpace: "nowrap" }}>
                {tFields("length")}
              </TableCell>
              <TableCell sx={{ minWidth: 90, whiteSpace: "nowrap" }}>
                {tFields("width")}
              </TableCell>
              <TableCell sx={{ minWidth: 130, whiteSpace: "nowrap" }}>
                {tFields("price")} *
              </TableCell>
              {!readOnly ? <TableCell width={56} /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {(readOnly ? validEntries : entries).map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {readOnly ? (
                    entry.workOrderId
                  ) : (
                    <TextField
                      value={entry.workOrderId}
                      onChange={(e) =>
                        updateEntry(entry.id, { workOrderId: e.target.value })
                      }
                      size="small"
                      fullWidth
                      required
                    />
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    orderPermitLabelMap.get(entry.workOrderType) ??
                    entry.workOrderType
                  ) : (
                    <TextField
                      select
                      value={entry.workOrderType}
                      onChange={(e) =>
                        updateEntry(entry.id, {
                          workOrderType: e.target.value,
                        })
                      }
                      size="small"
                      fullWidth
                      required
                      disabled={orderPermitsQuery.isLoading}
                    >
                      <MenuItem value="">
                        <em>{tFields("selectType")}</em>
                      </MenuItem>
                      {(orderPermitsQuery.data ?? []).map((item) => (
                        <MenuItem key={item.id} value={String(item.id)}>
                          {getOrderPermitLabel(item)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    entry.assignmentDate
                  ) : (
                    <TextField
                      type="date"
                      value={entry.assignmentDate}
                      onChange={(e) =>
                        updateEntry(entry.id, {
                          assignmentDate: e.target.value,
                        })
                      }
                      size="small"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    entry.contractor
                  ) : (
                    <TextField
                      select
                      value={entry.contractor}
                      onChange={(e) =>
                        updateEntry(entry.id, { contractor: e.target.value })
                      }
                      size="small"
                      fullWidth
                      required
                    >
                      <MenuItem value="">
                        <em>{tFields("selectContractor")}</em>
                      </MenuItem>
                      {contractorOptions.map((contractor) => (
                        <MenuItem key={contractor} value={contractor}>
                          {contractor}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    orderPermitDepartmentLabelMap.get(entry.management) ??
                    entry.management
                  ) : (
                    <TextField
                      select
                      value={entry.management}
                      onChange={(e) =>
                        updateEntry(entry.id, { management: e.target.value })
                      }
                      size="small"
                      fullWidth
                      required
                      disabled={orderPermitDepartmentsQuery.isLoading}
                    >
                      <MenuItem value="">
                        <em>{tFields("selectManagement")}</em>
                      </MenuItem>
                      {(orderPermitDepartmentsQuery.data ?? []).map((item) => (
                        <MenuItem key={item.id} value={String(item.id)}>
                          {getOrderPermitDepartmentLabel(item)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    displayValue(entry.location, emptyDash)
                  ) : (
                    <TextField
                      value={entry.location}
                      onChange={(e) =>
                        updateEntry(entry.id, { location: e.target.value })
                      }
                      size="small"
                      fullWidth
                    />
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    displayValue(entry.length, emptyDash)
                  ) : (
                    <TextField
                      value={entry.length}
                      onChange={(e) =>
                        updateEntry(entry.id, { length: e.target.value })
                      }
                      size="small"
                      fullWidth
                      type="number"
                      inputProps={{ step: "0.001" }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    displayValue(entry.width, emptyDash)
                  ) : (
                    <TextField
                      value={entry.width}
                      onChange={(e) =>
                        updateEntry(entry.id, { width: e.target.value })
                      }
                      size="small"
                      fullWidth
                      type="number"
                      inputProps={{ step: "0.001" }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    formatPrice(entry.price)
                  ) : (
                    <TextField
                      value={entry.price}
                      onChange={(e) =>
                        updateEntry(entry.id, { price: e.target.value })
                      }
                      onBlur={() => {
                        if (entry.price.trim()) {
                          updateEntry(entry.id, {
                            price: formatPrice(entry.price),
                          });
                        }
                      }}
                      size="small"
                      fullWidth
                      required
                    />
                  )}
                </TableCell>
                {!readOnly ? (
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => removeEntry(entry.id)}
                      disabled={entries.length <= 1}
                      aria-label={tFields("delete")}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          pt: 1,
        }}
      >
        <IconButton onClick={handleClose} aria-label={t("cancel")} disabled={submitting}>
          <Close />
        </IconButton>
        <DialogTitle sx={{ flex: 1, textAlign: "center", pr: 6, m: 0 }}>
          {t("title")}
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {stepLabels.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? (
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t("listTitle")}
            </Typography>
            {renderEntriesTable(false)}
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={addEntry}
              sx={{
                alignSelf: "stretch",
                borderStyle: "dashed",
                py: 1.5,
              }}
            >
              + {t("addNewRow")}
            </Button>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            {renderEntriesTable(true)}
            <FormControlLabel
              control={
                <Checkbox
                  checked={confirmedReview}
                  onChange={(e) => setConfirmedReview(e.target.checked)}
                  color="secondary"
                />
              }
              label={tReview("confirmLabel")}
            />
          </Stack>
        )}

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: activeStep === 0 ? "flex-start" : "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {activeStep > 0 ? (
            <Button variant="outlined" onClick={handleBack} disabled={submitting}>
              {t("back")}
            </Button>
          ) : null}

          {activeStep === 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={submitting}
              sx={{ minWidth: 120 }}
            >
              {t("next")}
            </Button>
          ) : (
            <Stack direction="row" spacing={1} sx={{ ms: "auto" }}>
              <Button variant="outlined" onClick={handleClose} disabled={submitting}>
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={submitting || !confirmedReview}
              >
                {t("submit")}
              </Button>
            </Stack>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
