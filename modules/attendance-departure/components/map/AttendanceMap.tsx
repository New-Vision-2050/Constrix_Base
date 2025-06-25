"use client";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { staticAttendanceData } from "../../constants/static-data";
import CustomMarker from "./CustomMarker";

const AttendanceMap: React.FC = () => {
  const position: [number, number] = [24.7136, 46.6753]; // Default map center (Riyadh)

  return (
    <>
      <style>{`
                .transparent-tooltip.leaflet-tooltip {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                }
                .transparent-tooltip .leaflet-tooltip-tip {
                    display: none;
                }
            `}</style>
      <MapContainer
        center={position}
        zoom={8}
        style={{ height: "600px", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {staticAttendanceData.map((employee) => (
          <CustomMarker key={employee.id} employee={employee} />
        ))}
      </MapContainer>
    </>
  );
};

export default AttendanceMap;
