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
  getOrderPermitLabel,
  useOrderPermits,
} from "@/modules/projects/project/query/useOrderPermitOptions";
import { useProjectManagements } from "@/modules/projects/project/query/useProjectManagements";
import { useProjectDistricts } from "@/modules/projects/project/query/useProjectDistricts";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import { buildCreateWorkOrdersPayload } from "./buildCreatePayload";

const STEP_KEYS = ["workOrderData", "review"] as const;

export interface WorkOrderEntry {
  id: string;
  workOrderId: string;
  workOrderType: string;
  assignmentDate: string;
  contractor: string;
  management: string;
  location: string;
  lat: string;
  long: string;
  price: string;
}

function createWorkOrderEntry(): WorkOrderEntry {
  return {
    id: crypto.randomUUID(),
    workOrderId: "",
    workOrderType: "",
    assignmentDate: "",
    contractor: "",
    management: "",
    location: "",
    lat: "",
    long: "",
    price: "",
  };
}

function parsePrice(value: string): number {
  const num = Number(value.replace(/,/g, ""));
  return Number.isNaN(num) ? 0 : num;
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
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

function isValidWorkOrderEntry(entry: WorkOrderEntry): boolean {
  return Boolean(
    entry.workOrderId.trim() &&
      entry.assignmentDate &&
      entry.contractor &&
      entry.price.trim(),
  );
}

function ManagementSelect({
  projectId,
  value,
  onChange,
  readOnly,
  emptyDash,
}: {
  projectId: string | undefined;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  emptyDash: string;
}) {
  const tFields = useTranslations("project.workOrdersTab.dialog.fields");
  const managementsQuery = useProjectManagements(projectId);

  if (readOnly) {
    const selected = (managementsQuery.data ?? []).find(
      (item) => String(item.id) === value,
    );
    return displayValue(selected?.name ?? value, emptyDash);
  }

  return (
    <TextField
      select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      size="small"
      fullWidth
      disabled={managementsQuery.isLoading}
    >
      <MenuItem value="">
        <em>{tFields("selectManagement")}</em>
      </MenuItem>
      {(managementsQuery.data ?? []).map((item) => (
        <MenuItem key={item.id} value={String(item.id)}>
          {item.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export interface AddWorkOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddWorkOrderDialog({
  open,
  onClose,
  onCreated,
}: AddWorkOrderDialogProps) {
  const { projectId } = useProject();
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
  const orderPermitsQuery = useOrderPermits(open);
  const districtsQuery = useProjectDistricts(open ? projectId : undefined);

  const contractorOptions = useMemo(
    () =>
      (contractorsQuery.data ?? []).filter(
        (contractor) => contractor.id && contractor.name.trim(),
      ),
    [contractorsQuery.data],
  );

  const contractorNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const contractor of contractorOptions) {
      map.set(contractor.id, contractor.name.trim());
    }
    return map;
  }, [contractorOptions]);

  const orderPermitLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of orderPermitsQuery.data ?? []) {
      map.set(String(item.id), getOrderPermitLabel(item));
    }
    return map;
  }, [orderPermitsQuery.data]);

  const districtLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const district of districtsQuery.data ?? []) {
      map.set(String(district.id), district.name);
    }
    return map;
  }, [districtsQuery.data]);

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
        if (!entry.assignmentDate) {
          toast.error(tValidation("assignmentDateRequired"));
          return false;
        }
        if (!entry.contractor) {
          toast.error(tValidation("contractorRequired"));
          return false;
        }
        if (!entry.price.trim()) {
          toast.error(tValidation("priceRequired"));
          return false;
        }
      }

      const validEntriesCount = entries.filter(isValidWorkOrderEntry).length;

      if (validEntriesCount === 0) {
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
    () => entries.filter(isValidWorkOrderEntry),
    [entries],
  );

  const reviewSummary = useMemo(() => {
    const totalPrice = validEntries.reduce(
      (sum, entry) => sum + parsePrice(entry.price),
      0,
    );
    const dates = validEntries
      .map((entry) => entry.assignmentDate)
      .filter(Boolean)
      .sort();
    const minDate = dates[0] ?? "";
    const maxDate = dates[dates.length - 1] ?? "";

    return {
      count: validEntries.length,
      totalPrice: totalPrice.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      dateRange:
        minDate && maxDate
          ? `${formatDisplayDate(minDate)} - ${formatDisplayDate(maxDate)}`
          : emptyDash,
    };
  }, [validEntries, emptyDash]);

  const handleNext = async () => {
    if (!validateStep(activeStep)) return;

    if (activeStep === STEP_KEYS.length - 1) {
      if (!projectId) {
        toast.error(t("submitError"));
        return;
      }

      setSubmitting(true);
      try {
        const payload = buildCreateWorkOrdersPayload(
          projectId,
          validEntries,
          orderPermitsQuery.data ?? [],
        );
        const res = await ProjectOrderPermitsApi.create(projectId, payload);
        toast.success(res.data?.message ?? t("submitSuccess"));
        onCreated?.();
        onClose();
      } catch (error: { response?: { data?: { message?: string } } }) {
        toast.error(error?.response?.data?.message ?? t("submitError"));
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
                {tFields("workOrderType")}
              </TableCell>
              <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>
                {tFields("assignmentDate")} *
              </TableCell>
              <TableCell sx={{ minWidth: 160, whiteSpace: "nowrap" }}>
                {tFields("contractor")} *
              </TableCell>
              <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>
                {tFields("management")}
              </TableCell>
              <TableCell sx={{ minWidth: 160, whiteSpace: "nowrap" }}>
                {tFields("location")}
              </TableCell>
              <TableCell sx={{ minWidth: 120, whiteSpace: "nowrap" }}>
                {tFields("latitude")}
              </TableCell>
              <TableCell sx={{ minWidth: 120, whiteSpace: "nowrap" }}>
                {tFields("longitude")}
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
                    displayValue(
                      orderPermitLabelMap.get(entry.workOrderType) ??
                        entry.workOrderType,
                      emptyDash,
                    )
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
                    formatDisplayDate(entry.assignmentDate)
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
                    displayValue(
                      contractorNameMap.get(entry.contractor) ?? entry.contractor,
                      emptyDash,
                    )
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
                      disabled={contractorsQuery.isLoading}
                    >
                      <MenuItem value="">
                        <em>{tFields("selectContractor")}</em>
                      </MenuItem>
                      {contractorOptions.map((contractor) => (
                        <MenuItem key={contractor.id} value={contractor.id}>
                          {contractor.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </TableCell>
                <TableCell>
                  <ManagementSelect
                    projectId={projectId}
                    value={entry.management}
                    onChange={(management) =>
                      updateEntry(entry.id, { management })
                    }
                    readOnly={readOnly}
                    emptyDash={emptyDash}
                  />
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    displayValue(
                      districtLabelMap.get(entry.location) ?? entry.location,
                      emptyDash,
                    )
                  ) : (
                    <TextField
                      select
                      value={entry.location}
                      onChange={(e) =>
                        updateEntry(entry.id, { location: e.target.value })
                      }
                      size="small"
                      fullWidth
                      disabled={districtsQuery.isLoading}
                    >
                      <MenuItem value="">
                        <em>{tFields("selectLocation")}</em>
                      </MenuItem>
                      {(districtsQuery.data ?? []).map((district) => (
                        <MenuItem key={district.id} value={String(district.id)}>
                          {district.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    displayValue(entry.lat, emptyDash)
                  ) : (
                    <TextField
                      value={entry.lat}
                      onChange={(e) =>
                        updateEntry(entry.id, { lat: e.target.value })
                      }
                      size="small"
                      fullWidth
                      type="number"
                      inputProps={{ step: "0.000001" }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    displayValue(entry.long, emptyDash)
                  ) : (
                    <TextField
                      value={entry.long}
                      onChange={(e) =>
                        updateEntry(entry.id, { long: e.target.value })
                      }
                      size="small"
                      fullWidth
                      type="number"
                      inputProps={{ step: "0.000001" }}
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="body2">
                <Box component="span" color="text.secondary">
                  {tReview("workOrdersCountLabel")}{" "}
                </Box>
                <Box component="span" fontWeight={700}>
                  {tReview("newWorkOrdersCount", { count: reviewSummary.count })}
                </Box>
              </Typography>
              <Typography variant="body2">
                <Box component="span" color="text.secondary">
                  {tReview("totalPriceLabel")}{" "}
                </Box>
                <Box component="span" fontWeight={700}>
                  {reviewSummary.totalPrice} {tReview("sarCurrency")}
                </Box>
              </Typography>
              <Typography variant="body2">
                <Box component="span" color="text.secondary">
                  {tReview("dateRangeLabel")}{" "}
                </Box>
                <Box component="span" fontWeight={700}>
                  {reviewSummary.dateRange}
                </Box>
              </Typography>
            </Box>

            <Typography variant="subtitle1" fontWeight={700}>
              {t("listTitle")}
            </Typography>
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
            direction: "rtl",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {activeStep === 0 ? (
            <Button
              
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={submitting}
              sx={{ minWidth: 120}}
              className="flex-end"
              >
              {t("next")}
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={submitting || !confirmedReview}
                sx={{ minWidth: 120 }}
              >
                {t("next")}
              </Button>
              <Button variant="outlined" onClick={handleBack} disabled={submitting}>
                {t("back")}
              </Button>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
