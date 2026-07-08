"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import { toast } from "sonner";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import { useUpdateProjectNotificationMutation } from "@/modules/projects/project/query/useProjectNotificationMutations";
import { useProjectNotificationContractors } from "@/modules/projects/project/query/useProjectNotificationContractors";
import { useProjectNotificationEmployees } from "@/modules/projects/project/query/useProjectNotificationEmployees";
import { useProjectNotificationTypes } from "@/modules/projects/project/query/useProjectNotificationTypes";
import { useNotificationScope } from "@/modules/projects/project/hooks/useNotificationScope";
import { formatDistanceMeters } from "@/modules/projects/project/utils/distanceFormat";
import EditableSection from "./EditableSection";
import ProjectNotificationMap from "./wizard/ProjectNotificationMap";
import { useGoogleRouteDistances } from "./wizard/useGoogleRouteDistances";
import { useProjectNotificationLocationPolygons } from "./wizard/useProjectNotificationLocationPolygons";
import { isPointInAnyPolygon } from "./wizard/utils";
import {
  EMPTY_FORM,
  type WizardFormData,
} from "./wizard/types";
import { notificationToWizardForm } from "./wizard/normalize";
import { buildUpdatePayload } from "./wizard/buildPayload";
import { SEVERITY_CONFIG } from "@/modules/projects/project/utils/notificationStatusConfig";
import NotificationStatusBadge from "./NotificationStatusBadge";
import NotificationSeverityBadge from "./NotificationSeverityBadge";

interface NotificationDetailEditableProps {
  notification: ProjectNotification;
}

