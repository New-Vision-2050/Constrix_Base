import { useQuery } from '@tanstack/react-query'
import fetchManagementsTreeData from '../api/fetch-managements-tree-data'

export default function useManagementsTreeData(branchId: string | number) {
  return useQuery({
    queryKey: [`managements-tree-data`, branchId],
    queryFn: () => fetchManagementsTreeData(branchId),
    enabled: !!branchId, // run only if id is truthy
    refetchOnWindowFocus: false // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  })
}
