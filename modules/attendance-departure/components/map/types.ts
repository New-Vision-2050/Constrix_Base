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
  country: string;
  branch_name: string;
  department_name: string;
  management_name: string;
}

// Employee data type in the map
export interface MapEmployee {
  attendance_id: string;
  user: MapEmployeeUser;
  clock_in_time: string;
  is_absent: number;
  is_holiday: number;
  is_late: number;
  status: string;
  latest_location: MapLocation;
  tracking_path: MapLocation[];
}

// Location tracking point type
export interface LocationTrackingPoint {
  accuracy: number;
  latitude: number;
  device_id: string;
  longitude: number;
  timestamp: string;
  app_version: string;
  network_type: string;
  battery_level: number;
  location_source: string;
}

// Geographic location type
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// Company translation type
export interface CompanyTranslation {
  id: number;
  locale: string;
  translatable_type: string;
  translatable_id: string;
  field: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// User type in the attendance record
export interface AttendanceUser {
  id: string;
  registration_form_id: string | null;
  name: string;
  email: string;
  phone_code: string;
  phone: string;
  email_verified_at: string | null;
  login_way_id: string | null;
  created_at: string;
  updated_at: string;
  global_company_user_id: string;
  company_id: string;
  is_owner: number;
  deleted_at: string | null;
  management_hierarchy_id: string;
  status: number;
  message_address: string | null;
  translations: any[];
}

// Company type in the attendance record
export interface AttendanceCompany {
  id: string;
  user_name: string;
  serial_no: string;
  email: string;
  phone: string;
  complete_data: number;
  is_active: number;
  check_activity: number;
  date_activate: string;
  country_id: string;
  company_type_id: string;
  company_field_id: string;
  registration_type_id: string;
  general_manager_id: string;
  created_at: string | null;
  updated_at: string;
  data: any | null;
  is_central_company: number;
  time_zone: string | null;
  deleted_at: string | null;
  translations: CompanyTranslation[];
}

// Single attendance record type
export interface AttendanceRecord {
  id: string;
  user_id: string;
  company_id: string;
  day_status: string;
  clock_in_time: string;
  clock_out_time: string | null;
  start_time: string | null;
  end_time: string | null;
  break_start_time: string | null;
  break_end_time: string | null;
  total_work_hours: string;
  total_break_hours: string;
  overtime_hours: string;
  is_late: boolean;
  is_holiday: number;
  is_absent: number;
  is_early_departure: boolean;
  late_minutes: number;
  early_departure_minutes: number;
  status: "active" | "completed" | string;
  notes: string;
  clock_in_location: GeoLocation;
  clock_out_location: GeoLocation | null;
  ip_address: string | null;
  user_agent: string;
  timezone: string;
  location_tracking: LocationTrackingPoint[] | null;
  verification_data: any | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: AttendanceUser;
  company: AttendanceCompany;
}

// Full attendance history response type
export interface AttendanceHistory {
  [timeRangeKey: string]: AttendanceRecord[];
}
