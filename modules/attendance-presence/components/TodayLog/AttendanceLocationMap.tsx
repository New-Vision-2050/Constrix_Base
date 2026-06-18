"use client";

import { useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

interface AttendanceLocationMapProps {
  workLat: number;
  workLng: number;
  userLat: number;
  userLng: number;
  radius: number;
  className?: string;
}

export default function AttendanceLocationMap({
  workLat,
  workLng,
  userLat,
  userLng,
  radius,
  className = "",
}: AttendanceLocationMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const workMarkerRef = useRef<google.maps.Marker | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const workPosition = { lat: workLat, lng: workLng };
    const userPosition = { lat: userLat, lng: userLng };

    if (!workMarkerRef.current) {
      workMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: workPosition,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#2196F3",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
    } else {
      workMarkerRef.current.setPosition(workPosition);
    }

    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: userPosition,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#FF9800",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
    } else {
      userMarkerRef.current.setPosition(userPosition);
    }

    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        map: mapRef.current,
        center: workPosition,
        radius,
        fillColor: "#2196F3",
        fillOpacity: 0.15,
        strokeColor: "#2196F3",
        strokeOpacity: 0.6,
        strokeWeight: 1,
      });
    } else {
      circleRef.current.setCenter(workPosition);
      circleRef.current.setRadius(radius);
    }

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(workPosition);
    bounds.extend(userPosition);
    mapRef.current.fitBounds(bounds, 48);
  }, [isLoaded, radius, userLat, userLng, workLat, workLng]);

  if (!isLoaded) {
    return (
      <div
        className={`h-52 rounded-xl bg-muted animate-pulse ${className}`}
      />
    );
  }

  return (
    <GoogleMap
      mapContainerClassName={`h-52 w-full rounded-xl overflow-hidden ${className}`}
      center={{ lat: workLat, lng: workLng }}
      zoom={15}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    />
  );
}
