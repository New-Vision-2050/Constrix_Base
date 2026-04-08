"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { ProjectSharingApi} from "@/services/api/projects/project-sharing";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import {
  SCHEMA_IDS,
  useProjectSettingsTabs,
} from "@/modules/projects/settings/constants/current-tabs";
import { CompanyData } from "@/services/api/projects/project-sharing/types/response";

type ShareFormValues = {
  serialSearch: string;
  notes: string;
};

type PendingSharePayload = {
  company_serial_number: string;
  schema_ids: number[];
  notes?: string;
};

const createShareFormSchema = (t: (key: string) => string) =>
  z.object({
    serialSearch: z
      .string()
      .min(1, t("validation.companySerialRequired")),
    notes: z.string(),
  });

const defaultForm: ShareFormValues = {
  serialSearch: "",
  notes: "",
};

type ApiErrorBody = {
  status?: unknown;
  message?: unknown;
  description?: unknown;
};

/** Parses `message` / `description` from API JSON (success or error body). */
function getErrorDescriptionFromApiData(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const body = data as ApiErrorBody;
  if (typeof body.description === "string" && body.description.trim())
    return body.description.trim();

  const msg = body.message;
  if (typeof msg === "string") return msg;
  if (
    msg &&
    typeof msg === "object" &&
    "description" in msg &&
    typeof (msg as { description: unknown }).description === "string"
  ) {
    return (msg as { description: string }).description.trim();
  }
  return undefined;
}

function getApiErrorDescription(error: unknown): string | undefined {
  const data = axios.isAxiosError(error)
    ? error.response?.data
    : (error as { response?: { data?: unknown } })?.response?.data;
  return getErrorDescriptionFromApiData(data);
}

/** Serial lookup: HTTP 404 or `{ code: 404, description: "Company not found" }`. */
function isCompanyNotFoundError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  if (status === 404) return true;
  const data = error.response?.data;
  if (!data || typeof data !== "object") return false;
  const body = data as { code?: unknown; description?: unknown };
  if (body.code === 404) return true;
  if (typeof body.description === "string") {
    const lower = body.description.toLowerCase();
    return (
      lower.includes("company") &&
      (lower.includes("not found") || lower.includes("لم يتم"))
    );
  }
  return false;
}

/** API often returns HTTP 200 with `{ status: "error", message: {...} }`. */
function isApiPayloadBusinessError(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const status = (data as ApiErrorBody).status;
  return typeof status === "string" && status.toLowerCase() === "error";
}

function isAlreadySharedApiDescription(description: string | undefined) {
  if (!description) return false;
  const normalized = description.trim().replace(/\s+/g, " ");
  const lower = normalized.toLowerCase();
  return lower.includes("already shared") && lower.includes("company");
}

/** Same schema ids as `useProjectSettingsTabs()`; stable for memo keys (hook returns a new array each render). */
const PROJECT_SETTINGS_TAB_SCHEMA_IDS = new Set<number>(
  Object.values(SCHEMA_IDS),
);

