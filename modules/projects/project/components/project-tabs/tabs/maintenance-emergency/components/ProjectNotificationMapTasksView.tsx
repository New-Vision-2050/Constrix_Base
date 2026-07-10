"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, ExpandLess, ExpandMore, People, Place, Refresh, TableChart, VisibilityOff } from "@mui/icons-material";
import { useLocale, useTranslations } from "next-intl";
import { GOOGLE_MAPS_LOADER_OPTIONS } from "@/config/google-maps";
import { useProjectNotificationMapTasks } from "@/modules/projects/project/query/useProjectNotificationMapTasks";
import { useProjectNotificationEmployees } from "@/modules/projects/project/query/useProjectNotificationEmployees";
import type {
  ProjectNotificationEmployee,
  ProjectNotificationMapTaskStatusOption,
} from "@/services/api/projects/notifications/types/response";

type ProjectNotificationMapTasksViewProps = {
  projectId?: string;
  contractualEngagementKey?: string;
  onBackToTable: () => void;
};

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 };
const DEFAULT_ZOOM = 14;

const STATUS_COLOR_MAP: Record<string, string> = {
  pending: "#F59E0B",
  received: "#0EA5E9",
  confirmed_location: "#10B981",
  completed: "#4F46E5",
};

const EMPLOYEE_STATUS_COLOR_MAP: Record<string, string> = {
  available: "#22c55e",
  busy: "#f97316",
  offline: "#6b7280",
  no_location: "#ef4444",
  available_far: "#eab308",
};

const TASK_CIRCLE_COLORS = [
  "#4F46E5",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

function buildTaskMarkerElement(color: string): HTMLElement {
  const el = document.createElement("div");
  el.style.width = "12px";
  el.style.height = "12px";
  el.style.borderRadius = "50%";
  el.style.backgroundColor = color;
  el.style.border = "2px solid white";
  el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";
  return el;
}

function buildEmployeeMarkerElement(color: string): HTMLElement {
  const el = document.createElement("div");
  el.style.width = "18px";
  el.style.height = "18px";
  el.style.borderRadius = "50%";
  el.style.backgroundColor = color;
  el.style.border = "2px solid white";
  el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.35)";
  return el;
}

const MAX_VISIBLE_ZOOM = 17;

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function extendBoundsForCircle(
  bounds: google.maps.LatLngBounds,
  center: google.maps.LatLngLiteral,
  radiusMeters: number,
) {
  if (typeof google === "undefined") {
    bounds.extend(center);
    return;
  }

  const circle = new google.maps.Circle({
    center,
    radius: radiusMeters,
  });
  const circleBounds = circle.getBounds();
  if (circleBounds) {
    bounds.union(circleBounds);
  } else {
    bounds.extend(center);
  }
}

function fitMapToTaskBounds(
  map: google.maps.Map,
  bounds: google.maps.LatLngBounds,
  fallbackCenter: google.maps.LatLngLiteral,
) {
  if (bounds.isEmpty()) {
    map.setCenter(fallbackCenter);
    map.setZoom(DEFAULT_ZOOM);
    return;
  }

  map.fitBounds(bounds, 72);

  google.maps.event.addListenerOnce(map, "idle", () => {
    const currentZoom = map.getZoom();
    if (currentZoom == null) return;

    if (currentZoom > MAX_VISIBLE_ZOOM) {
      map.setZoom(MAX_VISIBLE_ZOOM);
    }
  });
}

