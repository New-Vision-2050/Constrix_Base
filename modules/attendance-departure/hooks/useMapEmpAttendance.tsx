import { useQuery } from "@tanstack/react-query";
import getMapEmpAttendanceHistory from "../api/get-attendance-history";

export default function useMapEmpAttendance(user_id: string) {
  return useQuery({
    queryKey: [`map-emp-attendance`, user_id],
    queryFn: () => getMapEmpAttendanceHistory(user_id),
    enabled: !!user_id, // run only if id is truthy
    refetchOnWindowFocus: false // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  })
}
