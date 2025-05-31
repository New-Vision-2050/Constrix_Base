import { useQuery } from '@tanstack/react-query'
import fetchEmployeesTreeData from '../api/fetch-employees-tree-data'

export default function useEmployeesTreeData(branchId: string | number) {
  return useQuery({
    queryKey: [`employees-tree-data`, branchId],
    queryFn: () => fetchEmployeesTreeData(branchId),
    enabled: !!branchId, // run only if id is truthy
    refetchOnWindowFocus: false // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  })
}
