"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { ProjectNotificationEmployee } from "@/services/api/projects/notifications/types/response";

interface ProjectNotificationMapProps {
  center: { lat: number; lng: number };
  radius: number;
  employees: ProjectNotificationEmployee[];
  selectedUserId?: string | null;
  onSelectEmployee?: (userId: string) => void;
  height?: string;
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
  employees,
  selectedUserId,
  onSelectEmployee,
  height = "400px",
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

  const activeCenter = center || DEFAULT_CENTER;

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    if (!notificationMarkerRef.current) {
      notificationMarkerRef.current = new window.google.maps.Marker({
        map: mapInstance,
        position: activeCenter,
        title: t("repairPoint"),
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
    } else {
      notificationMarkerRef.current.setPosition(activeCenter);
    }

    mapInstance.panTo(activeCenter);
  }, [isLoaded, mapInstance, activeCenter, t]);

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

    employeeMarkersRef.current.forEach((marker) => marker.setMap(null));
    employeeMarkersRef.current = [];

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
  }, [isLoaded, mapInstance, employees, selectedUserId, onSelectEmployee]);

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
          notificationMarkerRef.current?.setMap(null);
          notificationMarkerRef.current = null;
          circleRef.current?.setMap(null);
          circleRef.current = null;
          employeeMarkersRef.current.forEach((marker) => marker.setMap(null));
          employeeMarkersRef.current = [];
          mapRef.current = null;
          setMapInstance(null);
        }}
        options={{
          zoomControl: true,
          fullscreenControl: true,
          mapTypeId: "roadmap",
        }}
      />
    </Box>
  );
}
