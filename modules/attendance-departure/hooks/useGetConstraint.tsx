import { useQuery } from '@tanstack/react-query'
import getConstraint from '../api/getConstraint'

export default function useConstraintData(constraint_id: string) {
  return useQuery({
    queryKey: [`constraint-data`, constraint_id],
    queryFn: () => getConstraint(constraint_id),
    enabled: !!constraint_id, // run only if id is truthy
    refetchOnWindowFocus: false // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  })
}
