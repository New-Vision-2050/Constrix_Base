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
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Loader2 } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";
import { AttendanceRecord } from "../../constants/static-data";
import { useTranslations } from "next-intl";

// Extended MapContainer props to include center prop explicitly
interface ExtendedMapContainerProps extends MapContainerProps {
  center: L.LatLngExpression;
  zoom: number;
  zoomControl?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AttendanceMap: React.FC = () => {
  const t = useTranslations('AttendanceDepartureModule.Map');
  const tStatus = useTranslations('AttendanceDepartureModule.Map.employeeStatus');
  // Default map center (Riyadh)
  const defaultCenter: L.LatLngExpression = [24.7136, 46.6753];
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  // Get team attendance data from context
  const { teamAttendance, teamAttendanceLoading } = useAttendance();

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

  console.log('teamAttendance', teamAttendance)
  
  // Log each employee's location data
  teamAttendance.forEach((record, index) => {
    console.log(`Employee ${index + 1}: ${record.user?.name || 'Unknown'}`, {
      has_location: !!record.clock_in_location,
      latitude: record.clock_in_location?.latitude,
      longitude: record.clock_in_location?.longitude,
      will_use_default: !record.clock_in_location?.latitude || !record.clock_in_location?.longitude
    });
  });

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
            <LayersControl.BaseLayer checked name={t('layers.standard')}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name={t('layers.satellite')}>
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                attribution="&copy; Google Maps"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name={t('layers.satellite')}>
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                attribution="&copy; Google Maps"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {!teamAttendanceLoading &&
            teamAttendance.map((record) => {
              // Convert AttendanceStatusRecord to AttendanceRecord format expected by CustomMarker
              // Create a small offset for employees with missing location data
              const defaultLat = 24.7136;
              const defaultLng = 46.6753;
              const hasLocation = record.clock_in_location?.latitude && record.clock_in_location?.longitude;
              
              // If no location data, create a small offset based on employee ID to spread out markers
              const idOffset = parseInt(record.user?.id || '0') % 50;
              const latOffset = hasLocation ? 0 : (idOffset * 0.001); // Small offset based on ID
              const lngOffset = hasLocation ? 0 : (idOffset * 0.002); // Slightly larger offset for longitude
              
              const employee: AttendanceRecord = {
                id:
                  parseInt(record.user?.id) ||
                  Math.floor(Math.random() * 10000),
                name: record.user?.name || "-",
                user: record.user,
                clock_in_time: record.clock_in_time || "-",
                clock_out_time: record.clock_out_time || "-",
                date:
                  record.work_date || new Date().toISOString().split("T")[0],
                employeeId: record.professional_data?.job_code || "",
                branch: record.professional_data?.branch || "-",
                department: record.professional_data?.management || "-",
                approver: record.applied_constraints?.[0]?.name || "-",
                employeeStatus: record.is_clocked_in === 1 ? tStatus('active') : tStatus('inactive'),
                // Map status to expected format
                attendanceStatus:
                  record.is_late === 1
                    ? "late"
                    : record.status === "absent"
                    ? "absent"
                    : record.status === "excused"
                    ? "excused"
                    : "present",
                location: {
                  lat: record.clock_in_location?.latitude || (defaultLat + latOffset),
                  lng: record.clock_in_location?.longitude || (defaultLng + lngOffset),
                },
              };
              return <CustomMarker key={employee.id} employee={employee} />;
            })}

          {/* Show loading spinner when data is loading */}
          {teamAttendanceLoading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
              <span className="text-gray-700 font-medium">
                {t('loading')}
              </span>
            </div>
          )}
        </MapContainer>
      </div>

      {/* Full screen button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 left-3 z-[1000] bg-white shadow-md hover:bg-gray-100 w-8 h-8 p-0"
        onClick={toggleFullScreen}
      >
        {isFullScreen ? (
          <Minimize2 size={18} className="text-black" />
        ) : (
          <Maximize2 size={18} className="text-black" />
        )}
      </Button>
    </div>
  );
};

export default AttendanceMap;
