"use client";

import { useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LOADER_OPTIONS } from "@/config/google-maps";

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1635" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b8fa3" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1635" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a2548" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#3a3560" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#12101f" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#221e3d" }],
  },
];

function createWorkPinIcon() {
  return {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z",
    fillColor: "#2196F3",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 1.5,
    scale: 1.6,
    anchor: new google.maps.Point(12, 22),
  };
}

function createUserIcon(label: string) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="60" viewBox="0 0 52 60">
      <rect x="12" y="2" width="28" height="18" rx="9" fill="#ffffff"/>
      <text x="26" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="#1a1635" font-family="Arial,sans-serif">${label}</text>
      <circle cx="26" cy="40" r="14" fill="#FF9800" stroke="#ffffff" stroke-width="2"/>
      <circle cx="26" cy="35" r="4.5" fill="#ffffff"/>
      <path d="M16 50c0-4 4.2-6.5 10-6.5s10 2.5 10 6.5" fill="#ffffff"/>
    </svg>
  `);

  return {
    url: `data:image/svg+xml,${svg}`,
    scaledSize: new google.maps.Size(52, 60),
    anchor: new google.maps.Point(26, 40),
  };
}

interface AttendanceLocationMapProps {
  workLat: number;
  workLng: number;
  userLat: number;
  userLng: number;
  radius: number;
  userLabel?: string;
  className?: string;
}

export default function AttendanceLocationMap({
  workLat,
  workLng,
  userLat,
  userLng,
  radius,
  userLabel = "Me",
  className = "",
}: AttendanceLocationMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const workMarkerRef = useRef<google.maps.Marker | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const workPosition = { lat: workLat, lng: workLng };
    const userPosition = { lat: userLat, lng: userLng };

    if (!workMarkerRef.current) {
      workMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: workPosition,
        icon: createWorkPinIcon(),
        zIndex: 2,
      });
    } else {
      workMarkerRef.current.setPosition(workPosition);
    }

    const userIcon = createUserIcon(userLabel);

    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: userPosition,
        icon: userIcon,
        zIndex: 3,
      });
    } else {
      userMarkerRef.current.setPosition(userPosition);
      userMarkerRef.current.setIcon(userIcon);
    }

    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        map: mapRef.current,
        center: workPosition,
        radius,
        fillColor: "#ffffff",
        fillOpacity: 0.12,
        strokeColor: "#ffffff",
        strokeOpacity: 0.45,
        strokeWeight: 1.5,
      });
    } else {
      circleRef.current.setCenter(workPosition);
      circleRef.current.setRadius(radius);
    }

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        map: mapRef.current,
        path: [userPosition, workPosition],
        geodesic: true,
        strokeColor: "#2196F3",
        strokeOpacity: 0.85,
        strokeWeight: 2.5,
        zIndex: 1,
      });
    } else {
      polylineRef.current.setPath([userPosition, workPosition]);
    }

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(workPosition);
    bounds.extend(userPosition);
    mapRef.current.fitBounds(bounds, 64);
  }, [isLoaded, radius, userLabel, userLat, userLng, workLat, workLng]);

  useEffect(() => {
    return () => {
      workMarkerRef.current?.setMap(null);
      userMarkerRef.current?.setMap(null);
      circleRef.current?.setMap(null);
      polylineRef.current?.setMap(null);
      workMarkerRef.current = null;
      userMarkerRef.current = null;
      circleRef.current = null;
      polylineRef.current = null;
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className={`h-64 rounded-2xl bg-muted animate-pulse ${className}`} />
    );
  }

  return (
    <GoogleMap
      mapContainerClassName={`h-64 w-full rounded-2xl overflow-hidden border border-border/60 ${className}`}
      center={{ lat: workLat, lng: workLng }}
      zoom={14}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      options={{
        disableDefaultUI: true,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: MAP_STYLES,
        backgroundColor: "#1a1635",
      }}
    />
  );
}
