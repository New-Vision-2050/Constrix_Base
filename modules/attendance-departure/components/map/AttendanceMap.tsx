"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { staticAttendanceData } from "../../constants/static-data";
import CustomMarker from "./CustomMarker";
import MapController from "./MapController";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

const AttendanceMap: React.FC = () => {
  const position: [number, number] = [24.7136, 46.6753]; // Default map center (Riyadh)
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  // Toggle full screen
  const toggleFullScreen = () => {
    if (mapWrapperRef.current) {
      if (!isFullScreen) {
        // Full screen
        document.body.style.overflow = 'hidden';
        setIsFullScreen(true);
      } else {
        // Normal
        document.body.style.overflow = '';
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
        document.body.style.overflow = '';
      }
    };
  }, [isFullScreen]);

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

      <div
        ref={mapContainerRef}
        className="relative"
      >
        <MapContainer
          center={position}
          zoom={8}
          style={{
            height: isFullScreen ? "100vh" : "600px",
            width: "100%",
            transition: "height 0.3s ease"
          }}
          className={`rounded-lg ${isFullScreen ? "map-fullscreen" : ""}`}
          zoomControl={false}
        >
          <MapController isFullScreen={isFullScreen} setMapRef={setMapRef} />
          <ZoomControl position="topright" />

          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="خريطة الشارع">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="صور القمر الصناعي">
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                attribution="&copy; Google Maps"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="خريطة القمر الصناعي">
              <TileLayer 
                url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                attribution="&copy; Google Maps"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {staticAttendanceData.map((employee) => (
            <CustomMarker key={employee.id} employee={employee} />
          ))}
        </MapContainer>
      </div>

      {/* زر تبديل وضع ملء الشاشة */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 left-3 z-[1000] bg-white shadow-md hover:bg-gray-100 w-8 h-8 p-0"
        onClick={toggleFullScreen}
      >
        {isFullScreen ? <Minimize2 size={18} className="text-black" /> : <Maximize2 size={18} className="text-black" />}
      </Button>
    </div>
  );
};

export default AttendanceMap;
