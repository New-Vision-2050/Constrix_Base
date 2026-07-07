"use client";

import React, { useEffect, useRef, forwardRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LOADER_OPTIONS } from "@/config/google-maps";
import { MapEvents } from "./MapEvents";

/**
 * Props for the MapRangePicker component
 */
interface MapRangePickerProps {
  /**
   * Callback fired when a location is selected on the map
   * @param lat - Latitude of the selected location
   * @param lng - Longitude of the selected location
   */
  onSelect: (lat: number, lng: number) => void;

  /**
   * Current pin position on the map
   */
  currentPin?: {
    lat: number;
    lng: number;
  };

  /**
   * Radius of the circle in meters (default: 1000)
   */
  radius?: number;

  /**
   * Initial center of the map (default: Riyadh)
   */
  center?: {
    lat: number;
    lng: number;
  };

  /**
   * Initial zoom level (default: 12)
   */
  zoom?: number;

  /**
   * Container className for styling
   */
  className?: string;

  /**
   * Height of the map container (default: 450px)
   */
  height?: string;

  /**
   * Width of the map container (default: 100%)
   */
  width?: string;

  /**
   * Whether the map is disabled
   */
  disabled?: boolean;
}

// Default center for the map (Riyadh, Saudi Arabia)
const DEFAULT_CENTER = {
  lat: 21.4225,
  lng: 39.8262,
};

// Default radius in meters
const DEFAULT_RADIUS = 1000;

// Default zoom level
const DEFAULT_ZOOM = 16;

// Container style for the Google Map
const createContainerStyle = (
  width: string = "100%",
  height: string = "450px",
): React.CSSProperties => ({
  width,
  height,
  borderRadius: "8px",
});

/**
 * MapRangePicker component - A Google Map component for selecting a geographic location
 * with an optional radius circle around it.
 *
 * @example
 * ```tsx
 * <MapRangePicker
 *   onSelect={(lat, lng) => console.log(lat, lng)}
 *   currentPin={{ lat: 21.4225, lng: 39.8262 }}
 *   radius={2000}
 *   zoom={13}
 * />
 * ```
 */
const MapRangePicker = forwardRef<HTMLDivElement, MapRangePickerProps>(
  (
    {
      onSelect,
      currentPin,
      radius = DEFAULT_RADIUS,
      center = DEFAULT_CENTER,
      zoom = DEFAULT_ZOOM,
      className = "",
      height = "450px",
      width = "100%",
      disabled = false,
    },
    ref,
  ) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);
    /** Set when `onLoad` runs so marker/circle/listener effects rerun after the map exists. */
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");

    const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

    // Initialize marker when the map is ready or pin changes
    useEffect(() => {
      if (!isLoaded || !mapInstance) return;

      if (currentPin) {
        if (!markerRef.current) {
          markerRef.current = new window.google.maps.Marker({
            map: mapInstance,
            position: currentPin,
            title: "Current Location",
          });
        } else {
          markerRef.current.setPosition(currentPin);
        }
      } else {
        if (markerRef.current) {
          markerRef.current.setMap(null);
          markerRef.current = null;
        }
      }
    }, [currentPin, isLoaded, mapInstance]);

    // Initialize / update circle when map, pin, center, or radius changes
    useEffect(() => {
      if (!isLoaded || !mapInstance) return;

      const circleCenter = currentPin ?? center;

      if (!circleRef.current) {
        circleRef.current = new window.google.maps.Circle({
          map: mapInstance,
          center: circleCenter,
          radius,
          fillColor: "#4F46E5",
          fillOpacity: 0.1,
          strokeColor: "#4F46E5",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        });
      } else {
        circleRef.current.setCenter(circleCenter);
        circleRef.current.setRadius(radius);
      }
    }, [isLoaded, mapInstance, currentPin, center, radius]);

    // Keep viewport aligned with the pin when it updates (e.g. dialog initial values or inputs).
    useEffect(() => {
      if (!mapInstance || !currentPin) return;
      mapInstance.panTo(currentPin);
    }, [mapInstance, currentPin?.lat, currentPin?.lng]);

    if (!isLoaded) {
      return (
        <div
          ref={ref}
          className={`flex items-center justify-center rounded-lg bg-gray-100 ${className}`}
          style={{
            width,
            height,
          }}
        >
          <span className="text-gray-500">Loading map...</span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`map-range-picker-container relative ${className}`}
        style={{ width, height }}
      >
        {/* Map Type Toggle Buttons */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-2 bg-white rounded-lg shadow-md p-1">
          <button
            onClick={() => setMapType("roadmap")}
            className={`px-3 py-2 rounded font-medium text-sm transition-all ${
              mapType === "roadmap"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="Toggle to 2D view"
            disabled={disabled}
          >
            2D
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`px-3 py-2 rounded font-medium text-sm transition-all ${
              mapType === "satellite"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="Toggle to satellite view"
            disabled={disabled}
          >
            Satellite
          </button>
        </div>
        <GoogleMap
          mapContainerStyle={createContainerStyle(width, height)}
          center={currentPin || center}
          zoom={zoom}
          onLoad={(map) => {
            mapRef.current = map;
            setMapInstance(map);
          }}
          onUnmount={() => {
            markerRef.current?.setMap(null);
            markerRef.current = null;
            circleRef.current?.setMap(null);
            circleRef.current = null;
            mapRef.current = null;
            setMapInstance(null);
          }}
          options={{
            disableDefaultUI: disabled,
            zoomControl: !disabled,
            fullscreenControl: !disabled,
            mapTypeId: mapType,
          }}
        >
          <MapEvents
            mapInstance={mapInstance}
            markerRef={markerRef}
            circleRef={circleRef}
            onSelect={onSelect}
            radius={radius}
          />
        </GoogleMap>
      </div>
    );
  },
);

MapRangePicker.displayName = "MapRangePicker";

export { MapRangePicker };
export type { MapRangePickerProps };
