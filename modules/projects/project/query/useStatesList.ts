import { useQuery } from "@tanstack/react-query";
import { getStatesList } from "@/services/api/shared/countries";
import type { CountryStateCityItem } from "@/services/api/shared/countries";

export const statesListQueryKey = ["countries", "states-list"] as const;

export interface StateOption {
  id: string;
  name: string;
}

function mapStateItem(item: CountryStateCityItem): StateOption {
  return {
    id: String(item.id),
    name: item.name.trim(),
  };
}

export function useStatesList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: statesListQueryKey,
    queryFn: async () => {
      const response = await getStatesList();
      const payload = response.data.payload;
      if (!Array.isArray(payload)) {
        return [] as StateOption[];
      }
      return payload.map(mapStateItem).filter((item) => item.id && item.name);
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export function getStateLabel(
  states: StateOption[],
  stateId: string,
): string {
  return states.find((state) => state.id === stateId)?.name ?? stateId;
}
