"use client";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Close, List } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import { normalizeInternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/normalize";
import { AttachmentRequestsApi } from "@/services/api/projects/attachment-requests";
import { ProjectSharingApi } from "@/services/api/projects/project-sharing";
import { useOptionalProject } from "@/modules/all-project/context/ProjectContext";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import type { TaskActionFormValues } from "../../types";

interface DocumentClassificationAddProcedureDialogProps {
  open: boolean;
  onClose: () => void;
  procedureType: string;
  /** When set, dialog opens in edit mode with the add form. */
  procedure?: InternalProcedure | null;
  /** Existing project procedures for the optional "Copy steps from" selector. */
  existingProcedures?: InternalProcedure[];
  onSave: (values: TaskActionFormValues) => void | Promise<void>;
}

type ClassificationForm = {
  name: string;
  isActive: boolean;
  mainClassificationId: string;
  subClassificationId: string;
  subSubClassificationId: string;
  jobAttribute: string;
  usedInDocumentCycle: boolean;
  showInAttachmentsLibrary: boolean;
  showInArchiveAfterApproval: boolean;
  requiresAssetId: boolean;
  receiverCompanyIds: string[];
  sourceProcedureSettingId: string;
};

const defaultForm: ClassificationForm = {
  name: "",
  isActive: true,
  mainClassificationId: "",
  subClassificationId: "",
  subSubClassificationId: "",
  jobAttribute: "",
  usedInDocumentCycle: false,
  showInAttachmentsLibrary: false,
  showInArchiveAfterApproval: false,
  requiresAssetId: false,
  receiverCompanyIds: [],
  sourceProcedureSettingId: "",
};

function sameIdSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].map(String).sort();
  const sortedRight = [...right].map(String).sort();
  return sortedLeft.every((value, index) => value === sortedRight[index]);
}

function formFromProcedure(procedure: InternalProcedure): ClassificationForm {
  return {
    name: procedure.name ?? "",
    isActive: procedure.is_active !== false,
    mainClassificationId: procedure.attachment_type_id
      ? String(procedure.attachment_type_id)
      : "",
    subClassificationId: procedure.attachment_sub_type_id
      ? String(procedure.attachment_sub_type_id)
      : "",
    subSubClassificationId: procedure.attachment_sub_sub_type_id
      ? String(procedure.attachment_sub_sub_type_id)
      : "",
    jobAttribute: procedure.job_attribute_id
      ? String(procedure.job_attribute_id)
      : "",
    usedInDocumentCycle: !!procedure.used_in_document_cycle,
    showInAttachmentsLibrary: !!procedure.appears_in_attachments_library,
    showInArchiveAfterApproval: !!procedure.appears_in_archive_after_approval,
    requiresAssetId: !!procedure.requires_asset_id,
    receiverCompanyIds: (procedure.receiver_company_ids ?? []).map(String),
    sourceProcedureSettingId: "",
  };
}

function extractApiFieldErrors(error: unknown): Record<string, string[]> {
  const response = (error as { response?: { data?: { errors?: unknown } } })
    ?.response?.data?.errors;
  if (!response || typeof response !== "object") return {};
  return Object.fromEntries(
    Object.entries(response as Record<string, unknown>).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? value.map(String)
        : value != null
          ? [String(value)]
          : [],
    ]),
  );
}