export default function ShareProjectDialog({
  open,
  onClose,
}: ShareProjectDialogProps) {
  const t = useTranslations("project.share");
  const { projectId, projectData, isLoading: projectLoading } = useProject();
  const queryClient = useQueryClient();
  const allSettingsTabs = useProjectSettingsTabs();

  const [activeStep, setActiveStep] = useState(0);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [selectedSchemaIds, setSelectedSchemaIds] = useState<number[]>([]);

  const schemaParentId = projectData?.sub_project_type_id;

  const { data: schemasPayload, isLoading: schemasLoading } = useQuery({
    queryKey: ["project-type-schemas", "share-dialog", schemaParentId],
    queryFn: async () => {
      const res = await ProjectTypesApi.getProjectTypeSchemas(schemaParentId!);
      return res.data.payload ?? [];
    },
    enabled:
      open &&
      Boolean(schemaParentId && schemaParentId > 0),
  });

  const schemas = useMemo(() => schemasPayload ?? [], [schemasPayload]);

  const filteredTabs = useMemo(
    () =>
      allSettingsTabs.filter(
        (tab) =>
          tab.schema_id != null &&
          schemas.some((s) => s.id === tab.schema_id),
      ),
    [allSettingsTabs, schemas],
  );

  /** Stable primitive: derived only from `schemas` (matches filter via tabs, without depending on new tab array refs). */
  const allowedSchemaIdsKey = useMemo(
    () =>
      schemas
        .map((s) => s.id)
        .filter((id) => PROJECT_SETTINGS_TAB_SCHEMA_IDS.has(id))
        .sort((a, b) => a - b)
        .join(","),
    [schemas],
  );

  useEffect(() => {
    const allowed = new Set(
      allowedSchemaIdsKey
        .split(",")
        .filter(Boolean)
        .map((s) => Number(s)),
    );
    setSelectedSchemaIds((prev) => {
      const next = prev.filter((id) => allowed.has(id));
      if (
        next.length === prev.length &&
        next.every((id, i) => id === prev[i])
      ) {
        return prev;
      }
      return next;
    });
  }, [allowedSchemaIdsKey]);

  const schema = useMemo(() => createShareFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ShareFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultForm,
  });

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setCompany(null);
      setLookupError(null);
      setSelectedSchemaIds([]);
      reset(defaultForm);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `reset` from RHF can change identity every render
  }, [open]);

  const lookupMutation = useMutation({
    mutationFn: (serial: string) =>
      ProjectSharingApi.getCompanyBySerial(serial),
    onSuccess: (res) => {
      const payload = res.data?.payload;
      if (payload) {
        setLookupError(null);
        setCompany(payload);
        setActiveStep(1);
      } else {
        setCompany(null);
        setLookupError(t("companyNotFound"));
      }
    },
    onError: (error: unknown) => {
      setCompany(null);
      if (isCompanyNotFoundError(error)) {
        setLookupError(t("companyNotFound"));
        return;
      }
      setLookupError(null);
      toast.error(getApiErrorDescription(error) ?? t("shareError"));
    },
  });

  const shareMutation = useMutation({
    mutationFn: async (body: PendingSharePayload) => {
      const res = await ProjectSharingApi.share({
        project_id: projectId,
        company_serial_number: body.company_serial_number,
        schema_ids: [...body.schema_ids].sort((a, b) => a - b),
        notes: body.notes,
      });
      if (isApiPayloadBusinessError(res.data)) {
        return Promise.reject({ response: { data: res.data } });
      }
      return res;
    },
    onSuccess: (res) => {
      const text = getErrorDescriptionFromApiData(res.data);
      toast.success(text?.trim() ? text : t("shareSuccess"));
      queryClient.invalidateQueries({ queryKey: ["project-details", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-shares", projectId] });
      reset(defaultForm);
      setCompany(null);
      setSelectedSchemaIds([]);
      setActiveStep(0);
      onClose();
    },
    onError: (error: unknown) => {
      const description = getApiErrorDescription(error);
      if (isAlreadySharedApiDescription(description)) {
        toast.error(t("alreadySharedWithCompany"));
        return;
      }
      toast.error(description ?? t("shareError"));
    },
  });

  const handleClose = () => {
    if (shareMutation.isPending || lookupMutation.isPending) return;
    reset(defaultForm);
    setCompany(null);
    setLookupError(null);
    setSelectedSchemaIds([]);
    setActiveStep(0);
    onClose();
  };

  const onLookup = () => {
    const serial = getValues("serialSearch").trim();
    if (!serial) return;
    setLookupError(null);
    lookupMutation.mutate(serial);
  };

  const toggleSchemaId = (schemaId: number) => {
    setSelectedSchemaIds((prev) =>
      prev.includes(schemaId)
        ? prev.filter((x) => x !== schemaId)
        : [...prev, schemaId].sort((a, b) => a - b),
    );
  };

  const handleNext = () => {
    if (activeStep === 2) {
      if (selectedSchemaIds.length === 0) {
        toast.error(t("validation.selectSection"));
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onValidSubmit = (data: ShareFormValues) => {
    if (!company) {
      toast.error(t("validation.companyLookupRequired"));
      return;
    }
    if (selectedSchemaIds.length === 0) {
      toast.error(t("validation.selectSection"));
      return;
    }
    shareMutation.mutate({
      company_serial_number: company.serial_no,
      schema_ids: selectedSchemaIds,
      notes: data.notes.trim() || undefined,
    });
  };

  const pending =
    isSubmitting ||
    shareMutation.isPending ||
    lookupMutation.isPending ||
    projectLoading;

  const canShowSchemas =
    Boolean(schemaParentId && schemaParentId > 0) && !schemasLoading;

  const steps = [
    "البحث عن شركة",
    "معلومات الشركة",
    "تحديد الصلاحيات",
    "المراجعة والإرسال",
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%" }}>
            {!schemaParentId || schemaParentId <= 0 ? (
              <Typography color="warning.main" variant="body2">
                {t("projectTypeMissing")}
              </Typography>
            ) : null}

            <Controller
              name="serialSearch"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  label={t("companySerialNumber")}
                  placeholder={t("dialogSerialSearchPlaceholder")}
                  error={!!errors.serialSearch}
                  helperText={errors.serialSearch?.message}
                  disabled={pending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onLookup();
                    }
                  }}
                />
              )}
            />

            <Alert severity="info" variant="outlined" sx={{ py: 1 }}>
              لن تظهر بيانات الشركة إلا بعد البحث
            </Alert>

            {lookupError ? (
              <Alert severity="warning" variant="outlined" sx={{ py: 0.75 }}>
                {lookupError}
              </Alert>
            ) : null}

            {company ? (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "success.light", borderColor: "success.main" }}>
                <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
                  {t("dialogSelectedCompany", { name: company.name })}
                </Typography>
              </Paper>
            ) : null}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {company ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  bgcolor: "action.hover",
                  borderColor: "primary.main",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
                >
                  معلومات الشركة
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                      اسم الشركة:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {company.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                      {t("companySerialNumber") || "Serial Number"}:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {company.serial_no}
                    </Typography>
                  </Stack>
                  {company.email && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                        البريد الإلكتروني:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {company.email}
                      </Typography>
                    </Stack>
                  )}
                  {company.owner_name && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                        ممثل الشركة:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {company.owner_name}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            ) : null}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {schemasLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={24} />
                <Typography variant="body2">{t("loadingSchemas")}</Typography>
              </Box>
            ) : null}

            {canShowSchemas && filteredTabs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {t("noSchemasAvailable")}
              </Typography>
            ) : null}

            {canShowSchemas && filteredTabs.length > 0 ? (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  حدد الصلاحيات للمشاركة
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "flex-start",
                  }}
                >
                  {filteredTabs.map((tab) => {
                    const id = tab.schema_id!;
                    const checked = selectedSchemaIds.includes(id);
                    return (
                      <FormControlLabel
                        key={tab.value}
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleSchemaId(id)}
                            disabled={pending}
                          />
                        }
                        label={tab.name}
                      />
                    );
                  })}
                </Box>
              </Box>
            ) : null}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: "action.hover" }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                معلومات الشركة
              </Typography>
              <Typography variant="body1">{company?.name || "—"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {company?.serial_no || "—"}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: "action.hover" }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                الصلاحيات المختارة
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 1.5,
                }}
              >
                {filteredTabs
                  .filter((tab) => selectedSchemaIds.includes(tab.schema_id!))
                  .map((tab) => (
                    <Stack
                      key={tab.value}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "primary.main",
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        {tab.name}
                      </Typography>
                    </Stack>
                  ))}
              </Box>
            </Paper>

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  multiline
                  minRows={3}
                  label={t("notes")}
                  placeholder={t("notesPlaceholder")}
                  disabled={pending}
                />
              )}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (shareMutation.isPending || lookupMutation.isPending) return;
        handleClose();
      }}
      maxWidth="md"
      fullWidth
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          pt: 1,
        }}
      >
        <IconButton
          onClick={handleClose}
          aria-label={t("dialogTitle")}
          disabled={pending}
        >
          <Close />
        </IconButton>
        <DialogTitle sx={{ flex: 1, textAlign: "center", pr: 6, m: 0 }}>
          {t("dialogTitle")}
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        {projectLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit(onValidSubmit)}
            noValidate
          >
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: 200 }}>{renderStepContent()}</Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {activeStep === 0 ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={pending}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={onLookup}
                    disabled={pending}
                    sx={{ minWidth: 120 }}
                  >
                    {lookupMutation.isPending ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "بحث"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    disabled={pending}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    رجوع
                  </Button>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={
                          pending ||
                          !canShowSchemas ||
                          filteredTabs.length === 0 ||
                          !company ||
                          selectedSchemaIds.length === 0
                        }
                      >
                        {shareMutation.isPending ? (
                          <CircularProgress size={22} color="inherit" />
                        ) : (
                          t("dialogShareSubmit")
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={pending}
                      >
                        التالي
                      </Button>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export interface ShareProjectDialogProps {
  open: boolean;
  onClose: () => void;
}
