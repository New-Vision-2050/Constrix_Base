import React from "react";
import { Marker, MarkerProps } from "react-leaflet";
import L from "leaflet";
// Import the new type
import { MapEmployee } from "./types";
import EmployeeTooltip from "./EmployeeTooltip";
import { useAttendance } from "../../context/AttendanceContext";
import { EmployeeDetails } from "../../types/employee";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const getMarkerIcon = (
  employee: MapEmployee,
  isDarkMode: boolean = true
) => {
  // We use a default status for displaying employees (can be modified later when status fields are available)
  let _status = "present";
  const colorMap: { [key: string]: string } = {
    present: "#28a745", // green
    late: "#ffc107", // orange
    absent: "#dc3545", // red
    excused: "#6c757d", // gray
  };
  const color = colorMap[_status as keyof typeof colorMap] || "#6c757d";

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
};

interface CustomMarkerProps {
  employee: MapEmployee;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ employee }) => {
  // Use attendance context to open employee dialog
  const { openEmployeeDialog ,attendanceHistory ,fetchAttendanceHistory } = useAttendance();
  const t = useTranslations("attendanceDeparture.status");

  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  // Function to get attendance status (simplified for now)
  const mapAttendanceStatus = (): string => {
    // Use default value for attendance status
    return t("present");
  };

  // Convert employee data to match the new component
  const handleMarkerClick = () => {
    // Convert MapEmployee type to EmployeeDetails using the new structure
    const employeeDetails: EmployeeDetails = {
      id: employee.attendance_id,
      user_id: employee.user.id,
      name: employee.user.name,
      phone: employee.user.phone || "-",
      department: employee.user.department_name || "-",
      email: employee.user.email || "-",
      branch: employee.user.branch_name || "-",
      gender: employee.user.gender || "-",
      birthDate: employee.user.birthdate || "-",
      nationality: "-", // Default value (still not available)
      attendanceStatus: mapAttendanceStatus(), // Attendance status
      employeeStatus: "Active", // Default value
      // Use available check-in time
      checkInTime: employee.clock_in_time || "08:30",
      // Default value for check-out time
      checkOutTime: undefined,
      avatarUrl: undefined, // No default avatar
    };
    // fetchAttendanceHistory(employee.id.toString(), , employee.date);

    openEmployeeDialog(employeeDetails);
  };
  // Create marker position and properties for proper type handling
  const position: [number, number] = [
    employee.latest_location.latitude,
    employee.latest_location.longitude,
  ];
  const markerIcon = getMarkerIcon(employee, isDarkMode);

  // Create custom props for the marker with proper typings
  const markerProps: any = {
    position,
    icon: markerIcon,
    eventHandlers: {
      click: handleMarkerClick,
    },
  };

  return (
    <Marker key={employee.attendance_id} {...markerProps}>
      <EmployeeTooltip employee={employee} />
    </Marker>
  );
};

export default CustomMarker;
