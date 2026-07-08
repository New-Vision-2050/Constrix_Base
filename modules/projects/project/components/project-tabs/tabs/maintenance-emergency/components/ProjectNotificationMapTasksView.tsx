"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Circle,
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Refresh, TableChart } from "@mui/icons-material";
import { useLocale, useTranslations } from "next-intl";
import { useProjectNotificationMapTasks } from "@/modules/projects/project/query/useProjectNotificationMapTasks";
import type {
  ProjectNotificationMapTask,
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
  approved: "#10B981",
  rejected: "#EF4444",
  in_progress: "#0EA5E9",
  completed: "#4F46E5",
  cancelled: "#9CA3AF",
};

const TASK_CIRCLE_COLORS = [
  "#4F46E5",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

function buildTaskMarkerIcon(color: string): google.maps.Icon {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="${color}" stroke="white" stroke-width="1.5"/></svg>`,
  );
  return {
    url: `data:image/svg+xml,${svg}`,
    scaledSize: new google.maps.Size(10, 10),
    anchor: new google.maps.Point(5, 5),
  };
}

const MAX_VISIBLE_ZOOM = 17;

const libraries: Libraries = ["places", "geometry"];

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function buildTaskInfoContent(
  task: ProjectNotificationMapTask,
  t: (key: string) => string,
  statusLabelMap: Map<string, string>,
) {
  const displayStatusLabel =
    task.statusLabel || statusLabelMap.get(task.status) || null;

  return (
    <div
      style={{
        minWidth: 220,
        lineHeight: 1.6,
        padding: "4px 0",
        color: "#1a1a1a",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
        {task.name}
      </div>
      {task.notificationNumber ? (
        <div style={{ fontSize: 14, color: "#555" }}>
          {t("notificationNumber")}: {task.notificationNumber}
        </div>
      ) : null}
      <div style={{ fontSize: 14 }}>
        <span style={{ color: "#555" }}>{t("status")}: </span>
        <span style={{ fontWeight: 600 }}>
          {displayStatusLabel || task.status || "—"}
        </span>
      </div>
      <div style={{ fontSize: 14 }}>
        <span style={{ color: "#555" }}>{t("assignedUser")}: </span>
        {task.assignedUserName || "—"}
      </div>
      {task.receiveDate ? (
        <div style={{ fontSize: 14 }}>
          <span style={{ color: "#555" }}>{t("receiveDate")}: </span>
          {formatDateTime(task.receiveDate)}
        </div>
      ) : null}
      <div style={{ fontSize: 14, color: "#555" }}>
        {t("radius")}: {task.radius} {t("meters")}
      </div>
    </div>
  );
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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

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

  const visibleTasks = useMemo(() => {
    if (!selectedStatus) return tasks;
    return tasks.filter((task) => task.status === selectedStatus);
  }, [tasks, selectedStatus]);

  const hoveredTask = useMemo(
    () => visibleTasks.find((task) => task.id === hoveredTaskId) ?? null,
    [hoveredTaskId, visibleTasks],
  );

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

  const handleMapUnmount = useCallback(() => {
    mapRef.current = null;
    fittedTasksRef.current = null;
    setMapInstance(null);
    setHoveredTaskId(null);
  }, []);

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
          {statuses.length > 0 && (
            <TextField
              select
              size="small"
              label={t("selectStatus")}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status.key} value={status.key}>
                  {getStatusLabel(status)}
                </MenuItem>
              ))}
            </TextField>
          )}
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
      ) : visibleTasks.length === 0 ? (
        <Alert severity="info">
          {tasks.length === 0 ? t("mapNoTasks") : t("mapNoTasksForFilter")}
        </Alert>
      ) : (
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "520px",
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
          }}
        >
          {visibleTasks.map((task, index) => {
            const color = STATUS_COLOR_MAP[task.status] || TASK_CIRCLE_COLORS[index % TASK_CIRCLE_COLORS.length];
            const isHovered = hoveredTaskId === task.id;
            const center = { lat: task.latitude, lng: task.longitude };

            return (
              <Fragment key={task.id}>
                <Marker
                  position={center}
                  icon={buildTaskMarkerIcon(color)}
                  zIndex={index}
                  onMouseOver={() => setHoveredTaskId(task.id)}
                  onMouseOut={() =>
                    setHoveredTaskId((current) =>
                      current === task.id ? null : current,
                    )
                  }
                />
                <Circle
                  center={center}
                  radius={task.radius}
                  options={{
                    fillColor: color,
                    fillOpacity: isHovered ? 0.4 : 0.28,
                    strokeColor: color,
                    strokeOpacity: 1,
                    strokeWeight: isHovered ? 4 : 3,
                    clickable: true,
                    zIndex: isHovered
                      ? visibleTasks.length * 2 + 1
                      : index + visibleTasks.length + 1,
                  }}
                  onMouseOver={() => setHoveredTaskId(task.id)}
                  onMouseOut={() =>
                    setHoveredTaskId((current) =>
                      current === task.id ? null : current,
                    )
                  }
                />
              </Fragment>
            );
          })}

          {hoveredTask ? (
            <InfoWindow
              position={{
                lat: hoveredTask.latitude,
                lng: hoveredTask.longitude,
              }}
              options={{ disableAutoPan: true }}
              onCloseClick={() => setHoveredTaskId(null)}
            >
              {buildTaskInfoContent(hoveredTask, t, statusLabelMap)}
            </InfoWindow>
          ) : null}
        </GoogleMap>
      )}
    </Box>
  );
}
