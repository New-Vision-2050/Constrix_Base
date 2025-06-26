import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { AttendanceRecord } from '../../constants/static-data';
import EmployeeTooltip from './EmployeeTooltip';
import { useAttendance } from '../../context/AttendanceContext';
import { EmployeeDetails } from '../../types/employee';

// Function to convert attendance statuses from English to Arabic
const mapAttendanceStatus = (status: string): string => {
    switch (status) {
        case 'present': return 'حاضر';
        case 'absent': return 'غائب';
        case 'late': return 'متأخر';
        case 'excused': return 'إجازة';
        default: return '-';
    }
};

const getMarkerIcon = (status: string) => {
    const colorMap: { [key: string]: string } = {
        present: "#28a745", // green
        late: "#ffc107", // orange
        absent: "#dc3545", // red
        excused: "#6c757d", // gray
    };
    const color = colorMap[status as keyof typeof colorMap] || "#6c757d";

    const markerHtml = `
    <div style="
      background-color: white;
      border-radius: 12px;
      padding: 4px;
      width: 42px;
      height: 42px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px dashed ${color};
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
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
    
    // Convert employee data to match the new component
    const handleMarkerClick = () => {
        // Convert AttendanceRecord type to EmployeeDetails
        const employeeDetails: EmployeeDetails = {
            id: employee.id.toString(), // Convert number to string
            name: employee.name,
            phone: employee.employeeId || '-', // Use employee ID as phone number
            department: employee.department || '-',
            email: `${employee.employeeId}@example.com`, // Create default email
            branch: employee.branch || '-',
            gender: '-', // Default value
            birthDate: '-', // Default value
            nationality: '-', // Default value
            attendanceStatus: mapAttendanceStatus(employee.attendanceStatus), // Convert attendance status
            employeeStatus: employee.employeeStatus || '-',
            checkInTime: employee.attendanceStatus === 'present' || employee.attendanceStatus === 'late' ? '08:30' : undefined, // Default check-in time
            checkOutTime: employee.attendanceStatus === 'present' ? '17:00' : undefined, // Default check-out time
            avatarUrl: undefined // No default avatar
        };
        
        openEmployeeDialog(employeeDetails);
    };
    
    return (
        <Marker
            key={employee.id}
            position={[employee.location.lat, employee.location.lng]}
            icon={getMarkerIcon(employee.attendanceStatus)}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        >
            <EmployeeTooltip employee={employee} />
        </Marker>
    );
};

export default CustomMarker;
