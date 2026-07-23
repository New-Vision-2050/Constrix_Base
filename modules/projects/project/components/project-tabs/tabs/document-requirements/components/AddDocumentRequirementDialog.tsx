"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useCreateProjectRequirements } from "@/modules/projects/project/query/useProjectRequirements";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import { ProjectSharingApi } from "@/services/api/projects/project-sharing";
import { buildCreateRequirementsPayload } from "../buildCreatePayload";
import type { RequirementEntry, RequirementFrequencyType } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
};

const DOCUMENT_TYPE_PROCEDURE = "project_procedure";

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
    documentTypeId: "",
    specialization: "",
    receiverCompanyIds: [],
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
    !entry.documentTypeId ||
    !entry.frequencyType
  ) {
    return false;
  }
  if (entry.frequencyType === "day") return entry.selectedDays.length > 0;
  return Number(entry.interval) > 0;
}

export default function AddDocumentRequirementDialog({
  open,
  onClose,
}: Props) {
  const t = useTranslations("project.documentRequirements");
  const tValidation = useTranslations("project.documentRequirements.validation");
  const { projectId } = useProject();
  const createMutation = useCreateProjectRequirements(projectId);

  const [entries, setEntries] = useState<RequirementEntry[]>([createEntry()]);
  const [submitted, setSubmitted] = useState(false);

  const { data: documentTypes = [], isLoading: loadingDocumentTypes } =
    useQuery({
      queryKey: ["internal-procedures", DOCUMENT_TYPE_PROCEDURE, projectId],
      queryFn: async () => {
        if (!projectId) return [];
        return InternalProcedureSettingsApi.getInternalProcedures(
          DOCUMENT_TYPE_PROCEDURE,
          { projectId },
        );
      },
      enabled: !!projectId && open,
    });

  const { data: sharedCompanies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ["shared-companies", projectId, "document-requirements"],
    queryFn: async () => {
      if (!projectId) return [];
      const res = await ProjectSharingApi.getSharedCompanies(projectId);
      return res.data.payload ?? [];
    },
    enabled: !!projectId && open,
  });

  const documentTypeOptions = useMemo(
    () =>
      documentTypes.map((procedure) => ({
        value: procedure.id,
        label: procedure.name || procedure.id,
      })),
    [documentTypes],
  );

  const companyOptions = useMemo(
    () =>
      sharedCompanies.map((company) => ({
        value: String(company.id),
        label: company.name,
      })),
    [sharedCompanies],
  );

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
    if (createMutation.isPending) return;
    setEntries([createEntry()]);
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!projectId) {
      toast.error(tValidation("projectRequired"));
      return;
    }

    const hasFilledAnyRow = entries.some(
      (entry) =>
        entry.requirementCode.trim() ||
        entry.requiredDocumentName.trim() ||
        entry.document.trim() ||
        entry.documentTypeId ||
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
        entry.documentTypeId ||
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
      if (!entry.documentTypeId) {
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

    try {
      const res = await createMutation.mutateAsync(
        buildCreateRequirementsPayload(validEntries),
      );
      toast.success(res.data?.message ?? t("submitSuccess"));
      setEntries([createEntry()]);
      setSubmitted(false);
      onClose();
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? t("submitError");
      toast.error(message);
    }
  };

  const getFieldError = (
    entry: RequirementEntry,
    field:
      | "requirementCode"
      | "requiredDocumentName"
      | "document"
      | "documentType"
      | "frequencyType",
  ) => {
    if (!submitted) return false;
    if (field === "requirementCode") return !entry.requirementCode.trim();
    if (field === "requiredDocumentName")
      return !entry.requiredDocumentName.trim();
    if (field === "document") return !entry.document.trim();
    if (field === "documentType") return !entry.documentTypeId;
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
              <Table size="small" sx={{ minWidth: 1500 }}>
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
                    <TableCell sx={{ minWidth: 200, whiteSpace: "nowrap" }}>
                      {t("documentType")} *
                    </TableCell>
                    <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>
                      {t("specialization")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 220, whiteSpace: "nowrap" }}>
                      {t("receiverCompanies")}
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
                          value={entry.documentTypeId}
                          onChange={(e) => {
                            const selected = documentTypeOptions.find(
                              (option) => option.value === e.target.value,
                            );
                            updateEntry(entry.id, {
                              documentTypeId: e.target.value,
                              documentType: selected?.label ?? "",
                            });
                          }}
                          size="small"
                          fullWidth
                          disabled={loadingDocumentTypes}
                          error={getFieldError(entry, "documentType")}
                        >
                          <MenuItem value="" disabled>
                            {loadingDocumentTypes
                              ? t("loading")
                              : t("selectDocumentType")}
                          </MenuItem>
                          {documentTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={entry.specialization}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              specialization: e.target.value,
                            })
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ minWidth: 200 }}>
                          <SearchableSelect
                            multiple
                            options={companyOptions}
                            value={entry.receiverCompanyIds}
                            onChange={(value) =>
                              updateEntry(entry.id, {
                                receiverCompanyIds: value.map(String),
                              })
                            }
                            placeholder={
                              loadingCompanies
                                ? t("loading")
                                : t("selectReceiverCompanies")
                            }
                            searchPlaceholder={t("search")}
                            noResultsText={t("noResults")}
                            disabled={
                              loadingCompanies || createMutation.isPending
                            }
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={entry.frequencyType}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              frequencyType: e.target
                                .value as RequirementFrequencyType,
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
                          disabled={
                            entries.length <= 1 || createMutation.isPending
                          }
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
            disabled={createMutation.isPending}
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
        <Button onClick={handleClose} disabled={createMutation.isPending}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          startIcon={
            createMutation.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {t("add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
