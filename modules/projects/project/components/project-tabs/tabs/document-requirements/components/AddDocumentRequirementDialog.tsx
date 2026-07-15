"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";

export type NewDocumentRequirement = {
  requirementCode: string;
  requiredDocumentName: string;
  document: string;
  documentType: string;
  specialization: string;
  frequency: string;
};

type FrequencyType = "day" | "week" | "month";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (requirement: NewDocumentRequirement) => void;
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

const INITIAL_FORM = {
  requirementCode: "",
  requiredDocumentName: "",
  document: "",
  documentType: "",
  specialization: "",
  frequencyType: "" as FrequencyType | "",
  selectedDays: [] as string[],
  interval: "",
};

export default function AddDocumentRequirementDialog({
  open,
  onClose,
  onAdd,
}: Props) {
  const t = useTranslations("project.documentRequirements");
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(() => {
    const baseFieldsValid =
      form.requirementCode.trim() &&
      form.requiredDocumentName.trim() &&
      form.document.trim() &&
      form.documentType &&
      form.frequencyType;

    if (!baseFieldsValid) return false;
    if (form.frequencyType === "day") return form.selectedDays.length > 0;
    return Number(form.interval) > 0;
  }, [form]);

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!isValid) return;

    const frequency =
      form.frequencyType === "day"
        ? form.selectedDays
            .map((day) => t(`weekDays.${day}` as "weekDays.saturday"))
            .join("، ")
        : t(
            form.frequencyType === "week"
              ? "everyWeeks"
              : "everyMonths",
            { count: Number(form.interval) },
          );

    onAdd({
      requirementCode: form.requirementCode.trim(),
      requiredDocumentName: form.requiredDocumentName.trim(),
      document: form.document.trim(),
      documentType: form.documentType,
      specialization: form.specialization,
      frequency,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("addRequirement")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            required
            label={t("requirementCode")}
            value={form.requirementCode}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                requirementCode: event.target.value,
              }))
            }
            error={submitted && !form.requirementCode.trim()}
          />
          <TextField
            required
            label={t("requiredDocumentName")}
            value={form.requiredDocumentName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                requiredDocumentName: event.target.value,
              }))
            }
            error={submitted && !form.requiredDocumentName.trim()}
          />
          <TextField
            required
            label={t("document")}
            value={form.document}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                document: event.target.value,
              }))
            }
            error={submitted && !form.document.trim()}
          />
          <TextField
            required
            select
            label={t("documentType")}
            value={form.documentType}
            onChange={(event) => {
              const selectedType = DOCUMENT_TYPES.find(
                (type) => type.value === event.target.value,
              );
              setForm((current) => ({
                ...current,
                documentType: event.target.value,
                specialization: selectedType?.specialization ?? "",
              }));
            }}
            error={submitted && !form.documentType}
          >
            {DOCUMENT_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t("specialization")}
            value={form.specialization}
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            required
            select
            label={t("frequency")}
            value={form.frequencyType}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                frequencyType: event.target.value as FrequencyType,
                selectedDays: [],
                interval: "",
              }))
            }
            error={submitted && !form.frequencyType}
          >
            <MenuItem value="day">{t("frequencyDay")}</MenuItem>
            <MenuItem value="week">{t("frequencyWeek")}</MenuItem>
            <MenuItem value="month">{t("frequencyMonth")}</MenuItem>
          </TextField>

          {form.frequencyType === "day" ? (
            <FormGroup row>
              {WEEK_DAYS.map((day) => (
                <FormControlLabel
                  key={day}
                  label={t(`weekDays.${day}`)}
                  control={
                    <Checkbox
                      checked={form.selectedDays.includes(day)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          selectedDays: event.target.checked
                            ? [...current.selectedDays, day]
                            : current.selectedDays.filter(
                                (selectedDay) => selectedDay !== day,
                              ),
                        }))
                      }
                    />
                  }
                />
              ))}
            </FormGroup>
          ) : null}

          {form.frequencyType === "week" ||
          form.frequencyType === "month" ? (
            <TextField
              required
              type="number"
              label={
                form.frequencyType === "week"
                  ? t("weekInterval")
                  : t("monthInterval")
              }
              value={form.interval}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interval: event.target.value,
                }))
              }
              error={submitted && Number(form.interval) <= 0}
              slotProps={{ htmlInput: { min: 1 } }}
            />
          ) : null}
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
