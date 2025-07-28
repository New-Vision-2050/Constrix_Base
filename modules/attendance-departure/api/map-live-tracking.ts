import { apiClient } from "@/config/axios-config";
import { MapEmployee } from "../components/map/types";

/**
 * Optional parameters for fetching team attendance
 */
export interface GetMapLiveTrackingParams {
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
export const getMapLiveTracking = async (params?: GetMapLiveTrackingParams): Promise<MapEmployee[]> => {
  // Add query parameters if provided
  let url = "/attendance/live-tracking";
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
    
    // Handle search_text value to ensure it's added even if it's an empty string
    if ('search_text' in params) {
      if(params.search_text){
        const searchValue = params.search_text || ''; // Even if the value is undefined or null, use an empty string
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
