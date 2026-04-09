"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
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
  Checkbox,
  Stack,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { Close, InfoOutlined, Send as SendIcon } from "@mui/icons-material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
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
};

type PendingSharePayload = {
  company_serial_number: string;
  schema_ids: number[];
};

const createShareFormSchema = () =>
  z.object({
    serialSearch: z
      .string()
      .min(1, "الرقم التسلسلي للشركة مطلوب"),
  });

const defaultForm: ShareFormValues = {
  serialSearch: "",
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

/** Backend: `Cannot share project with your own company` (400, status/message error). */
function isOwnCompanyShareError(description: string | undefined) {
  if (!description) return false;
  const lower = description.trim().toLowerCase();
  return (
    lower.includes("own company") ||
    lower.includes("cannot share project with your own")
  );
}

/** Same schema ids as `useProjectSettingsTabs()`; stable for memo keys (hook returns a new array each render). */
const PROJECT_SETTINGS_TAB_SCHEMA_IDS = new Set<number>(
  Object.values(SCHEMA_IDS),
);

export default function ShareProjectDialog({
  open,
  onClose,
}: ShareProjectDialogProps) {
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

  const schema = useMemo(() => createShareFormSchema(), []);

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
        setLookupError("الشركة غير موجودة");
      }
    },
    onError: (error: unknown) => {
      setCompany(null);
      if (isCompanyNotFoundError(error)) {
        setLookupError("الشركة غير موجودة");
        return;
      }
      setLookupError(null);
      toast.error(getApiErrorDescription(error) ?? "حدث خطأ أثناء المشاركة");
    },
  });

  const shareMutation = useMutation({
    mutationFn: async (body: PendingSharePayload) => {
      const res = await ProjectSharingApi.share({
        project_id: projectId,
        company_serial_number: body.company_serial_number,
        schema_ids: [...body.schema_ids].sort((a, b) => a - b),
      });
      if (isApiPayloadBusinessError(res.data)) {
        return Promise.reject({ response: { data: res.data } });
      }
      return res;
    },
    onSuccess: (res) => {
      const text = getErrorDescriptionFromApiData(res.data);
      toast.success(text?.trim() ? text : "تمت المشاركة بنجاح");
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
      if (isOwnCompanyShareError(description)) {
        toast.error("لا يمكن مشاركة المشروع مع شركتك");
        return;
      }
      if (isAlreadySharedApiDescription(description)) {
        toast.error("تمت المشاركة مع هذه الشركة مسبقاً");
        return;
      }
      toast.error(description ?? "حدث خطأ أثناء المشاركة");
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
        toast.error("يرجى اختيار قسم واحد على الأقل");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onValidSubmit: SubmitHandler<ShareFormValues> = () => {
    /** Share API runs only from step 4 (review) submit — not from earlier steps. */
    if (activeStep !== 3) {
      return;
    }
    if (!company) {
      toast.error("يرجى البحث عن الشركة أولاً");
      return;
    }
    if (selectedSchemaIds.length === 0) {
      toast.error("يرجى اختيار قسم واحد على الأقل");
      return;
    }
    shareMutation.mutate({
      company_serial_number: company.serial_no,
      schema_ids: selectedSchemaIds,
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
    "تأكيد الشركة",
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
                نوع المشروع مفقود
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
                  label="الرقم التسلسلي للشركة"
                  placeholder="أدخل الرقم التسلسلي للبحث"
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
                  الشركة المختارة: {company.name}
                </Typography>
              </Paper>
            ) : null}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {company ? (
              <>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  sx={{ gap: 2, flexWrap: "wrap" }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    تفاصيل الشركة التي تم العثور عليها
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: "secondary.main" }}
                  >
                    تأكيد البيانات
                  </Typography>
                </Stack>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 0,
                    overflow: "hidden",
                    bgcolor: "action.hover",
                    borderColor: "divider",
                  }}
                >
                  {(
                    [
                      {
                        icon: (
                          <BusinessOutlinedIcon
                            sx={{ fontSize: 22, color: "text.secondary" }}
                          />
                        ),
                        label: "اسم الشركة",
                        value: company.name?.trim() || "—",
                      },
                      {
                        icon: (
                          <BadgeOutlinedIcon
                            sx={{ fontSize: 22, color: "text.secondary" }}
                          />
                        ),
                        label: "الرقم التسلسلي",
                        value: company.serial_no?.trim() || "—",
                      },
                      {
                        icon: (
                          <EmailOutlinedIcon
                            sx={{ fontSize: 22, color: "text.secondary" }}
                          />
                        ),
                        label: "البريد الإلكتروني",
                        value: company.email?.trim() || "—",
                      },
                      {
                        icon: (
                          <PersonOutlineIcon
                            sx={{ fontSize: 22, color: "text.secondary" }}
                          />
                        ),
                        label: "مالك الشركة",
                        value: company.owner_name?.trim() || "—",
                      },
                    ] as const
                  ).map((row, index, arr) => (
                    <Stack
                      key={row.label}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom:
                          index < arr.length - 1 ? 1 : 0,
                        borderColor: "divider",
                      }}
                    >
                      {/* RTL: first item aligns to inline-start (right) — label + icon */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ flexShrink: 0 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {row.label}
                        </Typography>
                        {row.icon}
                      </Stack>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ textAlign: "end", minWidth: 0, flex: 1 }}
                      >
                        {row.value}
                      </Typography>
                    </Stack>
                  ))}
                </Paper>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                لا توجد بيانات شركة. ارجع للخطوة السابقة وأكمل البحث.
              </Typography>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {schemasLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={24} />
                <Typography variant="body2">جاري تحميل الأقسام...</Typography>
              </Box>
            ) : null}

            {canShowSchemas && filteredTabs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                لا توجد أقسام متاحة
              </Typography>
            ) : null}

            {canShowSchemas && filteredTabs.length > 0 ? (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2.5, fontWeight: 700 }}
                >
                  حدد الصلاحيات الممنوحة
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  {filteredTabs.map((tab) => {
                    const id = tab.schema_id!;
                    const checked = selectedSchemaIds.includes(id);
                    return (
                      <Paper
                        key={tab.value}
                        variant="outlined"
                        sx={{
                          p: 1.75,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                          borderColor: "divider",
                          transition: (theme) =>
                            theme.transitions.create(
                              ["border-color", "box-shadow", "background-color"],
                              { duration: theme.transitions.duration.shorter },
                            ),
                          ...(checked && {
                            borderColor: "primary.main",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(144, 202, 249, 0.08)"
                                : "rgba(25, 118, 210, 0.06)",
                            boxShadow: (theme) =>
                              `inset 0 0 0 1px ${theme.palette.primary.main}`,
                          }),
                        }}
                      >
                        <Box
                          dir="rtl"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1.5,
                            width: "100%",
                          }}
                        >
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleSchemaId(id)}
                            disabled={pending}
                            size="medium"
                            sx={{ p: 0.5, flexShrink: 0 }}
                            inputProps={{
                              "aria-label": tab.name,
                            }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              textAlign: "right",
                              lineHeight: 1.4,
                            }}
                          >
                            {tab.name}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              </Box>
            ) : null}
          </Box>
        );

      case 3: {
        const schemaChipIcons = [
          GroupsOutlinedIcon,
          SearchOutlinedIcon,
          FolderOutlinedIcon,
          AssignmentOutlinedIcon,
        ];
        const selectedTabs = filteredTabs.filter((tab) =>
          selectedSchemaIds.includes(tab.schema_id!),
        );
        const companyRows = company
          ? (
              [
                {
                  icon: (
                    <BusinessOutlinedIcon
                      sx={{ fontSize: 22, color: "text.secondary" }}
                    />
                  ),
                  label: "اسم الشركة",
                  value: company.name?.trim() || "—",
                },
                {
                  icon: (
                    <BadgeOutlinedIcon
                      sx={{ fontSize: 22, color: "text.secondary" }}
                    />
                  ),
                  label: "الرقم التسلسلي",
                  value: company.serial_no?.trim() || "—",
                },
                {
                  icon: (
                    <EmailOutlinedIcon
                      sx={{ fontSize: 22, color: "text.secondary" }}
                    />
                  ),
                  label: "البريد الإلكتروني",
                  value: company.email?.trim() || "—",
                },
                {
                  icon: (
                    <PersonOutlineIcon
                      sx={{ fontSize: 22, color: "text.secondary" }}
                    />
                  ),
                  label: "ممثل الشركة",
                  value: company.owner_name?.trim() || "—",
                },
              ] as const
            )
          : [];

        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                bgcolor: "action.hover",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
                معلومات الشركة
              </Typography>
              {companyRows.length > 0 ? (
                <Stack
                  spacing={0}
                  divider={
                    <Divider flexItem sx={{ borderColor: "divider" }} />
                  }
                >
                  {companyRows.map((row) => (
                    <Stack
                      key={row.label}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ py: 1.75 }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ flexShrink: 0 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {row.label}
                        </Typography>
                        {row.icon}
                      </Stack>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ textAlign: "end", minWidth: 0, flex: 1 }}
                      >
                        {row.value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  —
                </Typography>
              )}

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
                الصلاحيات المختارة
              </Typography>
              {selectedTabs.length > 0 ? (
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {selectedTabs.map((tab, index) => {
                    const IconComp = schemaChipIcons[index % schemaChipIcons.length];
                    return (
                      <Chip
                        key={tab.value}
                        icon={
                          <IconComp sx={{ fontSize: "1.125rem !important" }} />
                        }
                        label={tab.name}
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          py: 2,
                          borderColor: "primary.main",
                          bgcolor: "background.paper",
                        }}
                      />
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  —
                </Typography>
              )}
            </Paper>

            <Alert severity="info" icon={<InfoOutlined fontSize="inherit" />} variant="outlined">
              يرجى مراجعة البيانات والصلاحيات قبل إرسال الدعوة
            </Alert>
          </Box>
        );
      }

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
          aria-label="مشاركة المشروع"
          disabled={pending}
        >
          <Close />
        </IconButton>
        <DialogTitle sx={{ flex: 1, textAlign: "center", pr: 6, m: 0 }}>
          مشاركة المشروع
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
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (activeStep !== 3) return;
              void handleSubmit(onValidSubmit)(e);
            }}
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

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              {activeStep === 0 ? (
                <>
                  <Button
                    type="button"
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
              ) : activeStep === 3 ? (
                <>
                  <Button
                    type="button"
                    disabled={pending}
                    onClick={handleBack}
                    variant="outlined"
                    color="inherit"
                  >
                    تراجع
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                    disabled={pending}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={
                      pending ||
                      !canShowSchemas ||
                      filteredTabs.length === 0 ||
                      !company ||
                      selectedSchemaIds.length === 0
                    }
                    startIcon={
                      shareMutation.isPending ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SendIcon sx={{ fontSize: 20 }} />
                      )
                    }
                  >
                    {shareMutation.isPending ? "جاري الإرسال…" : "أرسال الدعوة"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    disabled={pending}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    رجوع
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleNext}
                    disabled={pending}
                  >
                    التالي
                  </Button>
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
