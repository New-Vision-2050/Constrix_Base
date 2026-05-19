"use client";

import { useEffect } from "react";

/**
 * MapEvents sub-component handles click events on the Google Map
 * and updates the marker position when the user clicks on the map.
 */
interface MapEventsProps {
  mapInstance: google.maps.Map | null;
  markerRef: React.MutableRefObject<google.maps.Marker | null>;
  circleRef: React.MutableRefObject<google.maps.Circle | null>;
  onSelect: (lat: number, lng: number) => void;
  radius?: number;
}

export const MapEvents: React.FC<MapEventsProps> = ({
  mapInstance,
  markerRef,
  circleRef,
  onSelect,
  radius = 1000,
}) => {
  useEffect(() => {
    if (!mapInstance) return;

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // Update marker position
      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
      }

      // Update circle center
      if (circleRef.current) {
        circleRef.current.setCenter({ lat, lng });
      }

      // Call the onSelect callback
      onSelect(lat, lng);
    };

    const listener = mapInstance.addListener("click", handleMapClick);

    return () => {
      listener.remove();
    };
  }, [mapInstance, markerRef, circleRef, onSelect, radius]);

  return null;
};
