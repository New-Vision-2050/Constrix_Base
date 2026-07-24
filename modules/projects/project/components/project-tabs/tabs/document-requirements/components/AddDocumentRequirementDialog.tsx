"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, DeleteOutline } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export type NewDocumentRequirement = {
  requirementCode: string;
  requiredDocumentName: string;
  document: string;
  documentType: string;
  specialization: string;
  frequency: string;
};

type FrequencyType = "day" | "week" | "month";

interface RequirementEntry {
  id: string;
  requirementCode: string;
  requiredDocumentName: string;
  document: string;
  documentType: string;
  specialization: string;
  frequencyType: FrequencyType | "";
  selectedDays: string[];
  interval: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (requirements: NewDocumentRequirement[]) => void;
};

const DOCUMENT_TYPES = [
  { value: "Technical Submittal", specialization: "كهرباء" },
  { value: "Material Submittal", specialization: "كهرباء" },
  { value: "As-Built", specialization: "ميكانيكا" },
  { value: "Method Statement", specialization: "مدني" },
  { value: "Inspection", specialization: "مدني" },
] as const;

const WEEK_DAYS = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

function createEntry(): RequirementEntry {
  return {
    id: crypto.randomUUID(),
    requirementCode: "",
    requiredDocumentName: "",
    document: "",
    documentType: "",
    specialization: "",
    frequencyType: "",
    selectedDays: [],
    interval: "",
  };
}

function isEntryValid(entry: RequirementEntry): boolean {
  if (
    !entry.requirementCode.trim() ||
    !entry.requiredDocumentName.trim() ||
    !entry.document.trim() ||
    !entry.documentType ||
    !entry.frequencyType
  ) {
    return false;
  }
  if (entry.frequencyType === "day") return entry.selectedDays.length > 0;
  return Number(entry.interval) > 0;
}

function buildFrequency(
  entry: RequirementEntry,
  t: ReturnType<typeof useTranslations>,
): string {
  if (entry.frequencyType === "day") {
    return entry.selectedDays
      .map((day) => t(`weekDays.${day}` as "weekDays.saturday"))
      .join("، ");
  }
  return t(
    entry.frequencyType === "week" ? "everyWeeks" : "everyMonths",
    { count: Number(entry.interval) },
  );
}