export default function DocumentClassificationAddProcedureDialog({
  open,
  onClose,
  procedureType,
  procedure = null,
  existingProcedures = [],
  onSave,
}: DocumentClassificationAddProcedureDialogProps) {
  const { tc } = useProceduresSettingsTranslations();
  const t = useTranslations(
    "CRMSettingsModule.proceduresSettings.documentAddProcedureDialog",
  );
  const tTaskAction = useTranslations(
    "CRMSettingsModule.proceduresSettings.taskActionDialog",
  );
  const locale = useLocale();
  const projectId = useOptionalProject()?.projectId;
  const isEditMode = !!procedure;

  const [form, setForm] = useState<ClassificationForm>(defaultForm);
  const [initialReceiverCompanyIds, setInitialReceiverCompanyIds] = useState<
    string[]
  >([]);
  const [nameError, setNameError] = useState("");
  const [receiverCompaniesError, setReceiverCompaniesError] = useState("");
  const [sourceProcedureError, setSourceProcedureError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const procedureId = procedure?.id;

  const { data: fetchedProcedure, isLoading: loadingProcedure } = useQuery({
    queryKey: ["internal-procedure", procedureId, "document-classification", projectId],
    queryFn: () =>
      InternalProcedureSettingsApi.getInternalProcedure(procedureId!, {
        projectId,
      }),
    enabled: open && !!procedureId,
    placeholderData: procedure ?? undefined,
  });

  const { data: sharedCompanies = [], isLoading: loadingSharedCompanies } =
    useQuery({
      queryKey: ["project-shares", projectId, "procedure-dialog"],
      queryFn: async () => {
        const res = await ProjectSharingApi.listForProject(projectId!);
        const shares = res.data.payload ?? [];
        const companies = shares
          .flatMap((share) => [
            share.shared_with_company,
            share.owner_company,
          ])
          .filter(
            (company): company is NonNullable<typeof company> =>
              !!company?.id && !!company.name,
          );
        const seen = new Set<string>();
        return companies.filter((company) => {
          const id = String(company.id);
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
      },
      enabled: open && !!projectId,
    });

  const { data: forms = [] } = useQuery({
    queryKey: ["internal_procedure_setting_forms", procedureType, locale],
    queryFn: async () => {
      try {
        return await InternalProcedureSettingsApi.getInternalProcedureSettingForms(
          procedureType,
          locale,
        );
      } catch {
        return [];
      }
    },
    enabled: open && !!procedureType,
    retry: false,
  });

  const { data: jobAttributes = [], isLoading: loadingJobAttributes } =
    useQuery({
      queryKey: ["procedure-settings-job-attributes"],
      queryFn: () => InternalProcedureSettingsApi.getJobAttributes(),
      enabled: open,
      staleTime: 5 * 60 * 1000,
    });

  const activeJobAttributes = useMemo(
    () => jobAttributes.filter((item) => item.is_active !== false),
    [jobAttributes],
  );

  const { data: rootTypes = [], isLoading: loadingRoots } = useQuery({
    queryKey: ["attachment-folders", "root", projectId],
    queryFn: async () => {
      const res = await AttachmentRequestsApi.getFolderChildren(projectId!);
      return res.data.payload ?? [];
    },
    enabled: open && !!projectId,
  });

  const { data: subTypes = [], isLoading: loadingSubs } = useQuery({
    queryKey: ["attachment-folders", "sub", form.mainClassificationId],
    queryFn: async () => {
      const res = await AttachmentRequestsApi.getFolderChildren(
        form.mainClassificationId,
      );
      return res.data.payload ?? [];
    },
    enabled: open && !!form.mainClassificationId,
  });

  const { data: subSubTypes = [], isLoading: loadingSubSubs } = useQuery({
    queryKey: ["attachment-folders", "sub-sub", form.subClassificationId],
    queryFn: async () => {
      const res = await AttachmentRequestsApi.getFolderChildren(
        form.subClassificationId,
      );
      return res.data.payload ?? [];
    },
    enabled: open && !!form.subClassificationId,
  });

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setInitialReceiverCompanyIds([]);
      setNameError("");
      setReceiverCompaniesError("");
      setSourceProcedureError("");
      return;
    }

    if (!procedure) {
      setForm(defaultForm);
      setInitialReceiverCompanyIds([]);
      setNameError("");
      setReceiverCompaniesError("");
      setSourceProcedureError("");
      return;
    }

    const source =
      fetchedProcedure ?? normalizeInternalProcedure(procedure);
    const nextForm = formFromProcedure(source);
    setForm(nextForm);
    setInitialReceiverCompanyIds(nextForm.receiverCompanyIds);
    setNameError("");
    setReceiverCompaniesError("");
    setSourceProcedureError("");
  }, [open, procedure, fetchedProcedure]);

  const sharedCompanyOptions = useMemo(
    () =>
      sharedCompanies.map((company) => ({
        value: String(company.id),
        label: company.name,
      })),
    [sharedCompanies],
  );

  const sourceProcedureOptions = useMemo(
    () =>
      existingProcedures.map((item) => ({
        value: String(item.id),
        label: item.name || String(item.id),
      })),
    [existingProcedures],
  );

  const checkboxFields = useMemo(
    () =>
      [
        {
          key: "usedInDocumentCycle" as const,
          label: t("usedInDocumentCycle"),
        },
        {
          key: "showInAttachmentsLibrary" as const,
          label: t("showInAttachmentsLibrary"),
        },
        {
          key: "showInArchiveAfterApproval" as const,
          label: t("showInArchiveAfterApproval"),
        },
        {
          key: "requiresAssetId" as const,
          label: t("requiresAssetId"),
        },
      ] as const,
    [t],
  );

  const handleSave = async () => {
    if (!form.name.trim()) {
      setNameError(tc("requiredField"));
      return;
    }

    setIsSaving(true);
    setReceiverCompaniesError("");
    setSourceProcedureError("");
    try {
      await onSave({
        name: form.name.trim(),
        modelId:
          (fetchedProcedure ?? procedure)?.form || forms[0]?.key || "",
        conditions: [],
        appearBeforeIds: [],
        appearAfterIds: [],
        isActive: form.isActive,
        attachmentTypeId: form.mainClassificationId || undefined,
        attachmentSubTypeId: form.subClassificationId || undefined,
        attachmentSubSubTypeId: form.subSubClassificationId || undefined,
        jobAttributeId: form.jobAttribute || undefined,
        usedInDocumentCycle: form.usedInDocumentCycle,
        showInAttachmentsLibrary: form.showInAttachmentsLibrary,
        showInArchiveAfterApproval: form.showInArchiveAfterApproval,
        requiresAssetId: form.requiresAssetId,
        receiverCompanyIds: form.receiverCompanyIds,
        receiverCompanyIdsChanged: isEditMode
          ? !sameIdSet(form.receiverCompanyIds, initialReceiverCompanyIds)
          : undefined,
        sourceProcedureSettingId:
          !isEditMode && form.sourceProcedureSettingId
            ? form.sourceProcedureSettingId
            : undefined,
      });
      onClose();
    } catch (error) {
      const fieldErrors = extractApiFieldErrors(error);
      if (fieldErrors.receiver_company_ids?.length) {
        setReceiverCompaniesError(t("validationReceiverCompanies"));
      }
      if (fieldErrors.source_procedure_setting_id?.length) {
        setSourceProcedureError(t("validationSourceProcedure"));
      }
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontWeight: 700,
          pb: 1,
        }}
      >
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", insetInlineStart: 8, top: 8 }}
        >
          <Close fontSize="small" />
        </IconButton>
        {isEditMode ? tTaskAction("editTitle") : t("title")}
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
      >
        {isEditMode && loadingProcedure ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexDirection: "row-reverse",
              }}
            >
              <Switch
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                color="primary"
                disabled={isSaving}
              />
              <TextField
                label={t("procedureName")}
                value={form.name}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, name: e.target.value }));
                  if (nameError) setNameError("");
                }}
                fullWidth
                size="small"
                required
                disabled={isSaving}
                error={!!nameError}
                helperText={nameError}
              />
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <List fontSize="small" color="action" />
                <Typography variant="subtitle2" fontWeight={700}>
                  {t("classificationSection")}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <TextField
                  select
                  size="small"
                  label={t("mainClassification")}
                  value={form.mainClassificationId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      mainClassificationId: e.target.value,
                      subClassificationId: "",
                      subSubClassificationId: "",
                    }))
                  }
                  disabled={isSaving || loadingRoots || !projectId}
                  InputProps={{
                    startAdornment: loadingRoots ? (
                      <CircularProgress size={14} sx={{ mr: 1 }} />
                    ) : undefined,
                  }}
                >
                  <MenuItem value="">{t("select")}</MenuItem>
                  {rootTypes.map((type) => (
                    <MenuItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  label={t("subClassification")}
                  value={form.subClassificationId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      subClassificationId: e.target.value,
                      subSubClassificationId: "",
                    }))
                  }
                  disabled={
                    isSaving || !form.mainClassificationId || loadingSubs
                  }
                  InputProps={{
                    startAdornment: loadingSubs ? (
                      <CircularProgress size={14} sx={{ mr: 1 }} />
                    ) : undefined,
                  }}
                >
                  <MenuItem value="">{t("select")}</MenuItem>
                  {subTypes.map((type) => (
                    <MenuItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  label={t("subSubClassification")}
                  value={form.subSubClassificationId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      subSubClassificationId: e.target.value,
                    }))
                  }
                  disabled={
                    isSaving || !form.subClassificationId || loadingSubSubs
                  }
                  InputProps={{
                    startAdornment: loadingSubSubs ? (
                      <CircularProgress size={14} sx={{ mr: 1 }} />
                    ) : undefined,
                  }}
                >
                  <MenuItem value="">{t("select")}</MenuItem>
                  {subSubTypes.map((type) => (
                    <MenuItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <TextField
                  select
                  size="small"
                  label={t("jobAttribute")}
                  value={form.jobAttribute}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      jobAttribute: e.target.value,
                    }))
                  }
                  disabled={isSaving || loadingJobAttributes}
                  InputProps={{
                    startAdornment: loadingJobAttributes ? (
                      <CircularProgress size={14} sx={{ mr: 1 }} />
                    ) : undefined,
                  }}
                >
                  <MenuItem value="">{t("select")}</MenuItem>
                  {activeJobAttributes.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 0.5,
                }}
              >
                {checkboxFields.map((field) => (
                  <FormControlLabel
                    key={field.key}
                    control={
                      <Checkbox
                        checked={form[field.key]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [field.key]: e.target.checked,
                          }))
                        }
                        disabled={isSaving}
                        color="primary"
                      />
                    }
                    label={field.label}
                  />
                ))}
              </Box>
            </Box>

            {projectId ? (
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                  {t("concernedCompanies")}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  {t("concernedCompaniesHint")}
                </Typography>
                <SearchableSelect
                  multiple
                  options={sharedCompanyOptions}
                  value={form.receiverCompanyIds}
                  onChange={(value) => {
                    setForm((prev) => ({
                      ...prev,
                      receiverCompanyIds: value.map(String),
                    }));
                    if (receiverCompaniesError) setReceiverCompaniesError("");
                  }}
                  placeholder={
                    loadingSharedCompanies ? tc("loading") : t("select")
                  }
                  searchPlaceholder={t("searchCompanies")}
                  noResultsText={t("noCompanies")}
                  disabled={isSaving || loadingSharedCompanies}
                  error={receiverCompaniesError}
                />
              </Box>
            ) : null}

            {!isEditMode && existingProcedures.length > 0 ? (
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                  {t("copyStepsFrom")}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  {t("copyStepsFromHint")}
                </Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={form.sourceProcedureSettingId}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      sourceProcedureSettingId: e.target.value,
                    }));
                    if (sourceProcedureError) setSourceProcedureError("");
                  }}
                  disabled={isSaving}
                  error={!!sourceProcedureError}
                  helperText={sourceProcedureError}
                >
                  <MenuItem value="">{t("select")}</MenuItem>
                  {sourceProcedureOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            ) : null}

            <Alert severity="warning" variant="outlined">
              {t("notice")}
            </Alert>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexDirection: "row-reverse",
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
                sx={{ minWidth: 120 }}
              >
                {t("save")}
              </Button>
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={isSaving}
                sx={{ minWidth: 120 }}
              >
                {t("cancel")}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
