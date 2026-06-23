"use client";

import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import { useTheme } from "next-themes";
import type { MapEmployee } from "@/modules/attendance-departure/components/map/types";
import EmployeeTooltip from "@/modules/attendance-departure/components/map/EmployeeTooltip";

function getMarkerIcon(employee: MapEmployee, isDarkMode: boolean) {
  let status = "present";
  if (employee.is_absent) status = "absent";
  else if (employee.is_late) status = "late";
  else if (employee.is_holiday) status = "holiday";
  else if (employee.status === "active" || employee.status === "completed") {
    status = "present";
  }

  const colorMap: Record<string, string> = {
    present: "#28a745",
    late: "#ffc107",
    absent: "#dc3545",
    holiday: "#3b82f6",
  };
  const color = colorMap[status] ?? "#6c757d";
  const backgroundColor = isDarkMode ? "#1e293b" : "white";
  const borderStyle = isDarkMode ? "dashed" : "solid";
  const shadowColor = isDarkMode ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.15)";

  const markerHtml = `
    <div style="
      background-color: ${backgroundColor};
      border-radius: 12px;
      padding: 4px;
      width: 42px;
      height: 42px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px ${borderStyle} ${color};
      box-shadow: 0 2px 5px ${shadowColor};">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
    </div>`;

  return L.divIcon({
    className: "custom-marker-icon",
    html: markerHtml,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });
}

type ProjectMapMarkerProps = {
  employee: MapEmployee;
  index: number;
};

export function ProjectMapMarker({ employee, index }: ProjectMapMarkerProps) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const location = employee.latest_location;
  if (
    location?.latitude == null ||
    location?.longitude == null ||
    Number.isNaN(Number(location.latitude)) ||
    Number.isNaN(Number(location.longitude))
  ) {
    return null;
  }

  const position: [number, number] = [
    location.latitude + index * 0.0001,
    location.longitude + index * 0.0001,
  ];

  return (
    <Marker
      key={employee.attendance_id}
      position={position}
      icon={getMarkerIcon(employee, isDarkMode)}
    >
      <EmployeeTooltip employee={employee} />
    </Marker>
  );
}
