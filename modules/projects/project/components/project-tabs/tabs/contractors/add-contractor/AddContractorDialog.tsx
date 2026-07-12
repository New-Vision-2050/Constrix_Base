"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
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
import {
  Close,
  ContentCopy,
  CloudUpload,
  Add as AddIcon,
  DeleteOutline,
  BusinessOutlined,
  PersonOutline,
  GroupsOutlined,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getCountries } from "@/services/api/shared/countries";
import type { API_Country } from "@/types/api/shared/country";

const STEP_KEYS = [
  "contractorInfo",
  "projectManager",
  "representatives",
  "review",
] as const;

const ACTIVITY_OPTIONS = [
  "مقاول اعمال مدنية",
  "مقاول اعمال كهربائية",
  "مقاول اعمال ميكانيكية",
  "مقاول تشطيبات",
  "مقاول لاندسكيب",
] as const;

export interface ContractorRepresentative {
  id: string;
  name: string;
  mobile: string;
  nationality: API_Country | null;
}

export interface AddContractorFormData {
  logoFile: File | null;
  constrixId: string;
  name: string;
  taxCard: string;
  commercialRegister: string;
  activity: string;
  email: string;
  country: API_Country | null;
  managerName: string;
  managerMobile: string;
  managerEmail: string;
  managerNationality: API_Country | null;
  representatives: ContractorRepresentative[];
  confirmedReview: boolean;
}

function createRepresentative(): ContractorRepresentative {
  return {
    id: crypto.randomUUID(),
    name: "",
    mobile: "",
    nationality: null,
  };
}

const INITIAL_FORM: AddContractorFormData = {
  logoFile: null,
  constrixId: "",
  name: "",
  taxCard: "",
  commercialRegister: "",
  activity: "",
  email: "",
  country: null,
  managerName: "",
  managerMobile: "",
  managerEmail: "",
  managerNationality: null,
  representatives: [createRepresentative()],
  confirmedReview: false,
};

function generateConstrixId(): string {
  const suffix = Math.floor(Math.random() * 10_000)
    .toString()
    .padStart(4, "0");
  const middle = Date.now().toString().slice(-9);
  return `CON-${middle}-${suffix}`;
}