export default function ProjectNotificationMapTasksView({
  projectId,
  contractualEngagementKey,
  onBackToTable,
}: ProjectNotificationMapTasksViewProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const locale = useLocale();
  const { data, isLoading, isError, refetch, isFetching } =
    useProjectNotificationMapTasks({ projectId, contractualEngagementKey });

  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

  const tasks = data?.items ?? [];
  const statuses = data?.statuses ?? [];

  const statusLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    statuses.forEach((status) => {
      map.set(status.key, locale === "ar" ? status.label_ar : status.label_en);
    });
    return map;
  }, [statuses, locale]);

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const fittedTasksRef = useRef<string | null>(null);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const employeeMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const employeeInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const taskMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const taskCirclesRef = useRef<google.maps.Circle[]>([]);
  const taskInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [showTasks, setShowTasks] = useState(true);
  const [showEmployees, setShowEmployees] = useState(true);
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState<string>("");
  const [omittedTaskIds, setOmittedTaskIds] = useState<string[]>([]);
  const [omittedEmployeeIds, setOmittedEmployeeIds] = useState<string[]>([]);
  const [panelCollapsed, setPanelCollapsed] = useState(true);

  const visibleTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedStatus) {
      filtered = filtered.filter((task) => task.status === selectedStatus);
    }
    return filtered.filter((task) => !omittedTaskIds.includes(task.id));
  }, [tasks, selectedStatus, omittedTaskIds]);

  const employeeCenter = useMemo(() => {
    if (visibleTasks.length === 0) return DEFAULT_CENTER;
    let lat = 0;
    let lng = 0;
    visibleTasks.forEach((task) => {
      lat += task.latitude;
      lng += task.longitude;
    });
    return { lat: lat / visibleTasks.length, lng: lng / visibleTasks.length };
  }, [visibleTasks]);

  const employeeQuery = useProjectNotificationEmployees({
    projectId,
    contractualEngagementKey,
    latitude: employeeCenter.lat,
    longitude: employeeCenter.lng,
    enabled: showEmployees && (!!projectId || !!contractualEngagementKey),
  });

  const employees = useMemo(() => employeeQuery.data ?? [], [employeeQuery.data]);

  const employeeStatusOptions = useMemo(
    () => [
      { value: "", label: t("allStatuses", { defaultValue: "All statuses" }) },
      { value: "available", label: t("available", { defaultValue: "Available" }) },
      { value: "busy", label: t("busy", { defaultValue: "Busy" }) },
      { value: "no_location", label: t("noLocation", { defaultValue: "No Location" }) },
      { value: "offline", label: t("offline", { defaultValue: "Offline" }) },
    ],
    [t],
  );

  const visibleEmployees = useMemo(() => {
    let filtered = employees.filter((e) => !omittedEmployeeIds.includes(e.user_id));
    if (employeeStatusFilter) {
      filtered = filtered.filter((e) => e.status === employeeStatusFilter);
    }
    return filtered;
  }, [employees, omittedEmployeeIds, employeeStatusFilter]);

  const getStatusLabel = useCallback(
    (option: ProjectNotificationMapTaskStatusOption) => {
      return locale === "ar" ? option.label_ar : option.label_en;
    },
    [locale],
  );

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    fittedTasksRef.current = null;
    setMapInstance(map);
  }, []);

  useEffect(() => {
    if (!mapInstance || !visibleTasks.length || typeof google === "undefined")
      return;

    const visibleKey = visibleTasks.map((task) => task.id).join(",");
    if (fittedTasksRef.current === visibleKey) return;

    const bounds = new google.maps.LatLngBounds();
    visibleTasks.forEach((task) => {
      extendBoundsForCircle(
        bounds,
        { lat: task.latitude, lng: task.longitude },
        task.radius,
      );
    });

    const map = mapRef.current ?? mapInstance;
    fittedTasksRef.current = visibleKey;

    // Defer fitting so the GoogleMap instance is fully mounted and ready.
    const handle = window.setTimeout(() => {
      fitMapToTaskBounds(map, bounds, {
        lat: visibleTasks[0].latitude,
        lng: visibleTasks[0].longitude,
      });
    }, 0);

    return () => window.clearTimeout(handle);
  }, [mapInstance, visibleTasks]);

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    taskMarkersRef.current.forEach((marker) => {
      marker.map = null;
    });
    taskMarkersRef.current = [];
    taskCirclesRef.current.forEach((circle) => circle.setMap(null));
    taskCirclesRef.current = [];
    taskInfoWindowRef.current?.close();

    if (!showTasks || visibleTasks.length === 0) return;

    if (!taskInfoWindowRef.current) {
      taskInfoWindowRef.current = new window.google.maps.InfoWindow({
        maxWidth: 260,
      });
    }

    visibleTasks.forEach((task, index) => {
      const color = STATUS_COLOR_MAP[task.status] || TASK_CIRCLE_COLORS[index % TASK_CIRCLE_COLORS.length];
      const center = { lat: task.latitude, lng: task.longitude };

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: center,
        content: buildTaskMarkerElement(color),
      });

      const circle = new window.google.maps.Circle({
        map: mapInstance,
        center,
        radius: task.radius,
        fillColor: color,
        fillOpacity: 0.28,
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 3,
        clickable: true,
        zIndex: index + visibleTasks.length + 1,
      });

      const openInfo = () => {
        const displayStatusLabel = task.statusLabel || statusLabelMap.get(task.status) || null;
        const lines = [
          `<div style="font-size:14px;font-weight:700;margin-bottom:4px">${task.name}</div>`,
          task.notificationNumber
            ? `<div style="font-size:14px;color:#555">${t("notificationNumber")}: ${task.notificationNumber}</div>`
            : "",
          `<div style="font-size:14px"><span style="color:#555">${t("status")}: </span><span style="font-weight:600">${displayStatusLabel || task.status || "—"}</span></div>`,
          task.assignedUserName
            ? `<div style="font-size:14px"><span style="color:#555">${t("assignedUser")}: </span>${task.assignedUserName}</div>`
            : "",
          task.receiveDate
            ? `<div style="font-size:14px"><span style="color:#555">${t("receiveDate")}: </span>${formatDateTime(task.receiveDate)}</div>`
            : "",
          `<div style="font-size:14px;color:#555">${t("radius")}: ${task.radius} ${t("meters")}</div>`,
        ].filter(Boolean);

        taskInfoWindowRef.current?.setContent(
          `<div style="min-width:220px;line-height:1.6;padding:4px 0;color:#1a1a1a">${lines.join("")}</div>`,
        );
        taskInfoWindowRef.current?.open(mapInstance, marker);
      };

      marker.addListener("mouseover", () => {
        setHoveredTaskId(task.id);
        circle.setOptions({ fillOpacity: 0.4, strokeWeight: 4, zIndex: visibleTasks.length * 2 + 1 });
      });
      marker.addListener("mouseout", () => {
        setHoveredTaskId(null);
        circle.setOptions({ fillOpacity: 0.28, strokeWeight: 3, zIndex: index + visibleTasks.length + 1 });
      });
      marker.addListener("gmp-click", openInfo);

      circle.addListener("mouseover", () => {
        setHoveredTaskId(task.id);
        circle.setOptions({ fillOpacity: 0.4, strokeWeight: 4, zIndex: visibleTasks.length * 2 + 1 });
      });
      circle.addListener("mouseout", () => {
        setHoveredTaskId(null);
        circle.setOptions({ fillOpacity: 0.28, strokeWeight: 3, zIndex: index + visibleTasks.length + 1 });
      });
      circle.addListener("click", openInfo);

      taskMarkersRef.current.push(marker);
      taskCirclesRef.current.push(circle);
    });
  }, [isLoaded, mapInstance, showTasks, visibleTasks, statusLabelMap, t]);

  const handleMapUnmount = useCallback(() => {
    mapRef.current = null;
    fittedTasksRef.current = null;
    setMapInstance(null);
    setHoveredTaskId(null);
    employeeMarkersRef.current.forEach((marker) => {
      marker.map = null;
    });
    employeeMarkersRef.current = [];
    employeeInfoWindowRef.current?.close();
    employeeInfoWindowRef.current = null;
    taskMarkersRef.current.forEach((marker) => {
      marker.map = null;
    });
    taskMarkersRef.current = [];
    taskCirclesRef.current.forEach((circle) => circle.setMap(null));
    taskCirclesRef.current = [];
    taskInfoWindowRef.current?.close();
    taskInfoWindowRef.current = null;
  }, []);

  const buildEmployeeInfoContent = useCallback(
    (employee: ProjectNotificationEmployee) => {
      const lines = [
        employee.name,
        employee.status_label || employee.status,
        employee.distance_label,
        employee.branch || null,
        employee.last_update ? `${t("lastUpdate", { defaultValue: "Last update" })}: ${employee.last_update}` : null,
      ].filter(Boolean);
      return `<div style="direction:rtl;text-align:right;font-family:Arial,sans-serif;padding:8px;color:#000;background:#fff;min-width:140px;border-radius:4px;line-height:1.5">
        ${lines.length > 0 ? lines.join("<br/>") : t("noData", { defaultValue: "No data" })}
      </div>`;
    },
    [t],
  );

  useEffect(() => {
    if (!showTasks) setHoveredTaskId(null);
  }, [showTasks]);

  const handleToggleShowTasks = useCallback(
    (checked: boolean) => {
      setShowTasks(checked);
      if (checked) setOmittedTaskIds([]);
    },
    [setShowTasks, setOmittedTaskIds],
  );

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    employeeMarkersRef.current.forEach((marker) => {
      marker.map = null;
    });
    employeeMarkersRef.current = [];
    employeeInfoWindowRef.current?.close();

    if (!showEmployees || visibleEmployees.length === 0) return;

    if (!employeeInfoWindowRef.current) {
      employeeInfoWindowRef.current = new window.google.maps.InfoWindow({ maxWidth: 280 });
    }

    visibleEmployees.forEach((employee) => {
      const lat = Number(employee.location?.latitude);
      const lng = Number(employee.location?.longitude);
      if (!lat || !lng) return;

      const color = EMPLOYEE_STATUS_COLOR_MAP[employee.status] ?? "#6b7280";
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: { lat, lng },
        content: buildEmployeeMarkerElement(color),
      });

      const content = buildEmployeeInfoContent(employee);
      marker.addListener("mouseover", () => {
        employeeInfoWindowRef.current?.setContent(content);
        employeeInfoWindowRef.current?.open(mapInstance, marker);
      });
      marker.addListener("mouseout", () => {
        employeeInfoWindowRef.current?.close();
      });

      employeeMarkersRef.current.push(marker);
    });
  }, [isLoaded, mapInstance, showEmployees, visibleEmployees, buildEmployeeInfoContent]);

  const hasVisibleContent = visibleTasks.length > 0 || (showEmployees && visibleEmployees.length > 0);

  const hiddenTaskItems = useMemo(
    () => tasks.filter((task) => omittedTaskIds.includes(task.id)),
    [tasks, omittedTaskIds],
  );

  const hiddenEmployeeItems = useMemo(
    () => employees.filter((e) => omittedEmployeeIds.includes(e.user_id)),
    [employees, omittedEmployeeIds],
  );

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {t("mapTasksTitle")}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {t("refreshMap")}
          </Button>
          <Button
            variant="contained"
            startIcon={<TableChart />}
            onClick={onBackToTable}
          >
            {t("backToTable")}
          </Button>
        </Stack>
      </Stack>

      {!isLoaded || isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 420,
            borderRadius: 2,
            bgcolor: "action.hover",
          }}
        >
          <CircularProgress size={32} />
        </Box>
      ) : isError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              {t("refreshMap")}
            </Button>
          }
        >
          {t("mapLoadError")}
        </Alert>
      ) : !hasVisibleContent ? (
        <Alert severity="info">
          {tasks.length === 0 && employees.length === 0
            ? t("mapNoTasks")
            : t("mapNoTasksForFilter")}
        </Alert>
      ) : (
        <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden" }}>
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "560px",
              borderRadius: 12,
            }}
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
            options={{
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
              mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID",
            }}
          >
          </GoogleMap>

          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              bottom: { xs: 16, sm: 80 },
              left: 16,
              width: { xs: "calc(100% - 32px)", sm: 320 },
              maxHeight: { xs: 220, sm: "min(420px, calc(100% - 96px))" },
              overflow: "auto",
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(18,18,27,0.82)"
                  : "rgba(255,255,255,0.88)",
              backdropFilter: "blur(12px)",
              p: 1.5,
              zIndex: 10,
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle2" fontWeight={700}>
                  {t("filter", { defaultValue: "Filter" })}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setPanelCollapsed((v) => !v)}
                  sx={{ p: 0.5 }}
                >
                  {panelCollapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
                </IconButton>
              </Stack>

              {!panelCollapsed && (
                <>
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showTasks}
                          onChange={(e) => handleToggleShowTasks(e.target.checked)}
                          size="small"
                        />
                      }
                      label={
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Place fontSize="small" color="primary" />
                          <Typography variant="body2">{t("title")}</Typography>
                        </Stack>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showEmployees}
                          onChange={(e) => setShowEmployees(e.target.checked)}
                          size="small"
                        />
                      }
                      label={
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <People fontSize="small" color="success" />
                          <Typography variant="body2">{t("employees", { defaultValue: "Employees" })}</Typography>
                        </Stack>
                      }
                    />
                  </Stack>

              {showTasks && statuses.length > 0 && (
                <TextField
                  select
                  size="small"
                  label={t("selectStatus")}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status.key} value={status.key}>
                      {getStatusLabel(status)}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {showEmployees && (
                <TextField
                  select
                  size="small"
                  label={t("filterByStatus", { defaultValue: "Filter by status" })}
                  value={employeeStatusFilter}
                  onChange={(e) => setEmployeeStatusFilter(e.target.value)}
                  fullWidth
                >
                  {employeeStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  p: 1.5,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {t("legend", { defaultValue: "Legend" })}:
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  {showTasks &&
                    statuses.map((status) => (
                      <Stack key={status.key} direction="row" spacing={0.5} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: STATUS_COLOR_MAP[status.key] || "#9CA3AF",
                            border: "1px solid rgba(0,0,0,0.1)",
                          }}
                        />
                        <Typography variant="caption" sx={{ fontSize: 11 }}>
                          {getStatusLabel(status)}
                        </Typography>
                      </Stack>
                    ))}
                  {showEmployees &&
                    employeeStatusOptions.slice(1).map((option) => (
                      <Stack key={option.value} direction="row" spacing={0.5} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: EMPLOYEE_STATUS_COLOR_MAP[option.value] || "#9CA3AF",
                            border: "1px solid rgba(0,0,0,0.1)",
                          }}
                        />
                        <Typography variant="caption" sx={{ fontSize: 11 }}>
                          {option.label}
                        </Typography>
                      </Stack>
                    ))}
                </Stack>
              </Box>

              {(hiddenTaskItems.length > 0 || hiddenEmployeeItems.length > 0) && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: "block" }}>
                    {t("hiddenFromMap", { defaultValue: "Hidden from map" })}:
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {hiddenTaskItems.map((task) => (
                      <Chip
                        key={task.id}
                        size="small"
                        icon={<VisibilityOff fontSize="small" />}
                        label={task.name}
                        onDelete={() =>
                          setOmittedTaskIds((prev) => prev.filter((id) => id !== task.id))
                        }
                        deleteIcon={<Close fontSize="small" />}
                        sx={{ maxWidth: 140 }}
                      />
                    ))}
                    {hiddenEmployeeItems.map((employee) => (
                      <Chip
                        key={employee.user_id}
                        size="small"
                        icon={<Avatar sx={{ width: 16, height: 16, fontSize: 10, bgcolor: EMPLOYEE_STATUS_COLOR_MAP[employee.status] || "#9CA3AF" }}>{employee.name.charAt(0)}</Avatar>}
                        label={employee.name}
                        onDelete={() =>
                          setOmittedEmployeeIds((prev) =>
                            prev.filter((id) => id !== employee.user_id),
                          )
                        }
                        deleteIcon={<Close fontSize="small" />}
                        sx={{ maxWidth: 160 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {(omittedTaskIds.length > 0 || omittedEmployeeIds.length > 0) && (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => {
                    setOmittedTaskIds([]);
                    setOmittedEmployeeIds([]);
                  }}
                >
                  {t("clearFilters", { defaultValue: "Clear filters" })}
                </Button>
              )}
                </>
              )}
            </Stack>
          </Paper>

        </Box>
      )}
    </Box>
  );
}
