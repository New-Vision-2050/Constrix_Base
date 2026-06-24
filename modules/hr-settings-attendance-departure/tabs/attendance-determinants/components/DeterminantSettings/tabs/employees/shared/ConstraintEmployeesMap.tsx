"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ZoomControl,
  MapContainerProps,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Maximize2, Minimize2, RefreshCw, Table } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import MapController from "@/modules/attendance-departure/components/map/MapController";
import MapMessageOverlay from "@/modules/attendance-departure/components/map/MapMessageOverlay";
import type { MapEmployee } from "@/modules/attendance-departure/components/map/types";
import { ProjectMapMarker } from "@/modules/projects/project/components/project-tabs/tabs/staff/shared/ProjectMapMarker";
import { useConstraintMapTrackingData } from "../query/useConstraintMapTrackingData";

interface ExtendedMapContainerProps extends MapContainerProps {
  center: L.LatLngExpression;
  zoom: number;
  zoomControl?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type ConstraintEmployeesMapProps = {
  constraintId: string;
  onBackToTable: () => void;
};

const DEFAULT_CENTER: L.LatLngExpression = [24.7136, 46.6753];

export function ConstraintEmployeesMap({
  constraintId,
  onBackToTable,
}: ConstraintEmployeesMapProps) {
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.selectedEmployees",
  );
  const tMap = useTranslations("AttendanceDepartureModule.Map");
  const tMapFilter = useTranslations("AttendanceDepartureModule.MapSearchFilter");
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const {
    data: mapEmployees = [],
    isLoading,
    error,
    refetch,
  } = useConstraintMapTrackingData({
    constraintId,
    enabled: Boolean(constraintId),
  });

  const employeesWithLocation = mapEmployees.filter(
    (employee: MapEmployee) =>
      employee.latest_location?.latitude != null &&
      employee.latest_location?.longitude != null,
  );

  const toggleFullScreen = () => {
    if (!mapWrapperRef.current) return;

    if (!isFullScreen) {
      document.body.style.overflow = "hidden";
      setIsFullScreen(true);
    } else {
      document.body.style.overflow = "";
      setIsFullScreen(false);
    }

    setTimeout(() => {
      mapInstance?.invalidateSize();
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (isFullScreen) {
        document.body.style.overflow = "";
      }
    };
  }, [isFullScreen]);

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button className="h-9 gap-2" onClick={onBackToTable}>
          <Table className="h-4 w-4" />
          {t("tableView")}
        </Button>
        <Button variant="outline" className="h-9 gap-2" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
          {tMapFilter("refresh")}
        </Button>
      </div>

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

        <MapContainer
          {...({
            center: DEFAULT_CENTER,
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
          <MapController isFullScreen={isFullScreen} setMapRef={setMapInstance} />
          <ZoomControl position="topright" />

          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name={tMap("layers.standard")}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name={tMap("layers.satellite")}>
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                attribution="&copy; Google Maps"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {employeesWithLocation.map((employee, index) => (
            <ProjectMapMarker
              key={employee.attendance_id}
              employee={employee}
              index={index}
            />
          ))}

          {isLoading && <MapMessageOverlay type="loading" />}

          {error && !isLoading && (
            <MapMessageOverlay type="error" onRetry={() => refetch()} />
          )}

          {!isLoading && !error && employeesWithLocation.length === 0 && (
            <MapMessageOverlay type="noData" />
          )}
        </MapContainer>

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
    </div>
  );
}
