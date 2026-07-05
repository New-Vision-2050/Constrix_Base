"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
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
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useNotificationScope } from "@/modules/projects/project/hooks/useNotificationScope";
import {
  useCreateProjectNotificationMutation,
  useProjectNotificationDetail,
  useUpdateProjectNotificationMutation,
} from "@/modules/projects/project/query/useProjectNotificationMutations";
import { useProjectNotificationEmployees } from "@/modules/projects/project/query/useProjectNotificationEmployees";
import { useProjectNotificationContractors } from "@/modules/projects/project/query/useProjectNotificationContractors";
import { useProjectNotificationTypes } from "@/modules/projects/project/query/useProjectNotificationTypes";
import type { ProjectNotificationEmployee, ProjectNotificationType } from "@/services/api/projects/notifications/types/response";
import ProjectNotificationMap from "./ProjectNotificationMap";
import { useGoogleRouteDistances } from "./useGoogleRouteDistances";
import type { MapPolygon } from "@/components/shared/MapPolygonDrawer";
import {
  EMPTY_FORM,
  type WizardFormData,
  type WizardFormErrors,
  type WizardStep,
} from "./types";
import { notificationToWizardForm } from "./normalize";
import { buildCreatePayload, buildUpdatePayload } from "./buildPayload";
import { validateStep, firstStepWithError } from "./validate";
import { useProjectNotificationLocationPolygons } from "./useProjectNotificationLocationPolygons";
import { isPointInAnyPolygon } from "./utils";

interface CreateNotificationWizardProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  notificationId?: string | null;
}

const STEP_COUNT = 5;

