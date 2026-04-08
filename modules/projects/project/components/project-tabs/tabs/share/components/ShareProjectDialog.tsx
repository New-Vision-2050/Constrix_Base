"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
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
import ConfirmShareDialog from "./ConfirmShareDialog";
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

/** Backend `message` may be a string or `{ description: string }`. */
const API_DESCRIPTION_ALREADY_SHARED =
  "Resource is already shared with this company";

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

/** API often returns HTTP 200 with `{ status: "error", message: {...} }`. */
function isApiPayloadBusinessError(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const status = (data as ApiErrorBody).status;
  return typeof status === "string" && status.toLowerCase() === "error";
}

function isAlreadySharedApiDescription(description: string | undefined) {
  if (!description) return false;
  const normalized = description.trim().replace(/\s+/g, " ");
  if (normalized === API_DESCRIPTION_ALREADY_SHARED) return true;
  const lower = normalized.toLowerCase();
  return lower.includes("already shared") && lower.includes("company");
}

/** Wait for main dialog exit transition before opening confirm (MUI default leave ~225ms). */
const CONFIRM_OPEN_AFTER_MS = 225;

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

  const [confirmOpen, setConfirmOpen] = useState(false);
  /** Main share form dialog; set false before opening confirm so the first dialog closes first. */
  const [formDialogOpen, setFormDialogOpen] = useState(true);
  const confirmOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pendingPayload, setPendingPayload] =
    useState<PendingSharePayload | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
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
      if (confirmOpenTimerRef.current) {
        clearTimeout(confirmOpenTimerRef.current);
        confirmOpenTimerRef.current = null;
      }
      setFormDialogOpen(true);
      setCompany(null);
      setSelectedSchemaIds([]);
      setPendingPayload(null);
      setConfirmOpen(false);
      reset(defaultForm);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `reset` from RHF can change identity every render
  }, [open]);

  useEffect(
    () => () => {
      if (confirmOpenTimerRef.current) {
        clearTimeout(confirmOpenTimerRef.current);
      }
    },
    [],
  );

  const lookupMutation = useMutation({
    mutationFn: (serial: string) =>
      ProjectSharingApi.getCompanyBySerial(serial),
    onSuccess: (res) => {
      const payload = res.data?.payload;
      if (payload) {
        setCompany(payload);
      }
    },
    onError: (error: unknown) => {
      setCompany(null);
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
      setConfirmOpen(false);
      setFormDialogOpen(true);
      setPendingPayload(null);
      reset(defaultForm);
      setCompany(null);
      setSelectedSchemaIds([]);
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
    if (confirmOpenTimerRef.current) {
      clearTimeout(confirmOpenTimerRef.current);
      confirmOpenTimerRef.current = null;
    }
    setConfirmOpen(false);
    setFormDialogOpen(true);
    setPendingPayload(null);
    reset(defaultForm);
    setCompany(null);
    setSelectedSchemaIds([]);
    onClose();
  };

  const onLookup = () => {
    const serial = getValues("serialSearch").trim();
    if (!serial) return;
    lookupMutation.mutate(serial);
  };

  const toggleSchemaId = (schemaId: number) => {
    setSelectedSchemaIds((prev) =>
      prev.includes(schemaId)
        ? prev.filter((x) => x !== schemaId)
        : [...prev, schemaId].sort((a, b) => a - b),
    );
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
    if (confirmOpenTimerRef.current) {
      clearTimeout(confirmOpenTimerRef.current);
      confirmOpenTimerRef.current = null;
    }
    setPendingPayload({
      company_serial_number: company.serial_no,
      schema_ids: selectedSchemaIds,
      notes: data.notes.trim() || undefined,
    });
    setFormDialogOpen(false);
    confirmOpenTimerRef.current = setTimeout(() => {
      confirmOpenTimerRef.current = null;
      setConfirmOpen(true);
    }, CONFIRM_OPEN_AFTER_MS);
  };

  const handleConfirmShare = () => {
    if (!pendingPayload) return;
    shareMutation.mutate(pendingPayload);
  };

  const handleCancelConfirm = () => {
    if (shareMutation.isPending) return;
    setConfirmOpen(false);
    setPendingPayload(null);
    setFormDialogOpen(true);
  };

  const pending =
    isSubmitting ||
    shareMutation.isPending ||
    lookupMutation.isPending ||
    projectLoading;

  const canShowSchemas =
    Boolean(schemaParentId && schemaParentId > 0) && !schemasLoading;

  return (
    <>
      <Dialog
        open={open && formDialogOpen}
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

        <DialogContent sx={{ p: 3, pt: 1 }}>
          {projectLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit(onValidSubmit)}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {!schemaParentId || schemaParentId <= 0 ? (
                <Typography color="warning.main" variant="body2">
                  {t("projectTypeMissing")}
                </Typography>
              ) : null}

              <Stack direction="row" spacing={1} alignItems="flex-start">
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
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={onLookup}
                  disabled={pending}
                  sx={{ flexShrink: 0, minWidth: 88 }}
                >
                  {lookupMutation.isPending ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    t("dialogSearch")
                  )}
                </Button>
              </Stack>

              {company ? (
                <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
                  {t("dialogSelectedCompany", { name: company.name })}
                </Typography>
              ) : null}

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
                            disabled={pending || !company}
                          />
                        }
                        label={tab.name}
                      />
                    );
                  })}
                </Box>
              ) : null}

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    multiline
                    minRows={2}
                    label={t("notes")}
                    placeholder={t("notesPlaceholder")}
                    disabled={pending}
                  />
                )}
              />

              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={
                    pending ||
                    !canShowSchemas ||
                    filteredTabs.length === 0 ||
                    !company
                  }
                >
                  {t("dialogShareSubmit")}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmShareDialog
        open={confirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmShare}
        isSubmitting={shareMutation.isPending}
      />
    </>
  );
}

export interface ShareProjectDialogProps {
  open: boolean;
  onClose: () => void;
}