function isValidEmail(value: string): boolean {
  if (!value.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function displayValue(value: string | null | undefined, emptyDash: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : emptyDash;
}

export interface AddContractorDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddContractorDialog({
  open,
  onClose,
}: AddContractorDialogProps) {
  const t = useTranslations("project.contractorsTab.dialog");
  const tFields = useTranslations("project.contractorsTab.dialog.fields");
  const tReview = useTranslations("project.contractorsTab.dialog.review");
  const tValidation = useTranslations("project.contractorsTab.dialog.validation");
  const uploadInputId = useId();

  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<AddContractorFormData>(INITIAL_FORM);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: countries = [], isLoading: loadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await getCountries();
      return response.data.payload ?? [];
    },
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setForm(INITIAL_FORM);
      setLogoPreview(null);
      setSubmitting(false);
      return;
    }
    setForm((prev) => ({
      ...prev,
      constrixId: generateConstrixId(),
    }));
  }, [open]);

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const stepLabels = useMemo(
    () => STEP_KEYS.map((key) => t(`steps.${key}`)),
    [t],
  );

  const emptyDash = t("emptyDash");

  const updateField = <K extends keyof AddContractorFormData>(
    key: K,
    value: AddContractorFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateRepresentative = (
    id: string,
    patch: Partial<Omit<ContractorRepresentative, "id">>,
  ) => {
    setForm((prev) => ({
      ...prev,
      representatives: prev.representatives.map((rep) =>
        rep.id === id ? { ...rep, ...patch } : rep,
      ),
    }));
  };

  const addRepresentative = () => {
    setForm((prev) => ({
      ...prev,
      representatives: [...prev.representatives, createRepresentative()],
    }));
  };

  const removeRepresentative = (id: string) => {
    setForm((prev) => {
      if (prev.representatives.length <= 1) return prev;
      return {
        ...prev,
        representatives: prev.representatives.filter((rep) => rep.id !== id),
      };
    });
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    updateField("logoFile", file);
    setLogoPreview(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleCopyConstrixId = async () => {
    if (!form.constrixId) return;
    try {
      await navigator.clipboard.writeText(form.constrixId);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      if (!form.name.trim()) {
        toast.error(tValidation("nameRequired"));
        return false;
      }
      if (!isValidEmail(form.email)) {
        toast.error(tValidation("emailInvalid"));
        return false;
      }
      return true;
    }
    if (step === 1) {
      if (!form.managerName.trim()) {
        toast.error(tValidation("managerNameRequired"));
        return false;
      }
      if (!form.managerMobile.trim()) {
        toast.error(tValidation("mobileRequired"));
        return false;
      }
      if (!isValidEmail(form.managerEmail)) {
        toast.error(tValidation("emailInvalid"));
        return false;
      }
      return true;
    }
    if (step === 2) {
      const validReps = form.representatives.filter(
        (rep) =>
          rep.name.trim() &&
          rep.mobile.trim() &&
          rep.nationality != null,
      );
      if (validReps.length === 0) {
        toast.error(tValidation("representativesRequired"));
        return false;
      }
      for (const rep of form.representatives) {
        const hasAny =
          rep.name.trim() || rep.mobile.trim() || rep.nationality != null;
        if (!hasAny) continue;
        if (!rep.name.trim()) {
          toast.error(tValidation("representativeNameRequired"));
          return false;
        }
        if (!rep.mobile.trim()) {
          toast.error(tValidation("mobileRequired"));
          return false;
        }
        if (!rep.nationality) {
          toast.error(tValidation("representativeNationalityRequired"));
          return false;
        }
      }
      return true;
    }
    if (step === 3) {
      if (!form.confirmedReview) {
        toast.error(tValidation("confirmRequired"));
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep(activeStep)) return;
    if (activeStep === STEP_KEYS.length - 1) {
      setSubmitting(true);
      try {
        // TODO: wire to API when available
        await new Promise((resolve) => setTimeout(resolve, 400));
        toast.success(t("submitSuccess"));
        onClose();
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

  const validRepresentatives = useMemo(
    () =>
      form.representatives.filter(
        (rep) =>
          rep.name.trim() &&
          rep.mobile.trim() &&
          rep.nationality != null,
      ),
    [form.representatives],
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StackColumn gap={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  {tFields("logo")}
                </Typography>
                <Box
                  sx={{
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 3,
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    bgcolor: "action.hover",
                  }}
                >
                  {logoPreview ? (
                    <Box
                      component="img"
                      src={logoPreview}
                      alt={tFields("logo")}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: 120,
                        objectFit: "contain",
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    <CloudUpload sx={{ fontSize: 48, color: "text.disabled" }} />
                  )}
                  <label htmlFor={uploadInputId}>
                    <Button component="span" variant="outlined" color="secondary">
                      {tFields("attach")}
                    </Button>
                  </label>
                  <input
                    id={uploadInputId}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleLogoChange}
                  />
                </Box>

                <TextField
                  label={tFields("constrixId")}
                  value={form.constrixId}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleCopyConstrixId}
                          aria-label={t("copied")}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </StackColumn>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <StackColumn gap={2.5}>
                <TextField
                  label={tFields("name")}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  fullWidth
                  required
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label={tFields("taxCard")}
                      value={form.taxCard}
                      onChange={(e) => updateField("taxCard", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label={tFields("commercialRegister")}
                      value={form.commercialRegister}
                      onChange={(e) =>
                        updateField("commercialRegister", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label={tFields("activity")}
                      value={form.activity}
                      onChange={(e) => updateField("activity", e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>{tFields("selectActivity")}</em>
                      </MenuItem>
                      {ACTIVITY_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label={tFields("email")}
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Autocomplete
                  loading={loadingCountries}
                  options={countries}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  value={form.country}
                  onChange={(_, value) => updateField("country", value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={tFields("country")}
                      placeholder={tFields("selectCountry")}
                    />
                  )}
                />
              </StackColumn>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <StackColumn gap={2.5}>
            <TextField
              label={tFields("managerName")}
              value={form.managerName}
              onChange={(e) => updateField("managerName", e.target.value)}
              fullWidth
              required
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={tFields("mobile")}
                  value={form.managerMobile}
                  onChange={(e) => updateField("managerMobile", e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={tFields("email")}
                  type="email"
                  value={form.managerEmail}
                  onChange={(e) => updateField("managerEmail", e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Autocomplete
              loading={loadingCountries}
              options={countries}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              value={form.managerNationality}
              onChange={(_, value) => updateField("managerNationality", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={tFields("nationality")}
                  placeholder={tFields("selectNationality")}
                />
              )}
            />
          </StackColumn>
        );

      case 2:
        return (
          <StackColumn gap={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              {tFields("representativesTitle")}
            </Typography>

            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 720 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell width={48}>{tReview("indexColumn")}</TableCell>
                      <TableCell>{tFields("representativeName")} *</TableCell>
                      <TableCell>{tFields("representativeMobile")} *</TableCell>
                      <TableCell>{tFields("representativeNationality")} *</TableCell>
                      <TableCell width={56} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {form.representatives.map((rep, index) => (
                      <TableRow key={rep.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <TextField
                            value={rep.name}
                            onChange={(e) =>
                              updateRepresentative(rep.id, {
                                name: e.target.value,
                              })
                            }
                            fullWidth
                            size="small"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={rep.mobile}
                            onChange={(e) =>
                              updateRepresentative(rep.id, {
                                mobile: e.target.value,
                              })
                            }
                            fullWidth
                            size="small"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            size="small"
                            loading={loadingCountries}
                            options={countries}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(a, b) => a.id === b.id}
                            value={rep.nationality}
                            onChange={(_, value) =>
                              updateRepresentative(rep.id, { nationality: value })
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={tFields("selectNationality")}
                                required
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="secondary"
                            onClick={() => removeRepresentative(rep.id)}
                            disabled={form.representatives.length <= 1}
                            aria-label={t("cancel")}
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
              onClick={addRepresentative}
              sx={{
                alignSelf: "flex-start",
                borderStyle: "dashed",
              }}
            >
              + {tFields("addRepresentative")}
            </Button>
          </StackColumn>
        );

      case 3:
        return (
          <StackColumn gap={2.5}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ReviewSection
                  icon={<BusinessOutlined sx={{ fontSize: 22 }} />}
                  title={tReview("contractorSection")}
                  rows={[
                    { label: tFields("name"), value: form.name },
                    { label: tFields("constrixId"), value: form.constrixId },
                    {
                      label: tFields("commercialRegister"),
                      value: form.commercialRegister,
                    },
                    { label: tFields("taxCard"), value: form.taxCard },
                    {
                      label: tFields("contractorEmail"),
                      value: form.email,
                    },
                    { label: tFields("activity"), value: form.activity },
                    {
                      label: tFields("country"),
                      value: form.country?.name ?? "",
                    },
                  ]}
                  emptyDash={emptyDash}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ReviewSection
                  icon={<PersonOutline sx={{ fontSize: 22 }} />}
                  title={tReview("managerSection")}
                  rows={[
                    { label: tFields("managerName"), value: form.managerName },
                    { label: tFields("mobile"), value: form.managerMobile },
                    { label: tFields("email"), value: form.managerEmail },
                    {
                      label: tFields("nationality"),
                      value: form.managerNationality?.name ?? "",
                    },
                  ]}
                  emptyDash={emptyDash}
                />
              </Grid>
            </Grid>

            {logoPreview ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: -1,
                }}
              >
                <Box
                  component="img"
                  src={logoPreview}
                  alt={tFields("logo")}
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: 2,
                    borderColor: "divider",
                  }}
                />
              </Box>
            ) : null}

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <GroupsOutlined sx={{ fontSize: 22, color: "text.secondary" }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  {tReview("representativesSection")}
                </Typography>
              </Stack>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{tReview("indexColumn")}</TableCell>
                    <TableCell>{tFields("representativeName")}</TableCell>
                    <TableCell>{tFields("representativeMobile")}</TableCell>
                    <TableCell>{tFields("representativeNationality")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validRepresentatives.map((rep, index) => (
                    <TableRow key={rep.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{rep.name}</TableCell>
                      <TableCell>{rep.mobile}</TableCell>
                      <TableCell>{rep.nationality?.name ?? emptyDash}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.confirmedReview}
                  onChange={(e) =>
                    updateField("confirmedReview", e.target.checked)
                  }
                  color="secondary"
                />
              }
              label={tReview("confirmLabel")}
            />
          </StackColumn>
        );

      default:
        return null;
    }
  };

  const isLastStep = activeStep === STEP_KEYS.length - 1;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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

        <Box sx={{ minHeight: 280 }}>{renderStepContent()}</Box>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {activeStep === 0 ? (
            <>
              <Button variant="outlined" onClick={handleClose} disabled={submitting}>
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleNext}
                disabled={submitting}
              >
                {t("next")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" onClick={handleBack} disabled={submitting}>
                {t("back")}
              </Button>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="outlined" onClick={handleClose} disabled={submitting}>
                  {t("cancel")}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  disabled={submitting || (isLastStep && !form.confirmedReview)}
                >
                  {isLastStep ? t("next") : t("next")}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function ReviewSection({
  icon,
  title,
  rows,
  emptyDash,
}: {
  icon: React.ReactNode;
  title: string;
  rows: { label: string; value: string }[];
  emptyDash: string;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Box sx={{ color: "text.secondary" }}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      <Stack
        spacing={0}
        divider={<Divider flexItem sx={{ borderColor: "divider" }} />}
      >
        {rows.map((row) => (
          <Stack
            key={row.label}
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{ py: 1.25 }}
          >
            <Typography variant="body2" color="text.secondary">
              {row.label}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ textAlign: "end" }}>
              {displayValue(row.value, emptyDash)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

function StackColumn({
  children,
  gap = 2,
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap }}>{children}</Box>
  );
}
