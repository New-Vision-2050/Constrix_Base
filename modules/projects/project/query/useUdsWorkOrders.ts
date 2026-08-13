import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type { UdsWorkOrderDto } from "@/services/api/projects/project-order-permits/types/response";

export const udsWorkOrdersQueryKey = (
  projectId?: string,
  name?: string,
  orderPermitId?: string,
) =>
  ["uds-work-orders", projectId ?? "", name ?? "", orderPermitId ?? ""] as const;

function normalizeUdsPayload(payload: unknown): UdsWorkOrderDto | null {
  if (!payload) return null;

  if (Array.isArray(payload)) {
    return (payload[0] as UdsWorkOrderDto | undefined) ?? null;
  }

  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) {
      return (obj.data[0] as UdsWorkOrderDto | undefined) ?? null;
    }
    if (
      "assigned_date" in obj ||
      "price" in obj ||
      "contractor" in obj ||
      "executing_entity" in obj
    ) {
      return payload as UdsWorkOrderDto;
    }
  }

  return null;
}

export function useUdsWorkOrders(
  projectId: string | undefined,
  name: string | undefined,
  orderPermitId: string | number | undefined,
) {
  const trimmedName = name?.trim() ?? "";
  const permitId =
    orderPermitId != null && String(orderPermitId).trim() !== ""
      ? String(orderPermitId).trim()
      : "";

  return useQuery({
    queryKey: udsWorkOrdersQueryKey(projectId, trimmedName, permitId),
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.listUdsWorkOrders(projectId!, {
        name: trimmedName,
        order_permit_id: permitId,
      });
      return normalizeUdsPayload(res.data?.payload);
    },
    enabled: !!projectId && trimmedName.length >= 2 && !!permitId,
    retry: false,
  });
}
