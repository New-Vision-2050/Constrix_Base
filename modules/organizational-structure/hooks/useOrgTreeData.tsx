import { useQuery } from '@tanstack/react-query'
import fetchOrgTreeData from '../api/fetch-org-tree-data'

export default function useOrgTreeData(branchId: string | number) {
  return useQuery({
    queryKey: [`org-tree-data`, branchId],
    queryFn: () => fetchOrgTreeData(branchId),
    enabled: !!branchId, // run only if id is truthy
    refetchOnWindowFocus: false // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  })
}
