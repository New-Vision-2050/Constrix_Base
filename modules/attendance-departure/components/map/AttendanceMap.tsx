"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ZoomControl,
  MapContainerProps,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CustomMarker from "./CustomMarker";
import MapController from "./MapController";
import MapMessageOverlay from "./MapMessageOverlay";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";
import { MapEmployee } from "./types";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

// Extended MapContainer props to include center prop explicitly
interface ExtendedMapContainerProps extends MapContainerProps {
  center: L.LatLngExpression;
  zoom: number;
  zoomControl?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AttendanceMap: React.FC = () => {
  const t = useTranslations("AttendanceDepartureModule.Map");
  const tStatus = useTranslations(
    "AttendanceDepartureModule.Map.employeeStatus"
  );

  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";
  // Default map center (Riyadh)
  const defaultCenter: L.LatLngExpression = [24.7136, 46.6753];
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  // Using map tracking data from context
  const { mapTrackingData, mapTrackingDataLoading, mapTrackingDataError, refetchMapTrackingData } = useAttendance();
  const mapEmployees = mapTrackingData || [];
  const isLoading = mapTrackingDataLoading;

  // Toggle full screen
  const toggleFullScreen = () => {
    if (mapWrapperRef.current) {
      if (!isFullScreen) {
        // Full screen
        document.body.style.overflow = "hidden";
        setIsFullScreen(true);
      } else {
        // Normal
        document.body.style.overflow = "";
        setIsFullScreen(false);
      }

      // Reset map size after change
      setTimeout(() => {
        if (mapInstance) {
          mapInstance.invalidateSize();
        }
      }, 200);
    }
  };

  // Save map reference
  const setMapRef = (map: L.Map) => {
    setMapInstance(map);
  };

  // Ensure full screen is canceled when the component unmounts
  useEffect(() => {
    return () => {
      if (isFullScreen) {
        document.body.style.overflow = "";
      }
    };
  }, [isFullScreen]);

  console.log('mapEmployees', mapEmployees)

  return (
    <div className="relative" ref={mapWrapperRef}>
      <style>{`
        .transparent-tooltip.leaflet-tooltip {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        .transparent-tooltip .leaflet-tooltip-tip {
          display: none;
        }
        .leaflet-control-layers {
          font-family: Arial, sans-serif;
          direction: rtl;
          text-align: right;
        }
        .leaflet-control-layers-toggle {
          width: 30px !important;
          height: 30px !important;
          background-size: 20px 20px !important;
        }
        .leaflet-control-layers-expanded {
          padding: 10px 10px 10px 10px;
        }
        .map-fullscreen {
          position: fixed !important;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          width: 100% !important;
          height: 100vh !important;
          border-radius: 0 !important;
        }
      `}</style>

      <div ref={mapContainerRef} className="relative">
        <MapContainer
          {...({
            center: defaultCenter,
            zoom: 8,
            zoomControl: false,
            className: `rounded-lg ${isFullScreen ? "map-fullscreen" : ""}`,
            style: {
              height: isFullScreen ? "100vh" : "600px",
              width: "100%",
              transition: "height 0.3s ease",
            },
            whenCreated: setMapInstance,
          } as ExtendedMapContainerProps)}
        >
          <MapController isFullScreen={isFullScreen} setMapRef={setMapRef} />
          <ZoomControl position="topright" />

          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name={t("layers.standard")}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name={t("layers.satellite")}>
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                attribution="&copy; Google Maps"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name={t("layers.satellite")}>
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                attribution="&copy; Google Maps"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {mapEmployees.map((employee: MapEmployee,index) => {
            return <CustomMarker index={index} key={employee.attendance_id} employee={employee} />;
          })}

          {isLoading && (
            <MapMessageOverlay type="loading" />
          )}
          
          {mapTrackingDataError && !isLoading && (
            <MapMessageOverlay 
              type="error" 
              onRetry={() => refetchMapTrackingData && refetchMapTrackingData()} 
            />
          )}
          
          {!isLoading && !mapTrackingDataError && mapEmployees.length === 0 && (
            <MapMessageOverlay type="noData" />
          )}
        </MapContainer>
      </div>

      {/* Full screen button */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-3 left-3 z-[1000] shadow-md w-8 h-8 p-0 ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-100"
        }`}
        onClick={toggleFullScreen}
      >
        {isFullScreen ? (
          <Minimize2
            size={18}
            className={isDarkMode ? "text-white" : "text-black"}
          />
        ) : (
          <Maximize2
            size={18}
            className={isDarkMode ? "text-white" : "text-black"}
          />
        )}
      </Button>
    </div>
  );
};

export default AttendanceMap;