export default function CreateNotificationWizard({
  open,
  onClose,
  mode = "create",
  notificationId,
}: CreateNotificationWizardProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const { projectId, contractualEngagementKey, hasScope } =
    useNotificationScope();
  const notificationScope = { projectId, contractualEngagementKey };

  const { data: existingNotification, isLoading: isLoadingDetail } =
    useProjectNotificationDetail(
      notificationScope,
      mode === "edit" ? notificationId ?? undefined : undefined,
    );

  const [step, setStep] = useState<WizardStep>(1);
  const [data, setData] = useState<WizardFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<WizardFormErrors>({});
  const [confirmed, setConfirmed] = useState({
    dataReviewed: false,
    readyToSend: false,
  });

  const createMutation = useCreateProjectNotificationMutation();
  const updateMutation = useUpdateProjectNotificationMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const notificationTypesQuery = useProjectNotificationTypes();
  const notificationTypes = notificationTypesQuery.data ?? [];

  const employeeQuery = useProjectNotificationEmployees({
    projectId,
    contractualEngagementKey,
    latitude: data.task_latitude ?? undefined,
    longitude: data.task_longitude ?? undefined,
    enabled: step === 4,
  });

  const employees = useMemo(() => {
    const list = employeeQuery.data ?? [];
    return [...list].sort((a, b) => a.distance_meters - b.distance_meters);
  }, [employeeQuery.data]);

  const locationPolygons = useProjectNotificationLocationPolygons(hasScope);

  const isInsideAllowedZone = useMemo(() => {
    if (data.task_latitude == null || data.task_longitude == null) return true;
    return isPointInAnyPolygon(
      { lat: data.task_latitude, lng: data.task_longitude },
      locationPolygons,
    );
  }, [data.task_latitude, data.task_longitude, locationPolygons]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setData(EMPTY_FORM);
      setErrors({});
      setConfirmed({ dataReviewed: false, readyToSend: false });
      return;
    }

    if (mode === "edit" && existingNotification) {
      setData(notificationToWizardForm(existingNotification));
    } else if (mode === "create") {
      setData(EMPTY_FORM);
    }
  }, [open, mode, existingNotification]);

  const updateField = useCallback(
    function updateField<K extends keyof WizardFormData>(
      field: K,
      value: WizardFormData[K],
    ) {
      setData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) =>
        prev[field] ? { ...prev, [field]: undefined } : prev,
      );
    },
    [],
  );

  function handleNext() {
    const validation = validateStep(step, data);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    if (step === 3 && !isInsideAllowedZone) {
      toast.error(t("locationOutsideAllowedZone"));
      return;
    }
    if (step < STEP_COUNT) {
      setStep((prev) => ((prev + 1) as WizardStep));
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((prev) => ((prev - 1) as WizardStep));
    }
  }

  function handleApiError(error: unknown) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          message?: {
            validations?: { field: string; errors: string[] }[];
            description?: string;
          };
          payload?: { field: string; errors: string[] }[];
        };
      };
    };

    if (axiosError.response?.status === 422) {
      const validations =
        axiosError.response.data?.message?.validations ??
        axiosError.response.data?.payload ??
        [];
      const fieldErrors: WizardFormErrors = Object.fromEntries(
        validations.map(({ field, errors }) => [field, errors?.[0]]),
      );
      setErrors(fieldErrors);
      const errorStep = firstStepWithError(fieldErrors);
      if (errorStep) setStep(errorStep);
      toast.error(t("createdError"));
    } else {
      toast.error(
        axiosError.response?.data?.message?.description ?? t("createdError"),
      );
    }
  }

  async function handleSubmit() {
    if (!hasScope) return;

    const validation = validateStep(4, data);
    if (!validation.valid) {
      setErrors(validation.errors);
      setStep(4);
      return;
    }

    try {
      if (mode === "edit" && notificationId) {
        await updateMutation.mutateAsync(
          buildUpdatePayload(notificationId, notificationScope, data),
        );
        toast.success(t("updatedSuccess"));
      } else {
        await createMutation.mutateAsync(
          buildCreatePayload(notificationScope, data),
        );
        toast.success(t("createdSuccess"));
      }
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  }

  const steps = [
    t("step1"),
    t("step2"),
    t("step3"),
    t("step4"),
    t("step5"),
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 6,
        }}
      >
        <span>
          {mode === "edit" ? t("wizardEdit") : t("wizard")}
        </span>
        <IconButton
          onClick={onClose}
          disabled={isSubmitting}
          aria-label={t("cancel")}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {mode === "edit" && isLoadingDetail ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography color="text.secondary">{t("loading")}</Typography>
          </Box>
        ) : (
          <>
            <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {step === 1 && (
              <Step1Form data={data} errors={errors} onChange={updateField} t={t} notificationTypes={notificationTypes} />
            )}
            {step === 2 && (
              <Step2Form data={data} errors={errors} onChange={updateField} t={t} />
            )}
            {step === 3 && (
              <Step3Form
                data={data}
                errors={errors}
                onChange={updateField}
                t={t}
                polygons={locationPolygons}
                isInsideAllowedZone={isInsideAllowedZone}
              />
            )}
            {step === 4 && (
              <Step4Form
                data={data}
                errors={errors}
                employees={employees}
                isLoading={employeeQuery.isLoading}
                onChange={updateField}
                t={t}
                polygons={locationPolygons}
              />
            )}
            {step === 5 && (
              <Step5Form
                data={data}
                employees={employees}
                confirmed={confirmed}
                onChangeConfirmed={(value) => setConfirmed(value)}
                t={t}
              />
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t("cancel")}
        </Button>
        <Box sx={{ flex: 1 }} />
        {step > 1 && (
          <Button onClick={handleBack} disabled={isSubmitting}>
            {t("previous")}
          </Button>
        )}
        {step < STEP_COUNT && (
          <Button variant="contained" onClick={handleNext}>
            {t("next")}
          </Button>
        )}
        {step === STEP_COUNT && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              isSubmitting || !confirmed.dataReviewed || !confirmed.readyToSend
            }
          >
            {isSubmitting
              ? t("loading")
              : mode === "edit"
                ? t("update")
                : t("send")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

// ============================================================================
// Step 1: Notification Info
// ============================================================================

function Step1Form({
  data,
  errors,
  onChange,
  t,
  notificationTypes,
}: {
  data: WizardFormData;
  errors: WizardFormErrors;
  onChange: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  t: ReturnType<typeof useTranslations>;
  notificationTypes: ProjectNotificationType[];
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("notification_number", { defaultValue: "رقم الإشعار" })}
          value={data.notification_number}
          onChange={(e) => onChange("notification_number", e.target.value)}
          error={Boolean(errors.notification_number)}
          helperText={errors.notification_number}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          size="small"
          label={t("notificationType", { defaultValue: "نوع الاشعار" })}
          value={data.notification_type}
          onChange={(e) => onChange("notification_type", e.target.value)}
          error={Boolean(errors.notification_type)}
          helperText={errors.notification_type}
        >
          {notificationTypes.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("feeder_number", { defaultValue: "رقم المغذي" })}
          value={data.feeder_number}
          onChange={(e) => onChange("feeder_number", e.target.value)}
          error={Boolean(errors.feeder_number)}
          helperText={errors.feeder_number}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("machineNumber", { defaultValue: "رقم المعدة" })}
          value={data.machine_number}
          onChange={(e) => onChange("machine_number", e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          size="small"
          label={t("description")}
          value={data.work_description}
          onChange={(e) => onChange("work_description", e.target.value)}
          error={Boolean(errors.work_description)}
          helperText={errors.work_description}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          type="date"
          label={t("taskDate")}
          value={data.task_date}
          onChange={(e) => onChange("task_date", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label={t("durationHours")}
          value={data.duration_hours}
          onChange={(e) => onChange("duration_hours", Number(e.target.value))}
          inputProps={{ min: 1 }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          size="small"
          label={t("notes")}
          value={data.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </Grid>
    </Grid>
  );
}

// ============================================================================
// Step 2: Contractor Info
// ============================================================================

function Step2Form({
  data,
  errors,
  onChange,
  t,
}: {
  data: WizardFormData;
  errors: WizardFormErrors;
  onChange: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const contractorsQuery = useProjectNotificationContractors();
  const contractors = contractorsQuery.data ?? [];

  function handleContractorChange(contractorId: string) {
    const selected = contractors.find((c) => c.id === contractorId);
    onChange("contractor_id", contractorId);
    onChange("contractor_name", selected?.name ?? "");
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Autocomplete
          fullWidth
          size="small"
          options={contractors}
          loading={contractorsQuery.isLoading}
          getOptionLabel={(option) => option.name ?? ""}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          value={contractors.find((c) => c.id === data.contractor_id) ?? null}
          onChange={(_e, value) => handleContractorChange(value?.id ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("contractor")}
              error={Boolean(errors.contractor_name)}
              helperText={errors.contractor_name}
              placeholder={t("chooseContractor", { defaultValue: "Choose contractor" })}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("contractorTechnicalName", { defaultValue: "Contractor technical name" })}
          value={data.contractor_technical_name}
          onChange={(e) => onChange("contractor_technical_name", e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("contractorTechnicalNumber")}
          value={data.contractor_technical_number}
          onChange={(e) => onChange("contractor_technical_number", e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("permitSource", { defaultValue: "Permit Source" })}
          value={data.permit_source}
          onChange={(e) => onChange("permit_source", e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("permitRecipient", { defaultValue: "Permit Recipient" })}
          value={data.permit_recipient}
          onChange={(e) => onChange("permit_recipient", e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          size="small"
          label={t("contractorNotes")}
          value={data.contractor_notes}
          onChange={(e) => onChange("contractor_notes", e.target.value)}
        />
      </Grid>
    </Grid>
  );
}

// ============================================================================
// Step 3: Location
// ============================================================================

function Step3Form({
  data,
  errors,
  onChange,
  t,
  polygons,
  isInsideAllowedZone,
}: {
  data: WizardFormData;
  errors: WizardFormErrors;
  onChange: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  t: ReturnType<typeof useTranslations>;
  polygons: MapPolygon[];
  isInsideAllowedZone: boolean;
}) {
  const center = useMemo(
    () => ({
      lat: data.task_latitude ?? 24.7136,
      lng: data.task_longitude ?? 46.6753,
    }),
    [data.task_latitude, data.task_longitude],
  );

  function setLocation(lat: number, lng: number) {
    onChange("task_latitude", lat);
    onChange("task_longitude", lng);
    onChange("location_link", `https://maps.google.com/?q=${lat},${lng}`);
  }

  function onPinMoved(lat: number, lng: number) {
    setLocation(lat, lng);
  }

  function parseLink() {
    const url = data.location_link;
    const match = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      setLocation(parseFloat(match[1]), parseFloat(match[2]));
      toast.success(t("locationConfirmed"));
    } else {
      toast.error(t("invalidLocationLink"));
    }
  }

  return (
    <Stack spacing={2}>
      <ProjectNotificationMap
        center={center}
        radius={data.location_radius}
        height="350px"
        interactivePin
        showEmployees={false}
        polygons={polygons}
        onPinMoved={onPinMoved}
        showPin={data.task_latitude != null && data.task_longitude != null}
        showControls
      />

      {polygons.length > 0 && !isInsideAllowedZone && (
        <Alert severity="error">{t("locationOutsideAllowedZone")}</Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label={t("latitude")}
            value={data.task_latitude ?? ""}
            onChange={(e) =>
              onChange("task_latitude", e.target.value === "" ? null : parseFloat(e.target.value))
            }
            error={Boolean(errors.task_latitude)}
            helperText={errors.task_latitude}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label={t("longitude")}
            value={data.task_longitude ?? ""}
            onChange={(e) =>
              onChange("task_longitude", e.target.value === "" ? null : parseFloat(e.target.value))
            }
            error={Boolean(errors.task_longitude)}
            helperText={errors.task_longitude}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label={t("locationRadius")}
            value={data.location_radius}
            onChange={(e) => onChange("location_radius", Number(e.target.value))}
            error={Boolean(errors.location_radius)}
            helperText={errors.location_radius}
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            size="small"
            label={t("locationLink")}
            value={data.location_link}
            onChange={(e) => onChange("location_link", e.target.value)}
            placeholder={t("parseLinkPlaceholder")}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Button variant="outlined" onClick={parseLink} fullWidth>
            {t("parseLink")}
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}

// ============================================================================
// Step 4: Assign to Employee
// ============================================================================

function Step4Form({
  data,
  errors,
  employees,
  isLoading,
  onChange,
  t,
  polygons,
}: {
  data: WizardFormData;
  errors: WizardFormErrors;
  employees: ProjectNotificationEmployee[];
  isLoading: boolean;
  onChange: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  t: ReturnType<typeof useTranslations>;
  polygons: MapPolygon[];
}) {
  const center = useMemo(
    () => ({
      lat: data.task_latitude ?? 24.7136,
      lng: data.task_longitude ?? 46.6753,
    }),
    [data.task_latitude, data.task_longitude],
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  const statusOptions = [
    {
      value: "",
      label: t("allStatuses", { defaultValue: "All statuses" }),
    },
    { value: "available", label: t("available", { defaultValue: "Available" }) },
    { value: "busy", label: t("busy", { defaultValue: "Busy" }) },
    { value: "no_location", label: t("noLocation", { defaultValue: "No Location" }) },
    { value: "offline", label: t("offline", { defaultValue: "Offline" }) },
  ];

  const branchOptions = useMemo(() => {
    const branches = new Set<string>();
    employees.forEach((e) => {
      if (e.branch) branches.add(e.branch);
    });
    return [
      {
        value: "",
        label: t("allBranches", { defaultValue: "All branches" }),
      },
      ...Array.from(branches).map((b) => ({ value: b, label: b })),
    ];
  }, [employees, t]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesStatus = !statusFilter || employee.status === statusFilter;
      const matchesName =
        !nameFilter || employee.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesBranch = !branchFilter || employee.branch === branchFilter;
      return matchesStatus && matchesName && matchesBranch;
    });
  }, [employees, statusFilter, nameFilter, branchFilter]);

  const routeDistances = useGoogleRouteDistances(filteredEmployees, center);

  const enrichedEmployees = useMemo(() => {
    return filteredEmployees.map((employee) => {
      const route = routeDistances[employee.user_id];
      return {
        ...employee,
        route_distance_meters: route?.distance.value ?? employee.distance_meters,
        route_distance_label: route?.distance.text ?? employee.distance_label,
        route_duration_text: route?.duration.text ?? "",
      };
    });
  }, [filteredEmployees, routeDistances]);

  const sortedEmployees = useMemo(() => {
    return [...enrichedEmployees].sort(
      (a, b) => a.route_distance_meters - b.route_distance_meters,
    );
  }, [enrichedEmployees]);

  useEffect(() => {
    const selected = sortedEmployees.find(
      (employee) => employee.user_id === data.assigned_user_id,
    );
    if (selected) {
      onChange("selected_distance_meters", selected.route_distance_meters);
    }
  }, [sortedEmployees, data.assigned_user_id, onChange]);

  const statusColor = (status: string) => {
    switch (status) {
      case "available":
      case "available_far":
        return "#22c55e";
      case "busy":
        return "#f97316";
      case "no_location":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const statusLabel = (employee: ProjectNotificationEmployee) => employee.status_label;

  return (
    <Grid container spacing={2} sx={{ height: "500px" }}>
      <Grid size={{ xs: 12, md: 7 }} sx={{ height: "100%" }}>
        <ProjectNotificationMap
          center={center}
          radius={data.location_radius}
          employees={sortedEmployees}
          selectedUserId={data.assigned_user_id}
          onSelectEmployee={(userId) => onChange("assigned_user_id", userId)}
          height="100%"
          polygons={polygons}
          showPolyline
          routeDistances={routeDistances}
          showPin={data.task_latitude != null && data.task_longitude != null}
          showEmployees
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }} sx={{ height: "100%", overflow: "auto" }}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography variant="subtitle2" gutterBottom>
            {t("employees")}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              select
              size="small"
              label={t("filterByStatus")}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 130 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              label={t("searchByName", { defaultValue: "Search by name" })}
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              sx={{ flex: 1 }}
            />

            {branchOptions.length > 1 && (
              <TextField
                select
                size="small"
                label={t("branch", { defaultValue: "Branch" })}
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                sx={{ minWidth: 130 }}
              >
                {branchOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {isLoading ? (
            <Typography color="text.secondary">{t("loading")}</Typography>
          ) : filteredEmployees.length === 0 ? (
            <Typography color="text.secondary">
              {t("noEmployeesMatch", { defaultValue: "No employees match the filters" })}
            </Typography>
          ) : (
            <TableContainer component={Box} sx={{ border: "1px solid", borderColor: "divider" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      {t("assignment", { defaultValue: "Assign" })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("employeeName", { defaultValue: "Employee name" })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("employeeStatus", { defaultValue: "Status" })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("routeDistance", { defaultValue: "Distance" })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("estimatedDuration", { defaultValue: "Duration" })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("currentLocation", { defaultValue: "Current location" })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedEmployees.map((employee) => {
                    const isSelected = data.assigned_user_id === employee.user_id;
                    const hasLocation =
                      employee.location?.latitude != null &&
                      employee.location?.longitude != null;
                    return (
                      <TableRow
                        key={employee.user_id}
                        onClick={() => onChange("assigned_user_id", employee.user_id)}
                        sx={{
                          cursor: "pointer",
                          bgcolor: isSelected ? "action.selected" : "background.paper",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell align="center">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => onChange("assigned_user_id", employee.user_id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {employee.name}
                          </Typography>
                          {employee.branch && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {employee.branch}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: statusColor(employee.status),
                              }}
                            />
                            <Typography variant="body2">{statusLabel(employee)}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {employee.route_distance_label}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {employee.route_duration_text || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {hasLocation ? (
                            <Typography variant="caption" color="text.secondary">
                              {Number(employee.location?.latitude)?.toFixed(4)},{" "}
                              {Number(employee.location?.longitude)?.toFixed(4)}
                            </Typography>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              {t("noLocation", { defaultValue: "No location" })}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {errors.assigned_user_id && (
            <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
              {errors.assigned_user_id}
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

// ============================================================================
// Step 5: Confirm & Send
// ============================================================================

function Step5Form({
  data,
  employees,
  confirmed,
  onChangeConfirmed,
  t,
}: {
  data: WizardFormData;
  employees: ProjectNotificationEmployee[];
  confirmed: { dataReviewed: boolean; readyToSend: boolean };
  onChangeConfirmed: (value: { dataReviewed: boolean; readyToSend: boolean }) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const selectedEmployee = employees.find((e) => e.user_id === data.assigned_user_id);
  const center = useMemo(() => {
    if (data.task_latitude == null || data.task_longitude == null) return null;
    return { lat: data.task_latitude, lng: data.task_longitude };
  }, [data.task_latitude, data.task_longitude]);
  const routeEmployees = useMemo(
    () => (selectedEmployee ? [selectedEmployee] : []),
    [selectedEmployee],
  );
  const routeDistances = useGoogleRouteDistances(routeEmployees, center);

  return (
    <Stack spacing={3}>
      <SummaryCard
        title={t("summaryNotification")}
        rows={[
          { label: t("notification_number", { defaultValue: "رقم الإشعار" }), value: data.notification_number },
          { label: t("notificationType", { defaultValue: "نوع الاشعار" }), value: data.notification_type },
          { label: t("feeder_number", { defaultValue: "رقم المغذي" }), value: data.feeder_number },
          { label: t("machineNumber", { defaultValue: "رقم المعدة" }), value: data.machine_number },
          { label: t("description"), value: data.work_description },
        ]}
      />

      <SummaryCard
        title={t("summaryContractor")}
        rows={[
          { label: t("contractor"), value: data.contractor_name },
          { label: t("contractorTechnicalName", { defaultValue: "Contractor technical name" }), value: data.contractor_technical_name },
          { label: t("contractorTechnicalNumber"), value: data.contractor_technical_number },
          { label: t("permitSource", { defaultValue: "Permit Source" }), value: data.permit_source },
          { label: t("permitRecipient", { defaultValue: "Permit Recipient" }), value: data.permit_recipient },
        ]}
      />

      <SummaryCard
        title={t("summaryLocation")}
        rows={[
          {
            label: t("coordinates"),
            value: `${data.task_latitude ?? ""}, ${data.task_longitude ?? ""}`,
          },
          { label: t("locationRadius"), value: `${data.location_radius} ${t("meters")}` },
        ]}
      >
        {data.task_latitude != null && data.task_longitude != null && (
          <Box sx={{ mt: 2, height: 160 }}>
            <ProjectNotificationMap
              center={{ lat: data.task_latitude, lng: data.task_longitude }}
              radius={data.location_radius}
              height="160px"
              employees={selectedEmployee ? [selectedEmployee] : []}
              selectedUserId={data.assigned_user_id}
              showEmployees={Boolean(selectedEmployee)}
              showPolyline={Boolean(selectedEmployee)}
              routeDistances={routeDistances}
              interactivePin={false}
              showPin={data.task_latitude != null && data.task_longitude != null}
            />
          </Box>
        )}
      </SummaryCard>

      <SummaryCard
        title={t("summaryAssignment")}
        rows={[
          { label: t("employeeName"), value: selectedEmployee?.name ?? "-" },
          {
            label: t("distance"),
            value: selectedEmployee?.distance_label ?? "-",
          },
          {
            label: t("employeeStatus"),
            value: selectedEmployee?.status_label ?? "-",
          },
        ]}
      />

      <Paper variant="outlined" sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed.dataReviewed}
              onChange={(e) =>
                onChangeConfirmed({ ...confirmed, dataReviewed: e.target.checked })
              }
            />
          }
          label={t("confirmData")}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed.readyToSend}
              onChange={(e) =>
                onChangeConfirmed({ ...confirmed, readyToSend: e.target.checked })
              }
            />
          }
          label={t("readyToSend")}
        />
      </Paper>
    </Stack>
  );
}

function SummaryCard({
  title,
  rows,
  children,
}: {
  title: string;
  rows: { label: string; value: React.ReactNode }[];
  children?: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={1}>
        {rows.map((row, index) => (
          <Grid size={{ xs: 12, sm: 6 }} key={index}>
            <Typography variant="caption" color="text.secondary" display="block">
              {row.label}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {row.value || "-"}
            </Typography>
          </Grid>
        ))}
      </Grid>
      {children}
    </Paper>
  );
}
