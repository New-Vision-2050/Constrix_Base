"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { ProjectNotificationEmployee } from "@/services/api/projects/notifications/types/response";
import type { MapPolygon } from "@/components/shared/MapPolygonDrawer";

interface ProjectNotificationMapProps {
  center: { lat: number; lng: number };
  radius: number;
  employees?: ProjectNotificationEmployee[];
  selectedUserId?: string | null;
  onSelectEmployee?: (userId: string) => void;
  onPinMoved?: (lat: number, lng: number) => void;
  height?: string;
  /** Draw allowed-zone polygons on the map. */
  polygons?: MapPolygon[];
  /** Allow dropping/moving the notification pin by clicking the map. */
  interactivePin?: boolean;
  /** Show employee markers. */
  showEmployees?: boolean;
  /** Draw a polyline from the selected employee to the notification pin. */
  showPolyline?: boolean;
}

const libraries: Libraries = ["places"];

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 };
const DEFAULT_ZOOM = 14;

const statusColors: Record<string, string> = {
  available: "#22c55e",
  busy: "#f97316",
  offline: "#6b7280",
  no_location: "#ef4444",
  available_far: "#eab308",
};

export default function ProjectNotificationMap({
  center,
  radius,
  employees = [],
  selectedUserId,
  onSelectEmployee,
  onPinMoved,
  height = "400px",
  polygons = [],
  interactivePin = false,
  showEmployees = true,
  showPolyline = false,
}: ProjectNotificationMapProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const notificationMarkerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const employeeMarkersRef = useRef<google.maps.Marker[]>([]);
  const polygonRefs = useRef<google.maps.Polygon[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const dragEndListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const activeCenter = center || DEFAULT_CENTER;

  const movePin = useCallback(
    (lat: number, lng: number) => {
      notificationMarkerRef.current?.setPosition({ lat, lng });
      circleRef.current?.setCenter({ lat, lng });
      onPinMoved?.(lat, lng);
    },
    [onPinMoved],
  );

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    if (!notificationMarkerRef.current) {
      notificationMarkerRef.current = new window.google.maps.Marker({
        map: mapInstance,
        position: activeCenter,
        title: t("repairPoint"),
        draggable: interactivePin,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
    } else {
      notificationMarkerRef.current.setPosition(activeCenter);
      notificationMarkerRef.current.setDraggable(interactivePin);
    }

    dragEndListenerRef.current?.remove();
    if (interactivePin) {
      dragEndListenerRef.current = notificationMarkerRef.current.addListener(
        "dragend",
        () => {
          const position = notificationMarkerRef.current?.getPosition();
          if (position) {
            movePin(position.lat(), position.lng());
          }
        },
      );
    }

    mapInstance.panTo(activeCenter);
  }, [isLoaded, mapInstance, activeCenter, t, interactivePin, movePin]);

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    clickListenerRef.current?.remove();
    clickListenerRef.current = null;

    if (interactivePin) {
      clickListenerRef.current = mapInstance.addListener(
        "click",
        (e: google.maps.MapMouseEvent) => {
          const latLng = e.latLng;
          if (!latLng) return;
          movePin(latLng.lat(), latLng.lng());
        },
      );
    }
  }, [isLoaded, mapInstance, interactivePin, movePin]);

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    if (!circleRef.current) {
      circleRef.current = new window.google.maps.Circle({
        map: mapInstance,
        center: activeCenter,
        radius,
        fillColor: "#4F46E5",
        fillOpacity: 0.1,
        strokeColor: "#4F46E5",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });
    } else {
      circleRef.current.setCenter(activeCenter);
      circleRef.current.setRadius(radius);
    }
  }, [isLoaded, mapInstance, activeCenter, radius]);

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    polygonRefs.current.forEach((polygon) => polygon.setMap(null));
    polygonRefs.current = [];

    if (!polygons.length) return;

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(activeCenter);

    polygons.forEach((polygon) => {
      if (!polygon.length) return;
      polygon.forEach((point) => bounds.extend(point));
      const p = new window.google.maps.Polygon({
        map: mapInstance,
        paths: polygon.map((point) => ({ lat: point.lat, lng: point.lng })),
        fillColor: "#22c55e",
        fillOpacity: 0.25,
        strokeColor: "#16a34a",
        strokeOpacity: 1,
        strokeWeight: 3,
        clickable: false,
      });
      polygonRefs.current.push(p);
    });

    // Defer fitBounds so any marker panTo runs first, then we zoom to show polygons.
    setTimeout(() => mapInstance.fitBounds(bounds), 0);
  }, [isLoaded, mapInstance, polygons]);

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    employeeMarkersRef.current.forEach((marker) => marker.setMap(null));
    employeeMarkersRef.current = [];

    if (!showEmployees) return;

    employees.forEach((employee) => {
      if (!employee.location?.latitude || !employee.location?.longitude) return;
      const position = {
        lat: employee.location.latitude,
        lng: employee.location.longitude,
      };
      const color = statusColors[employee.status] ?? "#6b7280";
      const isSelected = employee.user_id === selectedUserId;

      const marker = new window.google.maps.Marker({
        map: mapInstance,
        position,
        title: `${employee.name} — ${employee.status_label}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: isSelected ? "#000" : "#fff",
          strokeWeight: isSelected ? 3 : 2,
          scale: isSelected ? 14 : 10,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="direction:rtl;text-align:right;font-family:Arial,sans-serif">
          <strong>${employee.name}</strong><br/>
          ${employee.status_label}<br/>
          ${employee.distance_label}
        </div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstance, marker);
        onSelectEmployee?.(employee.user_id);
      });

      employeeMarkersRef.current.push(marker);
    });
  }, [isLoaded, mapInstance, employees, selectedUserId, onSelectEmployee, showEmployees]);

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    polylineRef.current?.setMap(null);
    polylineRef.current = null;

    if (!showPolyline || !selectedUserId) return;

    const selectedEmployee = employees.find((e) => e.user_id === selectedUserId);
    if (!selectedEmployee?.location?.latitude || !selectedEmployee?.location?.longitude) return;

    polylineRef.current = new window.google.maps.Polyline({
      map: mapInstance,
      path: [
        { lat: selectedEmployee.location.latitude, lng: selectedEmployee.location.longitude },
        activeCenter,
      ],
      geodesic: true,
      strokeColor: "#4F46E5",
      strokeOpacity: 0.8,
      strokeWeight: 3,
    });
  }, [isLoaded, mapInstance, showPolyline, selectedUserId, employees, activeCenter]);

  if (!isLoaded) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          bgcolor: "action.hover",
        }}
      >
        <Typography color="text.secondary">{t("loading")}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, borderRadius: 2, overflow: "hidden" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={activeCenter}
        zoom={DEFAULT_ZOOM}
        onLoad={(map) => {
          mapRef.current = map;
          setMapInstance(map);
        }}
        onUnmount={() => {
          clickListenerRef.current?.remove();
          clickListenerRef.current = null;
          dragEndListenerRef.current?.remove();
          dragEndListenerRef.current = null;
          notificationMarkerRef.current?.setMap(null);
          notificationMarkerRef.current = null;
          circleRef.current?.setMap(null);
          circleRef.current = null;
          polygonRefs.current.forEach((polygon) => polygon.setMap(null));
          polygonRefs.current = [];
          employeeMarkersRef.current.forEach((marker) => marker.setMap(null));
          employeeMarkersRef.current = [];
          polylineRef.current?.setMap(null);
          polylineRef.current = null;
          mapRef.current = null;
          setMapInstance(null);
        }}
        options={{
          zoomControl: true,
          fullscreenControl: true,
          mapTypeId: "roadmap",
          draggableCursor: interactivePin ? "crosshair" : undefined,
        }}
      />
    </Box>
  );
}
