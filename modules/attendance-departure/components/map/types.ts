// Data types for attendance and departure map

// Location data type
export interface MapLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy: number;
}

// Employee user data type in the map
export interface MapEmployeeUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  birthdate: string;
  gender: string;
  branch_name: string;
  department_name: string;
  management_name: string;
}

// Employee data type in the map
export interface MapEmployee {
  attendance_id: string;
  user: MapEmployeeUser;
  clock_in_time: string;
  latest_location: MapLocation;
  tracking_path: MapLocation[];
}