export default function AddDocumentRequirementDialog({
  open,
  onClose,
  onAdd,
}: Props) {
  const t = useTranslations("project.documentRequirements");
  const tValidation = useTranslations("project.documentRequirements.validation");
  const [entries, setEntries] = useState<RequirementEntry[]>([createEntry()]);
  const [submitted, setSubmitted] = useState(false);

  const updateEntry = (
    id: string,
    patch: Partial<Omit<RequirementEntry, "id">>,
  ) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, createEntry()]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((entry) => entry.id !== id);
    });
  };

  const validEntries = useMemo(
    () => entries.filter(isEntryValid),
    [entries],
  );

  const handleClose = () => {
    setEntries([createEntry()]);
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = () => {
    setSubmitted(true);

    const hasFilledAnyRow = entries.some(
      (entry) =>
        entry.requirementCode.trim() ||
        entry.requiredDocumentName.trim() ||
        entry.document.trim() ||
        entry.documentType ||
        entry.frequencyType,
    );

    if (!hasFilledAnyRow) {
      toast.error(tValidation("rowsRequired"));
      return;
    }

    for (const entry of entries) {
      const hasAny =
        entry.requirementCode.trim() ||
        entry.requiredDocumentName.trim() ||
        entry.document.trim() ||
        entry.documentType ||
        entry.frequencyType;
      if (!hasAny) continue;

      if (!entry.requirementCode.trim()) {
        toast.error(tValidation("requirementCodeRequired"));
        return;
      }
      if (!entry.requiredDocumentName.trim()) {
        toast.error(tValidation("requiredDocumentNameRequired"));
        return;
      }
      if (!entry.document.trim()) {
        toast.error(tValidation("documentRequired"));
        return;
      }
      if (!entry.documentType) {
        toast.error(tValidation("documentTypeRequired"));
        return;
      }
      if (!entry.frequencyType) {
        toast.error(tValidation("frequencyRequired"));
        return;
      }
      if (entry.frequencyType === "day" && entry.selectedDays.length === 0) {
        toast.error(tValidation("daysRequired"));
        return;
      }
      if (
        (entry.frequencyType === "week" || entry.frequencyType === "month") &&
        Number(entry.interval) <= 0
      ) {
        toast.error(tValidation("intervalRequired"));
        return;
      }
    }

    if (validEntries.length === 0) {
      toast.error(tValidation("rowsRequired"));
      return;
    }

    onAdd(
      validEntries.map((entry) => ({
        requirementCode: entry.requirementCode.trim(),
        requiredDocumentName: entry.requiredDocumentName.trim(),
        document: entry.document.trim(),
        documentType: entry.documentType,
        specialization: entry.specialization,
        frequency: buildFrequency(entry, t),
      })),
    );
    handleClose();
  };

  const getFieldError = (
    entry: RequirementEntry,
    field: "requirementCode" | "requiredDocumentName" | "document" | "documentType" | "frequencyType",
  ) => {
    if (!submitted) return false;
    if (field === "requirementCode") return !entry.requirementCode.trim();
    if (field === "requiredDocumentName") return !entry.requiredDocumentName.trim();
    if (field === "document") return !entry.document.trim();
    if (field === "documentType") return !entry.documentType;
    return !entry.frequencyType;
  };

  const getIntervalError = (entry: RequirementEntry) => {
    if (!submitted) return false;
    if (entry.frequencyType !== "week" && entry.frequencyType !== "month") {
      return false;
    }
    return Number(entry.interval) <= 0;
  };

  const getDaysError = (entry: RequirementEntry) => {
    if (!submitted) return false;
    return entry.frequencyType === "day" && entry.selectedDays.length === 0;
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
      <DialogTitle>{t("addRequirement")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t("listTitle")}
          </Typography>
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>
                      {t("requirementCode")} *
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: "nowrap" }}>
                      {t("requiredDocumentName")} *
                    </TableCell>
                    <TableCell sx={{ minWidth: 160, whiteSpace: "nowrap" }}>
                      {t("document")} *
                    </TableCell>
                    <TableCell sx={{ minWidth: 160, whiteSpace: "nowrap" }}>
                      {t("documentType")} *
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, whiteSpace: "nowrap" }}>
                      {t("specialization")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, whiteSpace: "nowrap" }}>
                      {t("frequency")} *
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: "nowrap" }}>
                      {t("frequencyDay")} / {t("weekInterval")}
                    </TableCell>
                    <TableCell width={56} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <TextField
                          value={entry.requirementCode}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              requirementCode: e.target.value,
                            })
                          }
                          size="small"
                          fullWidth
                          error={getFieldError(entry, "requirementCode")}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={entry.requiredDocumentName}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              requiredDocumentName: e.target.value,
                            })
                          }
                          size="small"
                          fullWidth
                          error={getFieldError(entry, "requiredDocumentName")}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={entry.document}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              document: e.target.value,
                            })
                          }
                          size="small"
                          fullWidth
                          error={getFieldError(entry, "document")}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={entry.documentType}
                          onChange={(e) => {
                            const selectedType = DOCUMENT_TYPES.find(
                              (type) => type.value === e.target.value,
                            );
                            updateEntry(entry.id, {
                              documentType: e.target.value,
                              specialization: selectedType?.specialization ?? "",
                            });
                          }}
                          size="small"
                          fullWidth
                          error={getFieldError(entry, "documentType")}
                        >
                          {DOCUMENT_TYPES.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.value}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={entry.specialization}
                          size="small"
                          fullWidth
                          slotProps={{ input: { readOnly: true } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={entry.frequencyType}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              frequencyType: e.target.value as FrequencyType,
                              selectedDays: [],
                              interval: "",
                            })
                          }
                          size="small"
                          fullWidth
                          error={getFieldError(entry, "frequencyType")}
                        >
                          <MenuItem value="day">{t("frequencyDay")}</MenuItem>
                          <MenuItem value="week">{t("frequencyWeek")}</MenuItem>
                          <MenuItem value="month">{t("frequencyMonth")}</MenuItem>
                        </TextField>
                      </TableCell>
                      <TableCell>
                        {entry.frequencyType === "day" ? (
                          <FormGroup row sx={{ gap: 0.5 }}>
                            {WEEK_DAYS.map((day) => (
                              <FormControlLabel
                                key={day}
                                label={t(`weekDays.${day}`)}
                                sx={{ mr: 1, mb: 0 }}
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={entry.selectedDays.includes(day)}
                                    onChange={(event) =>
                                      updateEntry(entry.id, {
                                        selectedDays: event.target.checked
                                          ? [...entry.selectedDays, day]
                                          : entry.selectedDays.filter(
                                              (selectedDay) =>
                                                selectedDay !== day,
                                            ),
                                      })
                                    }
                                  />
                                }
                              />
                            ))}
                          </FormGroup>
                        ) : entry.frequencyType === "week" ||
                          entry.frequencyType === "month" ? (
                          <TextField
                            type="number"
                            value={entry.interval}
                            onChange={(e) =>
                              updateEntry(entry.id, {
                                interval: e.target.value,
                              })
                            }
                            size="small"
                            fullWidth
                            error={getIntervalError(entry)}
                            slotProps={{ htmlInput: { min: 1 } }}
                          />
                        ) : null}
                        {getDaysError(entry) ? (
                          <Typography variant="caption" color="error">
                            {tValidation("daysRequired")}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="secondary"
                          onClick={() => removeEntry(entry.id)}
                          disabled={entries.length <= 1}
                          aria-label={t("delete")}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
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
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>{t("cancel")}</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {t("add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
