"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Circle, GoogleMap, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Refresh, TableChart } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useProjectNotificationMapTasks } from "@/modules/projects/project/query/useProjectNotificationMapTasks";
import type { ProjectNotificationMapTask } from "@/services/api/projects/notifications/types/response";

type ProjectNotificationMapTasksViewProps = {
  projectId?: string;
  contractualEngagementKey?: string;
  onBackToTable: () => void;
};

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 };
const DEFAULT_ZOOM = 14;

const TASK_CIRCLE_COLORS = [
  "#4F46E5",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

const MIN_VISIBLE_ZOOM = 14;
const MAX_VISIBLE_ZOOM = 17;

function buildTaskInfoContent(task: ProjectNotificationMapTask) {
  return (
    <Box sx={{ minWidth: 180, lineHeight: 1.6, py: 0.5 }}>
      <Typography variant="subtitle2" fontWeight={700}>
        {task.name}
      </Typography>
      {task.notificationNumber ? (
        <Typography variant="body2">{task.notificationNumber}</Typography>
      ) : null}
      {task.assignedUserName ? (
        <Typography variant="body2">{task.assignedUserName}</Typography>
      ) : null}
      {task.statusLabel ? (
        <Typography variant="body2">{task.statusLabel}</Typography>
      ) : null}
      <Typography variant="body2">{task.radius} m</Typography>
    </Box>
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

    if (currentZoom < MIN_VISIBLE_ZOOM) {
      map.setCenter(bounds.getCenter() ?? fallbackCenter);
      map.setZoom(MIN_VISIBLE_ZOOM);
      return;
    }

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
  const { data: tasks = [], isLoading, isError, refetch, isFetching } =
    useProjectNotificationMapTasks(
      { projectId, contractualEngagementKey },
      "pending",
    );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  const hoveredTask = useMemo(
    () => tasks.find((task) => task.id === hoveredTaskId) ?? null,
    [hoveredTaskId, tasks],
  );

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      setMapInstance(map);
    },
    [],
  );

  useEffect(() => {
    if (!mapInstance || !tasks.length || typeof google === "undefined") return;

    const bounds = new google.maps.LatLngBounds();
    tasks.forEach((task) => {
      extendBoundsForCircle(
        bounds,
        { lat: task.latitude, lng: task.longitude },
        task.radius,
      );
    });

    fitMapToTaskBounds(mapInstance, bounds, {
      lat: tasks[0].latitude,
      lng: tasks[0].longitude,
    });
  }, [mapInstance, tasks]);

  const handleMapUnmount = useCallback(() => {
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
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {t("mapTasksTitle")}
        </Typography>
        <Stack direction="row" spacing={1}>
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
      ) : tasks.length === 0 ? (
        <Alert severity="info">{t("mapNoTasks")}</Alert>
      ) : (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "520px", borderRadius: 12 }}
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
          {tasks.map((task, index) => {
            const color = TASK_CIRCLE_COLORS[index % TASK_CIRCLE_COLORS.length];
            const isHovered = hoveredTaskId === task.id;

            return (
              <Circle
                key={task.id}
                center={{ lat: task.latitude, lng: task.longitude }}
                radius={task.radius}
                options={{
                  fillColor: color,
                  fillOpacity: isHovered ? 0.4 : 0.24,
                  strokeColor: color,
                  strokeOpacity: 0.95,
                  strokeWeight: isHovered ? 3 : 2,
                  clickable: true,
                  zIndex: isHovered ? tasks.length + 1 : index + 1,
                }}
                onMouseOver={() => setHoveredTaskId(task.id)}
                onMouseOut={() =>
                  setHoveredTaskId((current) =>
                    current === task.id ? null : current,
                  )
                }
              />
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
              {buildTaskInfoContent(hoveredTask)}
            </InfoWindow>
          ) : null}
        </GoogleMap>
      )}
    </Box>
  );
}
