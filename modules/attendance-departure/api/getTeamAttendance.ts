import { apiClient } from "@/config/axios-config";
import { AttendanceStatusRecord } from "../types/attendance";

/**
 * Optional parameters for fetching team attendance
 */
export interface GetTeamAttendanceParams {
  start_date?: string;
  end_date?: string;
  search_text?: string;
  approver?: string;
  department?: string;
  branch?: string;
}

/**
 * Fetches team attendance data including location information for map display
 * @param params Optional parameters including start_date and end_date
 * @returns Promise with team members' attendance data including geo-coordinates
 */
export const getTeamAttendance = async (params?: GetTeamAttendanceParams): Promise<AttendanceStatusRecord[]> => {
  // Add query parameters if provided
  let url = "/attendance/team";
  if (params) {
    // Create URLSearchParams object
    const queryParams = new URLSearchParams();

    // Handle all parameters, checking each explicitly with appropriate type checking
    // Date params
    if (params.start_date && typeof params.start_date === 'string') {
      queryParams.append("start_date", params.start_date);
    }
    
    if (params.end_date && typeof params.end_date === 'string') {
      queryParams.append("end_date", params.end_date);
    }
    
    // التعامل مع قيمة search_text للتأكد من إضافتها حتى لو كانت سلسلة فارغة
    if ('search_text' in params) {
      if(params.search_text){
        const searchValue = params.search_text || ''; // حتى لو كانت قيمتها undefined أو null، نستخدم سلسلة فارغة
        queryParams.append("user_search", searchValue);
      }
    } else {
      console.log("search_text property is not present in params object!");
    }
    
    // Filter params
    if (params.approver) {
      queryParams.append("constraint_id", params.approver);
    }
    
    if (params.department) {
      queryParams.append("management_id", params.department);
    }
    
    if (params.branch) {
      queryParams.append("branch_id", params.branch);
    }
    
    const queryString = queryParams.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }
  }

  const response = await apiClient.get(url);
  return response.data.payload;
};