function formatDateOnly(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function FieldBlock({ caption, value }: { caption: string; value: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        display="block"
        sx={{ mb: 0.5 }}
      >
        {caption}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={600}
        color="text.primary"
        sx={{ wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function NotificationDetailEditable({
  notification,
}: NotificationDetailEditableProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const theme = useTheme();
  const isRTL = theme.direction === "rtl";
  const { projectId, contractualEngagementKey, hasScope } =
    useNotificationScope();
  const notificationScope = { projectId, contractualEngagementKey };

  const updateMutation = useUpdateProjectNotificationMutation();
  const contractorsQuery = useProjectNotificationContractors();
  const contractors = contractorsQuery.data ?? [];
  const notificationTypesQuery = useProjectNotificationTypes();
  const notificationTypes = notificationTypesQuery.data ?? [];
  const locationPolygons = useProjectNotificationLocationPolygons(hasScope);

  const [formData, setFormData] = useState<WizardFormData>(EMPTY_FORM);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  useEffect(() => {
    setFormData(notificationToWizardForm(notification));
  }, [notification]);

  const updateField = useCallback(
    function updateField<K extends keyof WizardFormData>(
      field: K,
      value: WizardFormData[K],
    ) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const isInsideAllowedZone = useMemo(() => {
    if (formData.task_latitude == null || formData.task_longitude == null)
      return true;
    return isPointInAnyPolygon(
      { lat: formData.task_latitude, lng: formData.task_longitude },
      locationPolygons,
    );
  }, [formData.task_latitude, formData.task_longitude, locationPolygons]);

  async function saveSection(section: string, partialData: Partial<WizardFormData>) {
    if (!hasScope || !notification) return;
    setSavingSection(section);
    try {
      const mergedData = { ...formData, ...partialData };
      await updateMutation.mutateAsync(
        buildUpdatePayload(notification.id, notificationScope, mergedData),
      );
      setFormData(mergedData);
      toast.success(t("updatedSuccess"));
    } catch (error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: { description?: string } };
        };
      };
      toast.error(
        axiosError.response?.data?.message?.description ?? t("updatedError"),
      );
    } finally {
      setSavingSection(null);
    }
  }

  const tDash = "—";

  // ===========================================================================
  // Section 1: Notification Info
  // ===========================================================================
  const notificationReadFields = [
    { caption: t("notificationNumber"), value: notification.notification_number ?? tDash },
    { caption: t("notificationType"), value: notification.notification_type },
    { caption: t("workType"), value: notification.work_type ?? tDash },
    { caption: t("severity"), value: t(SEVERITY_CONFIG[notification.severity]?.labelKey ?? "severities.medium") },
    { caption: t("feeder_number"), value: notification.feeder_number ?? tDash },
    { caption: t("machineNumber", { defaultValue: "رقم المعدة" }), value: notification.machine_number ?? tDash },
    { caption: t("taskDate"), value: formatDateOnly(notification.task_date) },
    {
      caption: t("durationHours"),
      value: notification.duration_hours ? String(notification.duration_hours) : tDash,
    },
    { caption: t("notes"), value: notification.notes ?? tDash },
  ];

  const notificationEditFields = (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("notification_number")}
          value={formData.notification_number}
          onChange={(e) => updateField("notification_number", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          size="small"
          label={t("notificationType")}
          value={formData.notification_type}
          onChange={(e) => updateField("notification_type", e.target.value)}
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
          label={t("feeder_number")}
          value={formData.feeder_number}
          onChange={(e) => updateField("feeder_number", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("machineNumber", { defaultValue: "رقم المعدة" })}
          value={formData.machine_number}
          onChange={(e) => updateField("machine_number", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          type="date"
          label={t("taskDate")}
          value={formData.task_date}
          onChange={(e) => updateField("task_date", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label={t("durationHours")}
          value={formData.duration_hours}
          onChange={(e) => updateField("duration_hours", Number(e.target.value))}
          inputProps={{ min: 1 }}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          label={t("description")}
          value={formData.work_description}
          onChange={(e) => updateField("work_description", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          size="small"
          label={t("notes")}
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </Grid>
    </Grid>
  );

  // ===========================================================================
  // Section 2: Contractor Info
  // ===========================================================================
  const contractorReadFields = [
    { caption: t("contractor"), value: notification.contractor_name ?? tDash },
    { caption: t("contractorTechnicalName"), value: notification.contractor_technical_name ?? tDash },
    { caption: t("contractorTechnicalNumber"), value: notification.contractor_technical_number ?? tDash },
    { caption: t("contractorCategory"), value: notification.contractor_category ?? tDash },
    { caption: t("permitSource", { defaultValue: "Permit Source" }), value: notification.permit_source ?? tDash },
    { caption: t("permitRecipient", { defaultValue: "Permit Recipient" }), value: notification.permit_recipient ?? tDash },
    { caption: t("contractorNotes"), value: notification.contractor_notes ?? tDash },
  ];

  function handleContractorChange(contractorId: string) {
    const selected = contractors.find((c) => c.id === contractorId);
    updateField("contractor_id", contractorId);
    updateField("contractor_name", selected?.name ?? "");
  }

  const contractorEditFields = (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Autocomplete
          fullWidth
          size="small"
          options={contractors}
          loading={contractorsQuery.isLoading}
          getOptionLabel={(option) => option.name ?? ""}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          value={contractors.find((c) => c.id === formData.contractor_id) ?? null}
          onChange={(_e, value) => handleContractorChange(value?.id ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("contractor")}
              placeholder={t("chooseContractor")}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("contractorTechnicalName")}
          value={formData.contractor_technical_name}
          onChange={(e) => updateField("contractor_technical_name", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("contractorTechnicalNumber")}
          value={formData.contractor_technical_number}
          onChange={(e) => updateField("contractor_technical_number", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("contractorCategory")}
          value={formData.contractor_category}
          onChange={(e) => updateField("contractor_category", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("permitSource", { defaultValue: "Permit Source" })}
          value={formData.permit_source}
          onChange={(e) => updateField("permit_source", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label={t("permitRecipient", { defaultValue: "Permit Recipient" })}
          value={formData.permit_recipient}
          onChange={(e) => updateField("permit_recipient", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          label={t("contractorNotes")}
          value={formData.contractor_notes}
          onChange={(e) => updateField("contractor_notes", e.target.value)}
        />
      </Grid>
    </Grid>
  );

  // ===========================================================================
  // Section 3: Location
  // ===========================================================================
  const locationCenter = useMemo(
    () => ({
      lat: formData.task_latitude ?? notification.task_latitude ?? 24.7136,
      lng: formData.task_longitude ?? notification.task_longitude ?? 46.6753,
    }),
    [formData.task_latitude, formData.task_longitude, notification],
  );

  function setLocation(lat: number, lng: number) {
    updateField("task_latitude", lat);
    updateField("task_longitude", lng);
    updateField("location_link", `https://maps.google.com/?q=${lat},${lng}`);
  }

  const locationReadFields = (
    <Stack spacing={2}>
      <Grid container rowSpacing={3} columnSpacing={2}>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <FieldBlock
            caption={t("coordinates")}
            value={`${notification.task_latitude}, ${notification.task_longitude}`}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <FieldBlock
            caption={t("locationRadius")}
            value={`${notification.location_radius} ${t("meters")}`}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <FieldBlock caption={t("repairPoint")} value={notification.repair_point ?? tDash} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <FieldBlock
            caption={t("distance")}
            value={formatDistanceMeters(
              notification.selected_distance_meters,
              t("meters"),
              t("kilometers"),
            )}
          />
        </Grid>
      </Grid>
      <Box sx={{ height: 250, borderRadius: 2, overflow: "hidden" }}>
        <ProjectNotificationMap
          center={locationCenter}
          radius={notification.location_radius}
          height="250px"
          interactivePin={false}
          showEmployees={false}
          showPin
          polygons={locationPolygons}
        />
      </Box>
    </Stack>
  );

  const locationEditFields = (
    <Stack spacing={2}>
      <ProjectNotificationMap
        center={locationCenter}
        radius={formData.location_radius}
        height="300px"
        interactivePin
        showEmployees={false}
        polygons={locationPolygons}
        onPinMoved={(lat, lng) => setLocation(lat, lng)}
        showPin={formData.task_latitude != null && formData.task_longitude != null}
        showControls
      />
      {locationPolygons.length > 0 && !isInsideAllowedZone && (
        <Alert severity="error">{t("locationOutsideAllowedZone")}</Alert>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label={t("latitude")}
            value={formData.task_latitude ?? ""}
            onChange={(e) =>
              updateField("task_latitude", e.target.value === "" ? null : parseFloat(e.target.value))
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label={t("longitude")}
            value={formData.task_longitude ?? ""}
            onChange={(e) =>
              updateField("task_longitude", e.target.value === "" ? null : parseFloat(e.target.value))
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label={t("locationRadius")}
            value={formData.location_radius}
            onChange={(e) => updateField("location_radius", Number(e.target.value))}
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            size="small"
            label={t("locationLink")}
            value={formData.location_link}
            onChange={(e) => updateField("location_link", e.target.value)}
            placeholder={t("parseLinkPlaceholder")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label={t("repairPoint")}
            value={formData.repair_point}
            onChange={(e) => updateField("repair_point", e.target.value)}
          />
        </Grid>
      </Grid>
    </Stack>
  );

  // ===========================================================================
  // Section 4: Employee Assignment
  // ===========================================================================
  const employeeQuery = useProjectNotificationEmployees({
    projectId,
    contractualEngagementKey,
    latitude: formData.task_latitude ?? undefined,
    longitude: formData.task_longitude ?? undefined,
    enabled: true,
  });

  const employees = useMemo(() => {
    const list = employeeQuery.data ?? [];
    return [...list].sort((a, b) => a.distance_meters - b.distance_meters);
  }, [employeeQuery.data]);

  const routeDistances = useGoogleRouteDistances(employees, locationCenter);

  const initialAssignedUserIds = useMemo(
    () => new Set(notification.assigned_user_ids ?? []),
    [notification],
  );

  const enrichedEmployees = useMemo(() => {
    return employees.map((employee) => {
      const route = routeDistances[employee.user_id];
      return {
        ...employee,
        route_distance_meters: route?.distance.value ?? employee.distance_meters,
        route_distance_label: route?.distance.text ?? employee.distance_label,
        route_duration_text: route?.duration.text ?? "",
      };
    });
  }, [employees, routeDistances]);

  const sortedEmployees = useMemo(() => {
    return [...enrichedEmployees].sort(
      (a, b) => a.route_distance_meters - b.route_distance_meters,
    );
  }, [enrichedEmployees]);

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

  const employeeReadFields = (
    <Stack spacing={2}>
      <Grid container rowSpacing={3} columnSpacing={2}>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <FieldBlock
            caption={t("engineer")}
            value={
              notification.assigned_users && notification.assigned_users.length > 0
                ? notification.assigned_users.map((u) => u.name).join(", ")
                : (notification.assigned_user?.name ?? tDash)
            }
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <FieldBlock
            caption={t("distance")}
            value={formatDistanceMeters(
              notification.selected_distance_meters,
              t("meters"),
              t("kilometers"),
            )}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <FieldBlock
            caption={t("independentProgress", { defaultValue: "Independent progress" })}
            value={notification.independent_progress
              ? t("yes", { defaultValue: "Yes" })
              : t("no", { defaultValue: "No" })}
          />
        </Grid>
      </Grid>
      <Box sx={{ height: 250, borderRadius: 2, overflow: "hidden" }}>
        <ProjectNotificationMap
          center={locationCenter}
          radius={notification.location_radius}
          height="250px"
          employees={sortedEmployees}
          selectedUserIds={notification.assigned_user_ids ?? []}
          interactivePin={false}
          showEmployees
          showPolyline
          routeDistances={routeDistances}
          showPin
          polygons={locationPolygons}
        />
      </Box>
    </Stack>
  );

  const employeeEditFields = (
    <Grid container spacing={2} sx={{ height: "450px" }}>
      <Grid size={{ xs: 12, md: 7 }} sx={{ height: "100%" }}>
        <ProjectNotificationMap
          center={locationCenter}
          radius={formData.location_radius}
          employees={sortedEmployees}
          selectedUserIds={formData.assigned_user_ids}
          onSelectEmployee={(userId) => {
            const current = formData.assigned_user_ids;
            if (current.includes(userId)) {
              if (initialAssignedUserIds.has(userId)) return;
              updateField("assigned_user_ids", current.filter((id) => id !== userId));
            } else {
              updateField("assigned_user_ids", [...current, userId]);
            }
          }}
          height="100%"
          polygons={locationPolygons}
          showPolyline
          routeDistances={routeDistances}
          showPin={formData.task_latitude != null && formData.task_longitude != null}
          showEmployees
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }} sx={{ height: "100%", overflow: "auto" }}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography variant="subtitle2" gutterBottom>
            {t("employees")}
          </Typography>
          <FormControlLabel
            sx={{ mb: 1 }}
            control={
              <Switch
                checked={formData.independent_progress}
                onChange={(e) => updateField("independent_progress", e.target.checked)}
              />
            }
            label={t("independentProgress", { defaultValue: "Independent progress" })}
          />
          {employeeQuery.isLoading ? (
            <Typography color="text.secondary">{t("loading")}</Typography>
          ) : sortedEmployees.length === 0 ? (
            <Typography color="text.secondary">{t("noEmployeesMatch")}</Typography>
          ) : (
            <TableContainer component={Box} sx={{ border: 1, borderColor: "divider" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      {t("assignment")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("employeeName")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("employeeStatus")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("routeDistance")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedEmployees.map((employee) => {
                    const isSelected = formData.assigned_user_ids.includes(employee.user_id);
                    return (
                      <TableRow
                        key={employee.user_id}
                        onClick={() => {
                          const current = formData.assigned_user_ids;
                          if (current.includes(employee.user_id)) {
                            if (initialAssignedUserIds.has(employee.user_id)) return;
                            updateField("assigned_user_ids", current.filter((id) => id !== employee.user_id));
                          } else {
                            updateField("assigned_user_ids", [...current, employee.user_id]);
                            updateField("selected_distance_meters", employee.route_distance_meters);
                          }
                        }}
                        sx={{
                          cursor: "pointer",
                          bgcolor: isSelected ? "action.selected" : "background.paper",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell align="center">
                          <Checkbox
                            checked={isSelected}
                            disabled={isSelected && initialAssignedUserIds.has(employee.user_id)}
                            onChange={(e) => {
                              const current = formData.assigned_user_ids;
                              if (e.target.checked) {
                                updateField("assigned_user_ids", [...current, employee.user_id]);
                                updateField("selected_distance_meters", employee.route_distance_meters);
                              } else {
                                if (initialAssignedUserIds.has(employee.user_id)) return;
                                updateField("assigned_user_ids", current.filter((id) => id !== employee.user_id));
                              }
                            }}
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
                            <Typography variant="body2">{employee.status_label}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {employee.route_distance_label}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>
    </Grid>
  );

  // ===========================================================================
  // Description section (read-only)
  // ===========================================================================
  const description = notification.work_description?.trim() || "";

  return (
    <Stack spacing={2.5}>
      {/* Status & severity badges row */}
      <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
        <NotificationStatusBadge
          status={notification.status}
          statusLabel={notification.status_label}
        />
        <NotificationSeverityBadge severity={notification.severity} />
        {notification.violations_count > 0 && (
          <Chip
            label={`${notification.violations_count} ${t("violationsCount", { defaultValue: "violations" })}`}
            size="small"
            color="error"
            variant="outlined"
          />
        )}
      </Stack>

      {/* Section 1: Notification Info */}
      <EditableSection
        title={t("summaryNotification")}
        isRTL={isRTL}
        isSaving={savingSection === "notification"}
        onSave={() => saveSection("notification", {})}
        editChildren={notificationEditFields}
      >
        <Grid container rowSpacing={3} columnSpacing={2}>
          {notificationReadFields.map((field, index) => (
            <Grid key={`notification-field-${index}`} size={{ xs: 6, sm: 4, md: 3 }}>
              <FieldBlock caption={field.caption} value={field.value} />
            </Grid>
          ))}
        </Grid>
      </EditableSection>

      {/* Section 2: Contractor Info */}
      <EditableSection
        title={t("summaryContractor")}
        isRTL={isRTL}
        isSaving={savingSection === "contractor"}
        onSave={() => saveSection("contractor", {})}
        editChildren={contractorEditFields}
      >
        <Grid container rowSpacing={3} columnSpacing={2}>
          {contractorReadFields.map((field, index) => (
            <Grid key={`contractor-field-${index}`} size={{ xs: 6, sm: 4, md: 3 }}>
              <FieldBlock caption={field.caption} value={field.value} />
            </Grid>
          ))}
        </Grid>
      </EditableSection>

      {/* Section 3: Location */}
      <EditableSection
        title={t("summaryLocation")}
        isRTL={isRTL}
        isSaving={savingSection === "location"}
        onSave={() => saveSection("location", {})}
        editChildren={locationEditFields}
      >
        {locationReadFields}
      </EditableSection>

      {/* Section 4: Employee Assignment */}
      <EditableSection
        title={t("summaryAssignment")}
        isRTL={isRTL}
        isSaving={savingSection === "employee"}
        onSave={() => saveSection("employee", {})}
        editChildren={employeeEditFields}
      >
        {employeeReadFields}
      </EditableSection>

      {/* Description (read-only) */}
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          {t("description")}
        </Typography>
        <Typography
          variant="body2"
          color={description ? "text.primary" : "text.secondary"}
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {description || t("noDescription")}
        </Typography>
      </Paper>

      {/* Task Summary (read-only) */}
      {notification.employee_task && (
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
            {t("taskSummary")}
          </Typography>
          <Grid container rowSpacing={3} columnSpacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <FieldBlock
                caption={t("taskSerial")}
                value={notification.employee_task.serial_number ?? "—"}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <FieldBlock
                caption={t("taskTitle")}
                value={notification.employee_task.title ?? "—"}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <FieldBlock
                caption={t("taskStatus")}
                value={
                  notification.employee_task.status_label ??
                  notification.employee_task.status ??
                  "—"
                }
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <FieldBlock
                caption={t("taskUser")}
                value={notification.employee_task.user?.name ?? "—"}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Meta info */}
      <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap", gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {t("createdAt")}: {formatDateTime(notification.created_at)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t("createdBy")}: {notification.created_by?.name ?? "—"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t("updatedAt")}: {formatDateTime(notification.updated_at)}
        </Typography>
      </Stack>
    </Stack>
  );
}
