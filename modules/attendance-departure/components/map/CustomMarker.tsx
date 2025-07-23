import React from "react";
import { Marker, MarkerProps } from "react-leaflet";
import L from "leaflet";
// Using type casting instead of module augmentation
import { AttendanceRecord } from "../../constants/static-data";
import EmployeeTooltip from "./EmployeeTooltip";
import { useAttendance } from "../../context/AttendanceContext";
import { EmployeeDetails } from "../../types/employee";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const getMarkerIcon = (
  record: AttendanceRecord,
  isDarkMode: boolean = true
) => {
  let _status = "";
  if (record.is_absent === 1) {
    _status = "absent";
  } else if (record.is_holiday === 1) {
    _status = "holiday";
  } else if (record.is_late === 1) {
    _status = "late";
  } else if (record.status === "active" || record.status === "completed") {
    _status = "present";
  }
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
  employee: AttendanceRecord;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ employee }) => {
  // Use attendance context to open employee dialog
  const { openEmployeeDialog } = useAttendance();
  const t = useTranslations("attendanceDeparture.status");

  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  // Function to convert attendance statuses from English to Arabic
  const mapAttendanceStatus = (record: AttendanceRecord): string => {
    let _status = "";
    if (record.is_absent === 1) {
      _status = "absent";
    } else if (record.is_holiday === 1) {
      _status = "holiday";
    } else if (record.is_late === 1) {
      _status = "late";
    } else if (record.status === "active" || record.status === "completed") {
      _status = "present";
    }

    // Map the backend status to display text
    switch (_status) {
      case "present":
        return t("present");
      case "absent":
        return t("absent");
      case "late":
        return t("late");
      case "holiday":
        return t("holiday");
      default:
        return t("unspecified");
    }
  };

  // Convert employee data to match the new component
  const handleMarkerClick = () => {
    // Convert AttendanceRecord type to EmployeeDetails
    const employeeDetails: EmployeeDetails = {
      id: employee.id.toString(), // Convert number to string
      name: employee.name,
      phone: employee?.user?.phone || "-", // Use employee ID as phone number
      department: employee.department || "-",
      email: employee?.user?.email || "-", // Create default email
      branch: employee.branch || "-",
      gender: employee.user?.gender || "-", // Default value
      birthDate: employee.user?.birthdate || "-", // Default value
      nationality: employee.user?.country || "-", // Default value
      attendanceStatus: mapAttendanceStatus(employee), // Convert attendance status
      employeeStatus: employee.employeeStatus || "-",
      // Use actual clock in/out times if available, otherwise use defaults
      checkInTime:
        employee.clock_in_time ||
        (employee.attendanceStatus === "present" ||
        employee.attendanceStatus === "late"
          ? "08:30"
          : undefined),
      checkOutTime:
        employee.clock_out_time ||
        (employee.attendanceStatus === "present" ? "17:00" : undefined),
      // The updated component uses checkInTime and checkOutTime which are already set above
      avatarUrl: undefined, // No default avatar
    };

    openEmployeeDialog(employeeDetails);
  };

  // Create marker position and properties for proper type handling
  const position: [number, number] = [
    employee.location.lat,
    employee.location.lng,
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
    <Marker key={employee.id} {...markerProps}>
      <EmployeeTooltip employee={employee} />
    </Marker>
  );
};

export default CustomMarker;
