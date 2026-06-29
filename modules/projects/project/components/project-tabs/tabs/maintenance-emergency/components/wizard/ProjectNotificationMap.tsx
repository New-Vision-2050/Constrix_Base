"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { MyLocation, Search } from "@mui/icons-material";
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
  /** Show the notification pin marker. */
  showPin?: boolean;
  /** Show map search and current-location controls. */
  showControls?: boolean;
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
  showPin = true,
  showControls = false,
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
  const employeeInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const polygonRefs = useRef<google.maps.Polygon[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const dragEndListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const searchTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOptions, setSearchOptions] = useState<
    { label: string; lat: number; lng: number }[]
  >([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [locating, setLocating] = useState(false);

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
    if (!isLoaded || !window.google?.maps?.places) return;
    autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    searchTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [isLoaded]);

  const handleSearch = useCallback(
    (_event: React.SyntheticEvent, value: string) => {
      setSearchQuery(value);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (!value || value.length < 2 || !autocompleteServiceRef.current) {
        setSearchOptions([]);
        setSearchLoading(false);
        return;
      }
      setSearchLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        autocompleteServiceRef.current!.getPlacePredictions(
          {
            input: value,
            sessionToken: searchTokenRef.current || undefined,
          },
          (predictions, status) => {
            if (
              status !== window.google.maps.places.PlacesServiceStatus.OK ||
              !predictions
            ) {
              setSearchOptions([]);
              setSearchLoading(false);
              return;
            }
            if (!placesServiceRef.current) {
              placesServiceRef.current = new window.google.maps.places.PlacesService(
                document.createElement("div"),
              );
            }
            Promise.all(
              predictions.slice(0, 5).map(
                (prediction) =>
                  new Promise<{ label: string; lat: number; lng: number } | null>(
                    (resolve) => {
                      placesServiceRef.current!.getDetails(
                        {
                          placeId: prediction.place_id,
                          fields: ["geometry"],
                          sessionToken: searchTokenRef.current || undefined,
                        },
                        (place, detailStatus) => {
                          if (
                            detailStatus ===
                              window.google.maps.places.PlacesServiceStatus.OK &&
                            place?.geometry?.location
                          ) {
                            resolve({
                              label: prediction.description,
                              lat: place.geometry.location.lat(),
                              lng: place.geometry.location.lng(),
                            });
                          } else {
                            resolve(null);
                          }
                        },
                      );
                    },
                  ),
              ),
            ).then((results) => {
              setSearchOptions(results.filter(Boolean) as { label: string; lat: number; lng: number }[]);
              setSearchLoading(false);
            });
          },
        );
      }, 350);
    },
    [],
  );

  const handleSelect = useCallback(
    (_event: React.SyntheticEvent, option: { label: string; lat: number; lng: number } | null) => {
      if (!option) return;
      movePin(option.lat, option.lng);
      mapInstance?.panTo({ lat: option.lat, lng: option.lng });
      setSearchQuery("");
      setSearchOptions([]);
      searchTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    },
    [mapInstance, movePin],
  );

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert(t("geolocationNotSupported", { defaultValue: "Geolocation is not supported by your browser" }));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        movePin(latitude, longitude);
        mapInstance?.panTo({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert(t("geolocationDenied", { defaultValue: "Could not get your location" }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [mapInstance, movePin, t]);

  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    if (!showPin) {
      notificationMarkerRef.current?.setMap(null);
      notificationMarkerRef.current = null;
      dragEndListenerRef.current?.remove();
      dragEndListenerRef.current = null;
      return;
    }

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
  }, [isLoaded, mapInstance, activeCenter, t, interactivePin, movePin, showPin]);

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

    if (!showPin) {
      circleRef.current?.setMap(null);
      circleRef.current = null;
      return;
    }

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
  }, [isLoaded, mapInstance, activeCenter, radius, showPin]);

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
    employeeInfoWindowRef.current?.close();

    if (!showEmployees) return;

    if (!employeeInfoWindowRef.current) {
      employeeInfoWindowRef.current = new window.google.maps.InfoWindow({
        maxWidth: 280,
      });
    }

    employees.forEach((employee) => {
      const lat = Number(employee.location?.latitude);
      const lng = Number(employee.location?.longitude);
      if (!lat || !lng) return;
      const position = { lat, lng };
      const color = statusColors[employee.status] ?? "#6b7280";
      const isSelected = employee.user_id === selectedUserId;

      const marker = new window.google.maps.Marker({
        map: mapInstance,
        position,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: isSelected ? "#000" : "#fff",
          strokeWeight: isSelected ? 3 : 2,
          scale: isSelected ? 14 : 10,
        },
      });

      const infoLines = [
        employee.name || "غير معروف",
        employee.status_label || employee.status || "لا توجد حالة",
        employee.distance_label || "لا يوجد مسافة",
        employee.branch || null,
        employee.last_update ? `آخر تحديث: ${employee.last_update}` : null,
      ].filter((line): line is string => Boolean(line));

      const content = `<div style="direction:rtl;text-align:right;font-family:Arial,sans-serif;padding:8px;color:#000;background:#fff;min-width:120px;border-radius:4px">
        ${infoLines.length > 0 ? infoLines.join("<br/>") : "لا توجد بيانات"}
      </div>`;

      marker.addListener("mouseover", () => {
        employeeInfoWindowRef.current?.setContent(content);
        employeeInfoWindowRef.current?.open(mapInstance, marker);
      });

      marker.addListener("mouseout", () => {
        employeeInfoWindowRef.current?.close();
      });

      marker.addListener("click", () => {
        employeeInfoWindowRef.current?.setContent(content);
        employeeInfoWindowRef.current?.open(mapInstance, marker);
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
    const selLat = Number(selectedEmployee?.location?.latitude);
    const selLng = Number(selectedEmployee?.location?.longitude);
    if (!selLat || !selLng) return;

    polylineRef.current = new window.google.maps.Polyline({
      map: mapInstance,
      path: [
        { lat: selLat, lng: selLng },
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
    <Box sx={{ height, borderRadius: 2, overflow: "hidden", position: "relative" }}>
      {showControls && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            zIndex: 10,
            bgcolor: "background.paper",
            borderRadius: 1,
            p: 0.5,
            boxShadow: 1,
          }}
        >
          <Autocomplete
            size="small"
            sx={{ flex: 1 }}
            value={null}
            blurOnSelect
            options={searchOptions}
            getOptionLabel={(o) => (typeof o === "string" ? o : o.label)}
            inputValue={searchQuery}
            onInputChange={handleSearch}
            onChange={handleSelect}
            loading={searchLoading}
            noOptionsText={t("searchNoResults", { defaultValue: "No results" })}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("searchMap", { defaultValue: "Search map" })}
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {searchLoading ? (
                        <CircularProgress size={16} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <IconButton
            size="small"
            onClick={handleGetCurrentLocation}
            title={t("myLocation", { defaultValue: "My location" })}
            disabled={locating}
            sx={{ bgcolor: "background.paper" }}
          >
            {locating ? <CircularProgress size={18} /> : <MyLocation />}
          </IconButton>
        </Stack>
      )}
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
          employeeInfoWindowRef.current?.close();
          employeeInfoWindowRef.current = null;
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
